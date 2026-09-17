import { revalidatePath } from "next/cache";

import {
  JOB_APPLICATION_OWNERS,
  JOB_APPLICATION_STATUSES,
  type JobApplicationEntity,
  type JobApplicationOwner,
  type JobApplicationStatus
} from "../../domain/entities/job-application";
import type { JobApplicationRepository } from "../../domain/repositories/job-application-repository";
import { assertJobCompanyNameNotDuplicate, DuplicateJobCompanyNameError } from "../../domain/rules/job-company-name-rule";
import { assertValidJobLink, InvalidJobLinkError } from "../../domain/rules/job-link-rule";
import { computeNextSubmittedAt } from "../../domain/rules/job-submitted-at-rule";

export type UpsertJobApplicationInput = {
  /** Có id => cập nhật job; không có id => tạo mới. */
  id?: string;
  company: string;
  deadline?: string | null;
  platformId: string;
  link: string;
  status?: string;
  note?: string | null;
  /** Chỉ dùng khi tạo mới — job thuộc tab nào ("me" | "olivia"). Mặc định "me". */
  owner?: string;
};

export class UpsertJobApplicationError extends Error {}

function assertValidStatus(status: string): asserts status is JobApplicationStatus {
  if (!JOB_APPLICATION_STATUSES.includes(status as JobApplicationStatus)) {
    throw new UpsertJobApplicationError("Trạng thái job không hợp lệ.");
  }
}

function assertValidOwner(owner: string): asserts owner is JobApplicationOwner {
  if (!JOB_APPLICATION_OWNERS.includes(owner as JobApplicationOwner)) {
    throw new UpsertJobApplicationError("Người sở hữu job không hợp lệ.");
  }
}

export function createUpsertJobApplicationUseCase(repository: JobApplicationRepository) {
  return async function upsertJobApplication(input: UpsertJobApplicationInput): Promise<JobApplicationEntity> {
    const company = input.company.trim();
    const platformId = input.platformId.trim();
    const link = input.link.trim();
    const status = (input.status ?? "Interested").trim();
    const note = input.note?.trim() || null;

    if (!company) {
      throw new UpsertJobApplicationError("Công ty không được để trống.");
    }
    const deadlineRaw = input.deadline?.trim() ?? "";
    let deadline: Date | null = null;
    if (deadlineRaw) {
      deadline = new Date(deadlineRaw);
      if (Number.isNaN(deadline.getTime())) {
        throw new UpsertJobApplicationError("Ngày hết hạn không hợp lệ.");
      }
    }
    if (!platformId) {
      throw new UpsertJobApplicationError("Platform không được để trống.");
    }
    if (!link) {
      throw new UpsertJobApplicationError("Link không được để trống.");
    }
    try {
      assertValidJobLink(link);
    } catch (error) {
      if (error instanceof InvalidJobLinkError) {
        throw new UpsertJobApplicationError(error.message);
      }
      throw error;
    }
    assertValidStatus(status);

    const currentJob = input.id ? await repository.findById(input.id) : null;
    const owner = (input.owner?.trim() || currentJob?.owner || "me") as string;
    assertValidOwner(owner);

    const siblings = await repository.findAll();
    const ownerSiblings = siblings.filter((sibling) => sibling.owner === owner);
    try {
      assertJobCompanyNameNotDuplicate(company, ownerSiblings, input.id);
    } catch (error) {
      if (error instanceof DuplicateJobCompanyNameError) {
        throw new UpsertJobApplicationError(error.message);
      }
      throw error;
    }

    const data = { company, deadline, platformId, link, status, note };
    if (!input.id) {
      const result = await repository.create({ ...data, owner });
      revalidatePath("/");
      return result;
    }

    const submittedAt = computeNextSubmittedAt(currentJob?.status, status, currentJob?.submittedAt ?? null, new Date());
    const result = await repository.update(input.id, { ...data, submittedAt });

    revalidatePath("/");
    return result;
  };
}
