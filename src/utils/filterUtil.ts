export const FILTER_DEFAULTS = {
  NET_AREA_MAX: 200,
  TOTAL_AREA_MAX: 300,
  PRICE_MAX: 200000,
  DEPOSIT_MAX: 200000,
  MONTHLY_RENT_MAX: 500,
};

export const FILTER_DEFAULTS_MIN = 0;

export const PRICE_UNITS = {
  BILLION: 10000,
  TEN_MILLION: 1000,
} as const;

export const AREA_STEP = 5;
export const PRICE_STEPS = {
  MONTHLY_RENT: {
    LOW_THRESHOLD: 100,
    LOW_STEP: 10,
    HIGH_STEP: 50,
  },
  GENERAL: {
    LEVEL1_THRESHOLD: 1000,
    LEVEL1_STEP: 100,
    LEVEL2_THRESHOLD: 5000,
    LEVEL2_STEP: 500,
    LEVEL3_THRESHOLD: 10000,
    LEVEL3_STEP: 1000,
    LEVEL4_STEP: 5000,
  },
};

export const MAX_PRICE_SLIDER_VALUE =
  FILTER_DEFAULTS.PRICE_MAX + PRICE_STEPS.GENERAL.LEVEL4_STEP;
export const MAX_MONTHLY_RENT_SLIDER_VALUE =
  FILTER_DEFAULTS.MONTHLY_RENT_MAX + PRICE_STEPS.MONTHLY_RENT.HIGH_STEP;

export const formatPrice = (value: number, isMaxValue?: boolean) => {
  let formatted = "";
  if (value >= PRICE_UNITS.BILLION) {
    const billion = Math.floor(value / PRICE_UNITS.BILLION);
    const remainder = value % PRICE_UNITS.BILLION;
    if (remainder === 0) {
      formatted = `${billion}억원`;
    } else if (remainder >= PRICE_UNITS.TEN_MILLION) {
      formatted = `${billion}억 ${Math.floor(
        remainder / PRICE_UNITS.TEN_MILLION
      )}천만원`;
    } else {
      formatted = `${billion}억 ${remainder}만원`;
    }
  } else if (value >= PRICE_UNITS.TEN_MILLION) {
    formatted = `${Math.floor(value / PRICE_UNITS.TEN_MILLION)}천만원`;
  } else {
    formatted = `${value}만원`;
  }

  if (isMaxValue) {
    formatted += "~";
  }

  return formatted;
};

export const getPriceValueLabelFormat = (
  value: number,
  max: number,
  maxString: string
) => {
  if (value > max) {
    return maxString;
  }

  let formatted = "";
  if (value >= 10000) {
    const billions = Math.floor(value / 10000);
    const remainder = value % 10000;
    if (remainder === 0) {
      formatted = `${billions}억원`;
    } else if (remainder >= 1000) {
      formatted = `${billions}억${Math.floor(remainder / 1000)}천만원`;
    } else {
      formatted = `${billions}억${remainder}만원`;
    }
  } else if (value >= 1000) {
    formatted = `${Math.floor(value / 1000)}천만원`;
  } else {
    formatted = `${value}만원`;
  }
  return formatted;
};
