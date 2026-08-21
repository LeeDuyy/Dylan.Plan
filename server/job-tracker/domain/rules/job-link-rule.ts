export class InvalidJobLinkError extends Error {}

export function assertValidJobLink(link: string): void {
  if (!/^https?:\/\//i.test(link.trim())) {
    throw new InvalidJobLinkError("Link phải bắt đầu bằng http:// hoặc https://.");
  }
}
