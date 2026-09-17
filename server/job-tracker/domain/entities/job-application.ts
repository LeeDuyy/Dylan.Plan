export type JobApplicationStatus =
  | "Interested"
  | "Waiting"
  | "No Response"
  | "Response"
  | "Appointment"
  | "Cancel"
  | "Fail"
  | "Expired";

export const JOB_APPLICATION_STATUSES: JobApplicationStatus[] = [
  "Interested",
  "Waiting",
  "No Response",
  "Response",
  "Appointment",
  "Cancel",
  "Fail",
  "Expired"
];

export type JobApplicationOwner = "me" | "olivia";

export const JOB_APPLICATION_OWNERS: JobApplicationOwner[] = ["me", "olivia"];

export type JobApplicationEntity = {
  id: string;
  company: string;
  deadline: Date | null;
  platformId: string;
  link: string;
  status: JobApplicationStatus;
  note: string | null;
  submittedAt: Date | null;
  owner: JobApplicationOwner;
  createdAt: Date;
  updatedAt: Date;
};
