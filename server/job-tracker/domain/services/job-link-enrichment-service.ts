import type { JobPlatformEntity } from "../entities/job-platform";
import { parseAbsoluteDeadline } from "../rules/job-deadline-parse-rule";
import { matchPlatformByHostname } from "../rules/job-platform-match-rule";

export type JobLinkField = "company" | "platform" | "deadline";

export type JobLinkReadResult = {
  company: string | null;
  deadline: string | null;
  platformId: string | null;
  missing: JobLinkField[];
};

export type ParsedJobPosting = {
  companyText: string | null;
  deadlineText: string | null;
};

export type JobLinkEnrichmentInput = {
  url: string;
  parsed: ParsedJobPosting;
  platforms: JobPlatformEntity[];
};

export type JobLinkEnrichmentService = {
  enrich(input: JobLinkEnrichmentInput): JobLinkReadResult;
};

export function createJobLinkEnrichmentService(): JobLinkEnrichmentService {
  return {
    enrich({ url, parsed, platforms }) {
      const company = parsed.companyText?.trim() || null;
      const deadline = parseAbsoluteDeadline(parsed.deadlineText);
      const platformId = matchPlatformByHostname(url, platforms);

      const missing: JobLinkField[] = [];
      if (company === null) missing.push("company");
      if (platformId === null) missing.push("platform");
      if (deadline === null) missing.push("deadline");

      return { company, deadline, platformId, missing };
    }
  };
}
