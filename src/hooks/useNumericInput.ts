import { useState } from "react";

interface NumericInputOptions {
  min?: number;
  max?: number;
  allowDecimal?: boolean;
  allowNegative?: boolean;
}

export function useNumericInput(
  initialValue: string | number | null = "",
  options?: NumericInputOptions
): [
  string,
  (e: React.ChangeEvent<HTMLInputElement>) => void,
  string | null,
  (value: string) => void,
  (e: React.FocusEvent<HTMLInputElement>) => void
] {
  const [value, setValue] = useState<string>(initialValue?.toString() ?? "");
  const [error, setError] = useState<string | null>(null);

  const {
    min,
    max,
    allowDecimal = false,
    allowNegative = false,
  } = options || {};

  const validateFormat = (rawValue: string) => {
    if (!rawValue) return { isValid: true, error: null };

    const decimalPattern = allowDecimal ? "\\.?\\d*" : "";
    const negativePattern = allowNegative ? "-?" : "";
    const pattern = new RegExp(`^${negativePattern}\\d*${decimalPattern}$`);

    if (!pattern.test(rawValue)) {
      if (!allowNegative && rawValue.includes("-")) {
        return { isValid: false, error: "음수는 입력할 수 없습니다." };
      }
      if (!allowDecimal && rawValue.includes(".")) {
        return { isValid: false, error: "소수는 입력할 수 없습니다." };
      }
      return { isValid: false, error: "숫자만 입력 가능합니다." };
    }

    return { isValid: true, error: null };
  };

  const validateRange = (rawValue: string) => {
    if (!rawValue) return { isValid: true, error: null };

    const numValue = parseFloat(rawValue);
    if (!isNaN(numValue)) {
      if (min !== undefined && numValue < min) {
        return {
          isValid: false,
          error: `최소값은 ${min.toLocaleString()}입니다.`,
        };
      }
      if (max !== undefined && numValue > max) {
        return {
          isValid: false,
          error: `최대값은 ${max.toLocaleString()}입니다.`,
        };
      }
    }

    return { isValid: true, error: null };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, "");

    // 입력 중에는 형식만 검증 (범위 검증은 onBlur에서)
    const validation = validateFormat(rawValue);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    let formatted = rawValue;
    if (rawValue.startsWith("-")) {
      const positiveValue = rawValue.slice(1);
      formatted = "-" + positiveValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      formatted = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    setValue(formatted);
    setError(null);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, "");

    const validation = validateRange(rawValue);
    if (!validation.isValid) {
      setError(validation.error);
    }
  };

  const setValueManually = (input: string) => {
    const rawValue = input.replace(/,/g, "");

    const formatValidation = validateFormat(rawValue);
    if (!formatValidation.isValid) {
      setError(formatValidation.error);
      return;
    }

    const rangeValidation = validateRange(rawValue);
    if (!rangeValidation.isValid) {
      setError(rangeValidation.error);
      return;
    }

    let formatted = rawValue;
    if (rawValue.startsWith("-")) {
      const positiveValue = rawValue.slice(1);
      formatted = "-" + positiveValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      formatted = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    setValue(formatted);
    setError(null);
  };

  return [value, handleChange, error, setValueManually, handleBlur];
}

export function useRawNumericInput(
  initialValue: string | number | null = "",
  options?: NumericInputOptions
): [
  string,
  (e: React.ChangeEvent<HTMLInputElement>) => void,
  string | null,
  (value: string) => void,
  (e: React.FocusEvent<HTMLInputElement>) => void
] {
  const [value, setValue] = useState<string>(initialValue?.toString() ?? "");
  const [error, setError] = useState<string | null>(null);

  const { min, max, allowDecimal = true, allowNegative = true } = options || {};

  const validateFormat = (rawValue: string) => {
    if (!rawValue) return { isValid: true, error: null };

    const decimalPattern = allowDecimal ? "\\.?\\d*" : "";
    const negativePattern = allowNegative ? "-?" : "";
    const pattern = new RegExp(`^${negativePattern}\\d*${decimalPattern}$`);

    if (!pattern.test(rawValue)) {
      if (!allowNegative && rawValue.includes("-")) {
        return { isValid: false, error: "음수는 입력할 수 없습니다." };
      }
      if (!allowDecimal && rawValue.includes(".")) {
        return { isValid: false, error: "소수는 입력할 수 없습니다." };
      }
      return { isValid: false, error: "숫자만 입력 가능합니다." };
    }

    return { isValid: true, error: null };
  };

  const validateRange = (rawValue: string) => {
    if (!rawValue) return { isValid: true, error: null };

    const numValue = parseFloat(rawValue);
    if (!isNaN(numValue)) {
      if (min !== undefined && numValue < min) {
        return {
          isValid: false,
          error: `최소값은 ${min.toLocaleString()}입니다.`,
        };
      }
      if (max !== undefined && numValue > max) {
        return {
          isValid: false,
          error: `최대값은 ${max.toLocaleString()}입니다.`,
        };
      }
    }

    return { isValid: true, error: null };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    // 입력 중에는 형식만 검증 (범위 검증은 onBlur에서)
    const validation = validateFormat(rawValue);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setValue(rawValue);
    setError(null);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    console.log("test");
    const rawValue = e.target.value;

    const validation = validateRange(rawValue);
    if (!validation.isValid) {
      setError(validation.error);
    }
  };

  const setValueManually = (input: string) => {
    // 수동 설정 시에는 형식과 범위 모두 검증
    const formatValidation = validateFormat(input);
    if (!formatValidation.isValid) {
      setError(formatValidation.error);
      return;
    }

    const rangeValidation = validateRange(input);
    if (!rangeValidation.isValid) {
      setError(rangeValidation.error);
      return;
    }

    setValue(input);
    setError(null);
  };

  return [value, handleChange, error, setValueManually, handleBlur];
}
