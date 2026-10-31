export function nameValidator(name: string): string {
  if (!name.trim()) {
    return "Name can't be empty.";
  }
  return "";
}
