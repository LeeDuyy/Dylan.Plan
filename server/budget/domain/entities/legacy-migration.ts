export type MigrationStatusValue = "Pending" | "InProgress" | "Completed" | "Failed";

export type LegacyMigrationEntity = {
  id: "singleton";
  status: MigrationStatusValue;
  startedAt: Date | null;
  completedAt: Date | null;
  errorMessage: string | null;
};
