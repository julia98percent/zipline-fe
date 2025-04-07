export function isNumberOrNumericString(value: number | string): boolean {
  return (
    typeof value === "number" ||
    (!isNaN(Number(value)) && typeof value === "string")
  );
}
