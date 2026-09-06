import type { JobPlatformRepository } from "../../domain/repositories/job-platform-repository";
import { assertValidJobLink } from "../../domain/rules/job-link-rule";
import type {
  JobLinkEnrichmentService,
  JobLinkField,
  JobLinkReadResult
} from "../../domain/services/job-link-enrichment-service";

export type { JobLinkField, JobLinkReadResult };

type JobPostingFetcherPort = {
  fetchJobPostingHtml(url: string): Promise<string | null>;
};

type JobPostingParserPort = {
  parseJobPosting(html: string | null, url: string): {
    companyText: string | null;
    deadlineText: string | null;
  };
};

export type ReadJobLinkDeps = {
  jobPlatformRepository: JobPlatformRepository;
  jobPostingFetcher: JobPostingFetcherPort;
  jobPostingParser: JobPostingParserPort;
  jobLinkEnrichmentService: JobLinkEnrichmentService;
};

export function createReadJobLinkUseCase(deps: ReadJobLinkDeps) {
  return async function readJobLink(url: string): Promise<JobLinkReadResult> {
    const normalizedUrl = url.trim();
    assertValidJobLink(normalizedUrl);

    const platforms = await deps.jobPlatformRepository.findAll();
    const html = await deps.jobPostingFetcher.fetchJobPostingHtml(normalizedUrl);
    const parsed = deps.jobPostingParser.parseJobPosting(html, normalizedUrl);

    return deps.jobLinkEnrichmentService.enrich({
      url: normalizedUrl,
      parsed,
      platforms
    });
  };
}
