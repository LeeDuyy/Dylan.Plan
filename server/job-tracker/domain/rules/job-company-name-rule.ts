import type { JobApplicationEntity } from "../entities/job-application";

type JobCompanyNameSibling = Pick<JobApplicationEntity, "id" | "company">;

export class DuplicateJobCompanyNameError extends Error {}

export function normalizeJobCompanyName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

function formatJobCompanyNameForMessage(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

export function assertJobCompanyNameNotDuplicate(
  company: string,
  siblings: JobCompanyNameSibling[],
  excludeId?: string
): void {
  const normalizedCompany = normalizeJobCompanyName(company);
  const hasDuplicate = siblings.some((sibling) => {
    if (excludeId && sibling.id === excludeId) return false;
    return normalizeJobCompanyName(sibling.company) === normalizedCompany;
  });

  if (hasDuplicate) {
    throw new DuplicateJobCompanyNameError(
      `Công ty "${formatJobCompanyNameForMessage(company)}" đã có trong danh sách theo dõi. Vui lòng đổi tên khác.`
    );
  }
}
