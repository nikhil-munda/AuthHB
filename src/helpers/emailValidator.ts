export const ALLOWED_DOMAINS = ["@hbplus.fit"];
export const RESTRICTED_DOMAIN_MESSAGE =
  "Access restricted. Please login using your official domain email.";

export function isAllowedEmailDomain(email?: string | null): boolean {
  const normalized = (email ?? "").trim().toLowerCase();
  return ALLOWED_DOMAINS.some((domain) => normalized.endsWith(domain));
}

export function emailValidator(email: string): string {
  const normalized = email.trim().toLowerCase();
  if (!normalized) {
    return "Email can't be empty.";
  }
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(normalized)) {
    return "Please enter a valid email address.";
  }
  if (!isAllowedEmailDomain(normalized)) {
    return RESTRICTED_DOMAIN_MESSAGE;
  }
  return "";
}
