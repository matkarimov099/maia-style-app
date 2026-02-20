export function getEnumLabel<T extends Record<string, string>>(enumObj: T, value: string): string {
  const entry = Object.entries(enumObj).find(([, v]) => v === value);
  return entry ? entry[0] : value;
}
