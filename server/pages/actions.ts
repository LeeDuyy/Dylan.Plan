"use server";

// Composition root cho bounded-context "pages" (US-027): nối repository
// (infrastructure, Prisma) -> domain service -> application use-case -> Server
// Action. Route/Client Component chỉ import các hàm export ở đây.

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

import { createGetPageContentUseCase } from "./application/get-page-content";
import { createUpsertPageTextUseCase } from "./application/upsert-page-text";
import { createUpsertPageBlockUseCase } from "./application/upsert-page-block";
import { createDeletePageBlockUseCase } from "./application/delete-page-block";
import { createReorderPageBlocksUseCase } from "./application/reorder-page-blocks";
import { createResetPageContentUseCase } from "./application/reset-page-content";

import { createDefaultPageContentService } from "./domain/service";
import { createPageContentPrismaRepository } from "./infrastructure/prisma-repository";

import type { PageContentEntity } from "./domain/entities";
import type { UpsertPageTextInput } from "./application/upsert-page-text";
import type { UpsertPageBlockInput } from "./application/upsert-page-block";
import type { ReorderPageBlocksInput } from "./application/reorder-page-blocks";

const repository = createPageContentPrismaRepository(prisma);
const defaultPageContentService = createDefaultPageContentService({ repository });

const getPageContentUseCase = createGetPageContentUseCase({ repository, defaultPageContentService });
const upsertPageTextUseCase = createUpsertPageTextUseCase(repository);
const upsertPageBlockUseCase = createUpsertPageBlockUseCase(repository);
const deletePageBlockUseCase = createDeletePageBlockUseCase(repository);
const reorderPageBlocksUseCase = createReorderPageBlocksUseCase(repository);
const resetPageContentUseCase = createResetPageContentUseCase(defaultPageContentService);

export async function getPageContent(page: string): Promise<PageContentEntity> {
  return getPageContentUseCase(page);
}

export async function upsertPageText(input: UpsertPageTextInput): Promise<void> {
  await upsertPageTextUseCase(input);
  revalidatePath(`/${input.page}`);
}

export async function upsertPageBlock(input: UpsertPageBlockInput) {
  const block = await upsertPageBlockUseCase(input);
  revalidatePath(`/${input.page}`);
  return block;
}

export async function deletePageBlock(page: string, id: string): Promise<void> {
  await deletePageBlockUseCase(id);
  revalidatePath(`/${page}`);
}

export async function reorderPageBlocks(input: ReorderPageBlocksInput): Promise<void> {
  await reorderPageBlocksUseCase(input);
  revalidatePath(`/${input.page}`);
}

export async function resetPageContent(page: string): Promise<void> {
  await resetPageContentUseCase(page);
  revalidatePath(`/${page}`);
}

export type { PageContentEntity } from "./domain/entities";
export type { UpsertPageTextInput } from "./application/upsert-page-text";
export type { UpsertPageBlockInput } from "./application/upsert-page-block";
export type { ReorderPageBlocksInput } from "./application/reorder-page-blocks";
