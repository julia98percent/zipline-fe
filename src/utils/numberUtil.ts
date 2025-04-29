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
