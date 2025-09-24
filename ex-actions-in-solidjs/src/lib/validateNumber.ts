export function validateNumber(value:any): boolean {
  return typeof value === 'number' && isFinite(value);
}