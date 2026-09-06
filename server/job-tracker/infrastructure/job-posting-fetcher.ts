const FETCH_TIMEOUT_MS = 10_000;
const MAX_HTML_BYTES = 2 * 1024 * 1024;
const BROWSER_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

export type JobPostingFetcher = {
  fetchJobPostingHtml(url: string): Promise<string | null>;
};

function normalizeHostname(hostname: string) {
  return hostname.toLowerCase().replace(/^\[/, "").replace(/\]$/, "");
}

function parseIpv4(hostname: string) {
  const parts = hostname.split(".");
  if (parts.length !== 4) return null;

  const numbers = parts.map((part) => {
    if (!/^\d+$/.test(part)) return null;
    const value = Number(part);
    return value >= 0 && value <= 255 ? value : null;
  });

  if (numbers.some((part) => part === null)) return null;
  return numbers as [number, number, number, number];
}

function isBlockedIpv4(hostname: string) {
  const parts = parseIpv4(hostname);
  if (!parts) return false;

  const [first, second] = parts;
  return (
    first === 10 ||
    first === 127 ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168)
  );
}

function isBlockedIpv6(hostname: string) {
  const normalized = normalizeHostname(hostname);
  return normalized === "::1" || normalized.startsWith("fe80:");
}

function isBlockedHost(hostname: string) {
  const normalized = normalizeHostname(hostname);
  return (
    normalized === "localhost" ||
    normalized.endsWith(".local") ||
    isBlockedIpv4(normalized) ||
    isBlockedIpv6(normalized)
  );
}

function parseAllowedPublicUrl(rawUrl: string) {
  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (isBlockedHost(url.hostname)) return null;
    return url;
  } catch {
    return null;
  }
}

async function readLimitedText(response: Response) {
  if (!response.body) return response.text();

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const chunks: string[] = [];
  let totalBytes = 0;

  try {
    while (totalBytes < MAX_HTML_BYTES) {
      const { done, value } = await reader.read();
      if (done) break;

      const remainingBytes = MAX_HTML_BYTES - totalBytes;
      const chunk = value.byteLength > remainingBytes ? value.slice(0, remainingBytes) : value;
      chunks.push(decoder.decode(chunk, { stream: true }));
      totalBytes += chunk.byteLength;

      if (value.byteLength > remainingBytes || totalBytes >= MAX_HTML_BYTES) {
        await reader.cancel();
        break;
      }
    }
  } finally {
    chunks.push(decoder.decode());
  }

  return chunks.join("");
}

export function createJobPostingFetcher(): JobPostingFetcher {
  return {
    async fetchJobPostingHtml(rawUrl: string) {
      const url = parseAllowedPublicUrl(rawUrl);
      if (!url) return null;

      try {
        const response = await fetch(url.toString(), {
          signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
          redirect: "follow",
          headers: {
            "user-agent": BROWSER_USER_AGENT
          }
        });

        if (!response.ok) return null;

        const finalUrl = parseAllowedPublicUrl(response.url);
        if (!finalUrl) return null;

        return readLimitedText(response);
      } catch {
        return null;
      }
    }
  };
}
