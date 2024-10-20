export function truncate(input: string, maxLength: number): string {
  if (!input) return '';
  return input.length > maxLength ? `${input.substring(0, maxLength)}...` : input;
}