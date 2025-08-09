export function isNumberOrNumericString(value: number | string): boolean {
  return (
    typeof value === "number" ||
    (!isNaN(Number(value)) && typeof value === "string")
  );
}

export function formatPriceWithKorean(value: number | null): string {
  if (value === null || value === undefined) return "-";
  return new Intl.NumberFormat("ko-KR").format(value) + "원";
}

export function formatPhoneNumber(input: string): string {
  const cleanedInput = input.replace(/[^0-9]/g, "");
  let formattedNumber = "";

  if (cleanedInput.startsWith("02")) {
    if (cleanedInput.length <= 2) {
      formattedNumber = cleanedInput;
    } else if (cleanedInput.length <= 6) {
      formattedNumber = cleanedInput.replace(/^(\d{2})(\d{0,4})/, "$1-$2");
    } else {
      formattedNumber = cleanedInput.replace(
        /^(\d{2})(\d{4})(\d{4})/,
        "$1-$2-$3"
      );
    }
    if (formattedNumber.length > 11) {
      formattedNumber = formattedNumber.slice(0, 11);
    }
  } else {
    if (cleanedInput.length <= 3) {
      formattedNumber = cleanedInput;
    } else if (cleanedInput.length <= 7) {
      formattedNumber = cleanedInput.replace(/^(\d{3})(\d{0,4})/, "$1-$2");
    } else {
      formattedNumber = cleanedInput.replace(
        /^(\d{3})(\d{4})(\d{4})/,
        "$1-$2-$3"
      );
    }
    if (formattedNumber.length > 13) {
      formattedNumber = formattedNumber.slice(0, 13);
    }
  }

  return formattedNumber;
}

export const formatKoreanPrice = (
  value: number | string | null | undefined
) => {
  const numValue = typeof value === "string" ? parseInt(value, 10) : value;

  if (!numValue || numValue === 0 || isNaN(numValue)) return "";

  if (numValue >= 10000) {
    const eok = Math.floor(numValue / 10000);
    const remainder = numValue % 10000;
    if (remainder === 0) {
      return `${eok}억원`;
    } else if (remainder >= 1000) {
      const thousand = Math.floor(remainder / 1000);
      const man = remainder % 1000;
      return man > 0
        ? `${eok}억 ${thousand}천 ${man}만원`
        : `${eok}억 ${thousand}천만원`;
    } else {
      return `${eok}억 ${remainder}만원`;
    }
  } else if (numValue >= 1000) {
    const thousand = Math.floor(numValue / 1000);
    const remainder = numValue % 1000;
    return remainder > 0
      ? `${thousand}천 ${remainder}만원`
      : `${thousand}천만원`;
  } else {
    return `${numValue}만원`;
  }
};
