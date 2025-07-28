export function isNumberOrNumericString(value: number | string): boolean {
  return (
    typeof value === "number" ||
    (!isNaN(Number(value)) && typeof value === "string")
  );
}

// 가격을 1,234,567원 (일백이십이만...) 형태로 반환
export function formatPriceWithKorean(value: number | null): string {
  if (value === null || value === undefined) return "-";
  const formatted = new Intl.NumberFormat("ko-KR").format(value) + "원";
  const korean = numberToKorean(value) + " 원";
  return `${formatted} (${korean})`;
}

// 숫자를 한글로 읽는 함수 (간단 버전)
function numberToKorean(num: number): string {
  if (num === 0) return "영";
  const units = ["", "만", "억", "조", "경"];
  const nums = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
  let result = "";
  let unitPos = 0;
  while (num > 0) {
    const part = num % 10000;
    if (part > 0) {
      let partStr = "";
      let n = part;
      let pos = 0;
      while (n > 0) {
        const digit = n % 10;
        if (digit > 0) {
          partStr =
            nums[digit] +
            (pos > 0 ? ["", "십", "백", "천"][pos] : "") +
            partStr;
        }
        n = Math.floor(n / 10);
        pos++;
      }
      result = partStr + units[unitPos] + result;
    }
    num = Math.floor(num / 10000);
    unitPos++;
  }
  return result;
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

export const formatPublicPropertyPrice = (value: number) => {
  if (value === 0) return "-";
  return value >= 10000
    ? `${Math.floor(value / 10000)}억 ${
        value % 10000 > 0 ? `${value % 10000}만` : ""
      }`
    : `${value}만`;
};
