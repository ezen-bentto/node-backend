export const formatDateOnly = (date: Date | string | null): string | null => {
  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return null;

  return d.toISOString().slice(0, 10);
};