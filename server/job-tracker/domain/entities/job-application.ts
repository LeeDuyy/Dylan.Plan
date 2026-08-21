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

export type JobApplicationEntity = {
  id: string;
  company: string;
  deadline: Date;
  platformId: string;
  link: string;
  status: JobApplicationStatus;
  note: string | null;
  submittedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
