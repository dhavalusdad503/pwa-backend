export const parseInt = (
  value: string | number | undefined | null,
): number | undefined => {
  if (value === undefined || value === null) return undefined;

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }

  const trimmed = value.toString().trim();
  if (trimmed === '') return undefined;

  const parsed = Number.parseInt(trimmed, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
};
