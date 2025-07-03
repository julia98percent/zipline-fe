import { useState } from "react";

export function useNumericInput(
  initialValue: string | number | null = ""
): [
  string,
  (e: React.ChangeEvent<HTMLInputElement>) => void,
  string | null,
  (value: string) => void
] {
  const [value, setValue] = useState<string>(initialValue?.toString() ?? "");
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, ""); // 콤마 제거
    if (rawValue && !/^\d*\.?\d*$/.test(rawValue)) {
      setError("숫자만 입력 가능합니다.");
    } else {
      const formatted = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // 콤마 추가
      setValue(formatted);
      setError(null);
    }
  };

  const setValueManually = (input: string) => {
    const rawValue = input.replace(/,/g, "");
    const formatted = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setValue(formatted);
    setError(null);
  };

  return [value, handleChange, error, setValueManually];
}

export function useRawNumericInput(
  initialValue: string | number | null = ""
): [
  string,
  (e: React.ChangeEvent<HTMLInputElement>) => void,
  string | null,
  (value: string) => void
] {
  const [value, setValue] = useState<string>(initialValue?.toString() ?? "");
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    if (rawValue && !/^\d*\.?\d*$/.test(rawValue)) {
      setError("숫자만 입력 가능합니다.");
    } else {
      setValue(rawValue);
      setError(null);
    }
  };

  const setValueManually = (input: string) => {
    setValue(input);
    setError(null);
  };

  return [value, handleChange, error, setValueManually];
}
