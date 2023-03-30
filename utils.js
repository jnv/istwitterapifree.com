export function toISODate(date) {
  return date.toISOString().split("T")[0];
}
