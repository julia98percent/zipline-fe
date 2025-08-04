import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { fetchLabels } from "@apis/customerService";
import { fetchSido, fetchSigungu, fetchDong } from "@apis/regionService";
import { RegionState } from "@ts/region";
import { CustomerBaseFilter, CustomerFilter, Label } from "@ts/customer";
import RoleFilters from "./RoleFilters";
import RegionFilters from "./RegionFilters";
import PriceFilters from "./PriceFilters";
import LabelFilters from "./LabelFilters";
import Button from "@components/Button";
import { useNumericInput } from "@hooks/useNumericInput";
import { MAX_PROPERTY_PRICE } from "@constants/property";

interface CustomerFilterModalProps {
  open: boolean;
  onClose: () => void;
  filters: CustomerFilter;
  setFilters: (filters: CustomerFilter) => void;
  onApply: (filters: CustomerFilter) => void;
}

const CustomerFilterModal = ({
  open,
  onClose,
  filters,
  onApply,
}: CustomerFilterModalProps) => {
  const [filtersTemp, setFiltersTemp] = useState<CustomerBaseFilter>({
    tenant: false,
    landlord: false,
    buyer: false,
    seller: false,
    noRole: false,
    labelUids: [],
    telProvider: "",
    preferredRegion: "",
    trafficSource: "",
  });
  const [region, setRegion] = useState<RegionState>({
    sido: [],
    sigungu: [],
    dong: [],
    selectedSido: null,
    selectedSigungu: null,
    selectedDong: null,
  });
  const [labels, setLabels] = useState<Label[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<Label[]>([]);

  const minPriceInput = useNumericInput("", { max: MAX_PROPERTY_PRICE });
  const maxPriceInput = useNumericInput("", { max: MAX_PROPERTY_PRICE });
  const minRentInput = useNumericInput("", { max: MAX_PROPERTY_PRICE });
  const maxRentInput = useNumericInput("", { max: MAX_PROPERTY_PRICE });
  const minDepositInput = useNumericInput("", { max: MAX_PROPERTY_PRICE });
  const maxDepositInput = useNumericInput("", { max: MAX_PROPERTY_PRICE });

  const fetchLabelsData = useCallback(async () => {
    try {
      const labelsData = await fetchLabels();
      setLabels(labelsData);
    } catch (error) {
      console.error("라벨 목록 불러오기 실패:", error);
    }
  }, []);

  const loadSidoData = useCallback(async () => {
    try {
      const sidoData = await fetchSido();
      setRegion((prev) => ({
        ...prev,
        sido: sidoData,
      }));
    } catch (error) {
      console.error("시도 데이터 로드 실패:", error);
    }
  }, []);

  const loadSigunguData = useCallback(async (sidoCortarNo: number) => {
    try {
      const sigunguData = await fetchSigungu(sidoCortarNo);
      setRegion((prev) => ({
        ...prev,
        sigungu: sigunguData,
        dong: [], // 시군구가 변경되면 동 데이터 초기화
        selectedDong: null,
      }));
    } catch (error) {
      console.error("시군구 데이터 로드 실패:", error);
    }
  }, []);

  const loadDongData = useCallback(async (sigunguCortarNo: number) => {
    try {
      const dongData = await fetchDong(sigunguCortarNo);
      setRegion((prev) => ({
        ...prev,
        dong: dongData,
      }));
    } catch (error) {
      console.error("동 데이터 로드 실패:", error);
    }
  }, []);

  const handleOpen = useCallback(() => {
    loadSidoData();
  }, [loadSidoData]);

  useEffect(() => {
    if (open) {
      // labels가 없을 때만 fetchLabelsData 호출
      if (labels.length === 0) {
        fetchLabelsData();
      }
      handleOpen();
    }
  }, [open, fetchLabelsData, handleOpen, labels.length]);

  // filters가 변경될 때만 filtersTemp 업데이트
  useEffect(() => {
    if (open) {
      setFiltersTemp({ ...filters });
    }
  }, [open, filters]);

  useEffect(() => {
    if (open && filters.labelUids?.length > 0 && labels.length > 0) {
      const selectedLabelsData = labels.filter((label) =>
        filters.labelUids.includes(label.uid)
      );
      setSelectedLabels(selectedLabelsData);
    }
  }, [open, filters.labelUids, labels]);

  const handleApply = () => {
    let regionCode: string | undefined;
    if (region.selectedDong) {
      regionCode = String(region.selectedDong);
    } else if (region.selectedSigungu) {
      regionCode = String(region.selectedSigungu).slice(0, 5);
    } else if (region.selectedSido) {
      regionCode = String(region.selectedSido).slice(0, 2);
    }

    // INITIAL_FILTERS 구조를 기본으로 하되 변경된 값만 덮어쓰기
    const finalFilterData = {
      tenant: filtersTemp.noRole ? false : filtersTemp.tenant,
      landlord: filtersTemp.noRole ? false : filtersTemp.landlord,
      buyer: filtersTemp.noRole ? false : filtersTemp.buyer,
      seller: filtersTemp.noRole ? false : filtersTemp.seller,
      minPrice: minPriceInput.value ? Number(minPriceInput.value) : null,
      maxPrice: maxPriceInput.value ? Number(maxPriceInput.value) : null,
      minRent: minRentInput.value ? Number(minRentInput.value) : null,
      maxRent: maxRentInput.value ? Number(maxRentInput.value) : null,
      minDeposit: minDepositInput.value ? Number(minDepositInput.value) : null,
      maxDeposit: maxDepositInput.value ? Number(maxDepositInput.value) : null,
      labelUids: selectedLabels.map((label) => label.uid),
      telProvider: filtersTemp.telProvider || "",
      preferredRegion: regionCode || "",
      trafficSource: filtersTemp.trafficSource || "",
      noRole: filtersTemp.noRole,
    };

    onApply(finalFilterData);
    onClose();
  };

  const handleReset = () => {
    setFiltersTemp({
      tenant: false,
      landlord: false,
      buyer: false,
      seller: false,
      noRole: false,
      labelUids: [],
      telProvider: "",
      preferredRegion: "",
      trafficSource: "",
    });
    setSelectedLabels([]);
    setRegion({
      sido: [],
      sigungu: [],
      dong: [],
      selectedSido: null,
      selectedSigungu: null,
      selectedDong: null,
    });
    minPriceInput.setValueManually("");
    maxPriceInput.setValueManually("");
    minRentInput.setValueManually("");
    maxRentInput.setValueManually("");
    minDepositInput.setValueManually("");
    maxDepositInput.setValueManually("");
  };

  const getValuationErrors = () => {
    const errors: string[] = [];
    if (minPriceInput.error) errors.push("유효한 최소 가격을 입력해주세요.");
    if (maxPriceInput.error) errors.push("유효한 최대 가격을 입력해주세요.");
    if (minRentInput.error)
      errors.push("유효한 최소 월세 가격을 입력해주세요.");
    if (maxRentInput.error)
      errors.push("유효한 최대 월세 가격을 입력해주세요.");
    if (minDepositInput.error)
      errors.push("유효한 최소 보증금을 입력해주세요.");
    if (maxDepositInput.error)
      errors.push("유효한 최대 보증금을 입력해주세요.");
    return errors;
  };
  const validationErrors = getValuationErrors();
  const isSubmitButtonDisabled = validationErrors.length > 0;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className="border-b text-primary font-bold border-gray-200">
        고객 필터
      </DialogTitle>
      <DialogContent className="flex flex-col p-6 gap-6">
        <RoleFilters
          filtersTemp={filtersTemp}
          setFiltersTemp={setFiltersTemp}
        />

        <LabelFilters
          setFiltersTemp={setFiltersTemp}
          labels={labels}
          selectedLabels={selectedLabels}
          setSelectedLabels={setSelectedLabels}
        />

        <RegionFilters
          region={region}
          setRegion={setRegion}
          onSidoChange={loadSigunguData}
          onSigunguChange={loadDongData}
        />

        <PriceFilters
          minPriceInput={minPriceInput}
          maxPriceInput={maxPriceInput}
          minRentInput={minRentInput}
          maxRentInput={maxRentInput}
          minDepositInput={minDepositInput}
          maxDepositInput={maxDepositInput}
        />
      </DialogContent>

      <DialogActions className="flex flex-row-reverse items-center justify-between p-6 border-t border-gray-200">
        <div className="flex gap-2">
          <Button variant="outlined" color="info" onClick={handleReset}>
            필터 초기화
          </Button>
          <Button variant="outlined" onClick={onClose}>
            취소
          </Button>
          <Button
            variant="contained"
            onClick={handleApply}
            disabled={isSubmitButtonDisabled}
          >
            적용
          </Button>
        </div>
        {isSubmitButtonDisabled && validationErrors.length > 0 && (
          <Tooltip
            title={
              <div>
                {validationErrors.map((error, index) => (
                  <div key={index}>• {error}</div>
                ))}
              </div>
            }
            arrow
            placement="top"
          >
            <div className="text-sm text-red-600 cursor-help">
              <ul className="list-disc list-inside">
                {validationErrors.slice(0, 1).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
                {validationErrors.length > 1 && (
                  <li>외 {validationErrors.length - 1}개 항목</li>
                )}
              </ul>
            </div>
          </Tooltip>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CustomerFilterModal;
