import type { ParsedJobPosting } from "../domain/services/job-link-enrichment-service";

export type JobPostingParser = {
  parseJobPosting(html: string | null, url: string): ParsedJobPosting;
};

type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_match, code: string) => String.fromCharCode(Number(code)))
    .replace(/&#x([a-f0-9]+);/gi, (_match, code: string) => String.fromCharCode(Number.parseInt(code, 16)));
}

function cleanText(value: string | null | undefined) {
  const decoded = decodeHtmlEntities(value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return decoded || null;
}

function getObjectType(value: { [key: string]: JsonValue }) {
  const type = value["@type"];
  if (typeof type === "string") return [type];
  if (Array.isArray(type)) return type.filter((item): item is string => typeof item === "string");
  return [];
}

function isJobPostingObject(value: { [key: string]: JsonValue }) {
  return getObjectType(value).some((type) => type.toLowerCase() === "jobposting");
}

function findJobPosting(value: JsonValue): { [key: string]: JsonValue } | null {
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findJobPosting(item);
      if (found) return found;
    }
    return null;
  }

  if (value === null || typeof value !== "object") return null;
  if (isJobPostingObject(value)) return value;

  const graph = value["@graph"];
  if (graph) {
    const found = findJobPosting(graph);
    if (found) return found;
  }

  for (const child of Object.values(value)) {
    const found = findJobPosting(child);
    if (found) return found;
  }

  return null;
}

function getHiringOrganizationName(value: JsonValue) {
  if (typeof value === "string") return cleanText(value);
  if (value === null || typeof value !== "object" || Array.isArray(value)) return null;

  const name = value.name;
  return typeof name === "string" ? cleanText(name) : null;
}

function parseJsonLd(html: string): ParsedJobPosting {
  const scriptPattern = /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;

  while ((match = scriptPattern.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1]?.trim() ?? "") as JsonValue;
      const jobPosting = findJobPosting(parsed);
      if (!jobPosting) continue;

      const companyText = getHiringOrganizationName(jobPosting.hiringOrganization);
      const deadlineText = typeof jobPosting.validThrough === "string" ? cleanText(jobPosting.validThrough) : null;
      return { companyText, deadlineText };
    } catch {
      continue;
    }
  }

  return { companyText: null, deadlineText: null };
}

function getAttribute(tag: string, attributeName: string) {
  const attributePattern = new RegExp(`${attributeName}\\s*=\\s*["']([^"']*)["']`, "i");
  return cleanText(attributePattern.exec(tag)?.[1]);
}

function findMetaContent(html: string, attributeName: "name" | "property", attributeValue: string) {
  const metaPattern = /<meta\b[^>]*>/gi;
  let match: RegExpExecArray | null;

  while ((match = metaPattern.exec(html)) !== null) {
    const tag = match[0];
    const value = getAttribute(tag, attributeName);
    if (value?.toLowerCase() === attributeValue.toLowerCase()) {
      return getAttribute(tag, "content");
    }
  }

  return null;
}

function findTitleCandidate(html: string) {
  const title = cleanText(/<title\b[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1]);
  if (!title) return null;

  const [firstSegment] = title.split(/\||-|\u2013/).map((part) => part.trim()).filter(Boolean);
  return firstSegment || title;
}

export function createJobPostingParser(): JobPostingParser {
  return {
    parseJobPosting(html) {
      if (!html) return { companyText: null, deadlineText: null };

      const jsonLdResult = parseJsonLd(html);
      return {
        companyText:
          jsonLdResult.companyText ??
          findMetaContent(html, "property", "og:site_name") ??
          findMetaContent(html, "name", "author") ??
          findTitleCandidate(html),
        deadlineText: jsonLdResult.deadlineText
      };
    }
  };
}
