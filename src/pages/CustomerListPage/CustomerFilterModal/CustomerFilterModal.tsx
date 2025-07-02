import { Modal, Box, Typography, Button } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { fetchLabels } from "@apis/customerService";
import { fetchSido, fetchSigungu, fetchDong } from "@apis/regionService";
import { RegionState } from "@ts/region";
import { CustomerFilter, Label } from "@ts/customer";
import RoleFilters from "./RoleFilters";
import RegionFilters from "./RegionFilters";
import PriceFilters from "./PriceFilters";
import LabelFilters from "./LabelFilters";

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
  const [filtersTemp, setFiltersTemp] = useState<CustomerFilter>({
    tenant: false,
    landlord: false,
    buyer: false,
    seller: false,
    noRole: false,
    minPrice: null,
    maxPrice: null,
    minRent: null,
    maxRent: null,
    minDeposit: null,
    maxDeposit: null,
    labelUids: [],
    telProvider: "",
    legalDistrictCode: "",
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
      fetchLabelsData();
      setFiltersTemp({ ...filters });
      handleOpen();
    }
  }, [open, filters, fetchLabelsData, handleOpen]);

  useEffect(() => {
    if (open && filters.labelUids?.length > 0 && labels.length > 0) {
      const selectedLabelsData = labels.filter((label) =>
        filters.labelUids.includes(label.uid)
      );
      setSelectedLabels(selectedLabelsData);
    }
  }, [open, filters.labelUids, labels]);

  const handleApply = () => {
    const parsePrice = (price: string | number | null) => {
      if (!price) return null;
      const priceStr = typeof price === "string" ? price : String(price);
      const parsed = Number(priceStr.replace(/[^0-9]/g, ""));
      return parsed || null;
    };

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
      minPrice: parsePrice(filtersTemp.minPrice),
      maxPrice: parsePrice(filtersTemp.maxPrice),
      minRent: parsePrice(filtersTemp.minRent),
      maxRent: parsePrice(filtersTemp.maxRent),
      minDeposit: parsePrice(filtersTemp.minDeposit),
      maxDeposit: parsePrice(filtersTemp.maxDeposit),
      labelUids: selectedLabels.map((label) => label.uid),
      telProvider: filtersTemp.telProvider || "",
      legalDistrictCode: regionCode || "",
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
      minPrice: null,
      maxPrice: null,
      minDeposit: null,
      maxDeposit: null,
      minRent: null,
      maxRent: null,
      labelUids: [],
      telProvider: "",
      legalDistrictCode: "",
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
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: 800,
          maxHeight: "90%",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          overflow: "auto",
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          고객 필터
        </Typography>

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
          filtersTemp={filtersTemp}
          setFiltersTemp={setFiltersTemp}
        />

        <Box
          sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 4 }}
        >
          <Button variant="outlined" onClick={handleReset}>
            초기화
          </Button>
          <Button variant="outlined" onClick={onClose}>
            취소
          </Button>
          <Button variant="contained" onClick={handleApply}>
            적용
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CustomerFilterModal;
