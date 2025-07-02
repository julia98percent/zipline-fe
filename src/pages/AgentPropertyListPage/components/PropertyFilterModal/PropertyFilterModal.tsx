import { useState, useEffect } from "react";
import { AgentPropertyFilterParams } from "@ts/property";
import PropertyFilterModalView from "./PropertyFilterModalView";
import {
  PRICE_FIELDS,
  DOUBLE_FIELDS,
  formatNumber,
  parseNumber,
  createInitialPriceInputs,
  VALIDATION_ERROR_MESSAGE,
} from "./constants";

interface Props {
  open: boolean;
  onClose: () => void;
  filter: Partial<AgentPropertyFilterParams>;
  setFilter: (value: Partial<AgentPropertyFilterParams>) => void;
  onApply: () => void;
  onReset: () => void;
}

const PropertyFilterModal = ({
  open,
  onClose,
  filter,
  setFilter,
  onApply,
  onReset,
}: Props) => {
  const [error, setError] = useState<string | null>(null);
  const [priceInputs, setPriceInputs] = useState(
    createInitialPriceInputs(filter)
  );

  useEffect(() => {
    setPriceInputs(createInitialPriceInputs(filter));
  }, [filter]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof AgentPropertyFilterParams
  ) => {
    const raw = e.target.value;
    const isPriceField = PRICE_FIELDS.includes(field);
    const isDoubleField = DOUBLE_FIELDS.includes(field);

    if (isPriceField) {
      const numericValue = parseNumber(raw);
      setPriceInputs((prev) => ({
        ...prev,
        [field]: formatNumber(numericValue),
      }));
      if (numericValue === "") {
        setFilter({ ...filter, [field]: undefined });
      } else {
        setFilter({ ...filter, [field]: Number(numericValue) });
      }
    } else if (isDoubleField) {
      // 소숫점 허용
      const value = raw === "" ? undefined : Number(raw);
      if (value !== undefined && isNaN(value)) return;
      setFilter({ ...filter, [field]: value });
    } else {
      const value = Number(raw);
      if (value < 0) return; // 음수 입력 방지
      setFilter({ ...filter, [field]: value });
    }
  };

  const handleSwitchChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof AgentPropertyFilterParams
  ) => {
    setFilter({ ...filter, [field]: e.target.checked });
  };

  const validateMinMaxValues = () => {
    const validationChecks = [
      { min: filter.minNetArea, max: filter.maxNetArea },
      { min: filter.minDeposit, max: filter.maxDeposit },
      { min: filter.minMonthlyRent, max: filter.maxMonthlyRent },
      { min: filter.minPrice, max: filter.maxPrice },
      { min: filter.minFloor, max: filter.maxFloor },
      { min: filter.minParkingCapacity, max: filter.maxParkingCapacity },
      { min: filter.minConstructionYear, max: filter.maxConstructionYear },
    ];

    return validationChecks.some(
      ({ min, max }) => min !== undefined && max !== undefined && min > max
    );
  };

  const handleApply = () => {
    if (validateMinMaxValues()) {
      setError(VALIDATION_ERROR_MESSAGE);
      return;
    }
    setError(null);
    onApply();
  };

  useEffect(() => {
    setError(null);
  }, [open]);

  return (
    <PropertyFilterModalView
      open={open}
      onClose={onClose}
      filter={filter}
      priceInputs={priceInputs}
      error={error}
      onInputChange={handleInputChange}
      onSwitchChange={handleSwitchChange}
      onApply={handleApply}
      onReset={onReset}
    />
  );
};

export default PropertyFilterModal;
