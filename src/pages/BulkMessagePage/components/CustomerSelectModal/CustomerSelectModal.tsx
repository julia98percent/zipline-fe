import { useState, useEffect } from "react";
import { SelectChangeEvent } from "@mui/material";
import { fetchLabels, searchCustomers } from "@apis/customerService";
import { Customer, Label, CustomerRoleFilters } from "@ts/customer";
import { Region, RegionState } from "@ts/region";
import { fetchSido, fetchSigungu, fetchDong } from "@apis/regionService";
import CustomerSelectModalView from "./CustomerSelectModalView";

interface CustomerSelectModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (selectedCustomers: Customer[]) => void;
  selectedCustomers: Customer[];
}

const CustomerSelectModal = ({
  open,
  onClose,
  onConfirm,
  selectedCustomers: selectedCustomersProp,
}: CustomerSelectModalProps) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState<RegionState>({
    sido: [],
    sigungu: [],
    dong: [],
    selectedSido: null,
    selectedSigungu: null,
    selectedDong: null,
  });
  const [roleFilters, setRoleFilters] = useState<CustomerRoleFilters>({
    tenant: false,
    landlord: false,
    buyer: false,
    seller: false,
    noRole: false,
  });
  const [labelUids, setLabelUids] = useState<number[]>([]);

  // 필터 초기화 함수
  const resetFilters = () => {
    setSearch("");
    setRegion({
      sido: [],
      sigungu: [],
      dong: [],
      selectedSido: null,
      selectedSigungu: null,
      selectedDong: null,
    });
    setRoleFilters({
      tenant: false,
      landlord: false,
      buyer: false,
      seller: false,
      noRole: false,
    });
    setLabelUids([]);
    setPage(0);
    setSelectedTab(0);
  };

  // 모달이 닫힐 때 필터 초기화
  useEffect(() => {
    if (!open) {
      resetFilters();
    }
  }, [open]);

  useEffect(() => {
    const loadLabels = async () => {
      if (!open) return;
      try {
        const labelsData = await fetchLabels();
        setLabels(labelsData);
      } catch (error) {
        console.error("Error fetching labels:", error);
      }
    };

    loadLabels();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const loadSido = async () => {
      try {
        const sidoData = await fetchSido();
        setRegion((prev) => ({ ...prev, sido: sidoData }));
      } catch (error) {
        console.error("Error fetching sido:", error);
      }
    };
    loadSido();
  }, [open]);

  // 시/도 선택 시 군구 불러오기
  useEffect(() => {
    if (!region.selectedSido) return;
    const loadSigungu = async () => {
      try {
        const sigunguData = await fetchSigungu(region.selectedSido!);
        setRegion((prev) => ({
          ...prev,
          sigungu: sigunguData,
          selectedSigungu: null,
          selectedDong: null,
          dong: [],
        }));
      } catch (error) {
        console.error("Error fetching sigungu:", error);
      }
    };
    loadSigungu();
  }, [region.selectedSido]);

  // 군구 선택 시 동 불러오기
  useEffect(() => {
    if (!region.selectedSigungu) return;
    const loadDong = async () => {
      try {
        const dongData = await fetchDong(region.selectedSigungu!);
        setRegion((prev) => ({
          ...prev,
          dong: dongData,
          selectedDong: null,
        }));
      } catch (error) {
        console.error("Error fetching dong:", error);
      }
    };
    loadDong();
  }, [region.selectedSigungu]);

  const handleRegionChange =
    (type: "sido" | "sigungu" | "dong") =>
    (event: SelectChangeEvent<string>) => {
      const selectedRegion = region[type].find(
        (item: Region) => item.cortarName === event.target.value
      );
      if (selectedRegion) {
        setRegion((prev) => ({
          ...prev,
          [`selected${type.charAt(0).toUpperCase() + type.slice(1)}`]:
            selectedRegion.cortarNo,
          ...(type === "sido"
            ? {
                selectedSigungu: null,
                selectedDong: null,
                sigungu: [],
                dong: [],
              }
            : type === "sigungu"
            ? { selectedDong: null, dong: [] }
            : {}),
        }));
      }
    };

  // 지역 코드 빌드 함수
  const buildRegionCode = (
    selectedDong: number | null,
    selectedSigungu: number | null,
    selectedSido: number | null
  ): string | undefined => {
    if (selectedDong) {
      return String(selectedDong);
    } else if (selectedSigungu) {
      return String(selectedSigungu).slice(0, 5);
    } else if (selectedSido) {
      return String(selectedSido).slice(0, 2);
    }
    return undefined;
  };

  useEffect(() => {
    if (!open) return;

    const loadCustomers = async () => {
      setLoading(true);
      try {
        // 검색 파라미터 빌드
        const params = new URLSearchParams();
        params.append("page", (page + 1).toString());
        params.append("size", rowsPerPage.toString());

        if (search) {
          params.append("search", search);
        }

        const regionCode = buildRegionCode(
          region.selectedDong,
          region.selectedSigungu,
          region.selectedSido
        );
        if (regionCode) {
          params.append("regionCode", regionCode);
        }

        Object.entries(roleFilters).forEach(([key, value]) => {
          if (value) params.append(key, "true");
        });

        labelUids.forEach((uid) => params.append("labelUids", String(uid)));

        const { customers, totalCount } = await searchCustomers(params);
        setCustomers(customers);
        setTotalCount(totalCount);
      } catch (error) {
        console.error("Error loading customers:", error);
        setCustomers([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, [
    open,
    page,
    rowsPerPage,
    search,
    region.selectedSido,
    region.selectedSigungu,
    region.selectedDong,
    roleFilters,
    labelUids,
  ]);

  useEffect(() => {
    if (open) {
      setSelectedCustomers(selectedCustomersProp);
    }
  }, [open, selectedCustomersProp]);

  const handleCustomerSelect = (customer: Customer) => {
    const isSelected = selectedCustomers.some(
      (c: Customer) => c.uid === customer.uid
    );
    if (isSelected) {
      setSelectedCustomers(
        selectedCustomers.filter((c: Customer) => c.uid !== customer.uid)
      );
    } else {
      setSelectedCustomers([...selectedCustomers, customer]);
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedCustomers);
    onClose();
  };

  const handleRoleFilterChange = (role: string) => {
    setRoleFilters((prev: CustomerRoleFilters) => {
      if (role === "noRole") {
        // noRole을 선택하면 나머지 역할은 모두 false
        return {
          tenant: false,
          landlord: false,
          buyer: false,
          seller: false,
          noRole: !prev.noRole,
        };
      } else {
        // 다른 역할을 선택하면 noRole은 false
        return {
          ...prev,
          [role]: !prev[role as keyof CustomerRoleFilters],
          noRole: false,
        };
      }
    });
  };

  const handleLabelFilterChange = (labelUid: number) => {
    setLabelUids((uids: number[]) =>
      uids.includes(labelUid)
        ? uids.filter((id: number) => id !== labelUid)
        : [...uids, labelUid]
    );
  };

  const filteredCustomers = customers.filter((customer: Customer) => {
    const regionMatch =
      !region.selectedDong ||
      customer.trafficSource === String(region.selectedDong);
    // 역할 필터: noRole은 별도 처리
    const roleKeys = ["tenant", "landlord", "buyer", "seller"] as const;
    const hasRoleFilter = roleKeys.some((key) => roleFilters[key]);
    let roleMatch = true;
    if (roleFilters.noRole) {
      // 역할이 하나도 없는 고객만
      roleMatch =
        !customer.tenant &&
        !customer.landlord &&
        !customer.buyer &&
        !customer.seller;
    } else if (hasRoleFilter) {
      roleMatch = roleKeys.some((key) => roleFilters[key] && customer[key]);
    }
    const labelMatch =
      labelUids.length === 0 ||
      customer.labels.some((l: Label) => labelUids.includes(l.uid));
    return regionMatch && roleMatch && labelMatch;
  });

  const currentPageCustomers =
    selectedTab === 0
      ? filteredCustomers
      : selectedCustomers.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleTabChange = (newValue: number) => {
    setSelectedTab(newValue);
    setPage(0);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <CustomerSelectModalView
      open={open}
      onClose={onClose}
      selectedTab={selectedTab}
      totalCount={totalCount}
      selectedCustomers={selectedCustomers}
      currentPageCustomers={currentPageCustomers}
      page={page}
      rowsPerPage={rowsPerPage}
      loading={loading}
      search={search}
      region={region}
      roleFilters={roleFilters}
      labelUids={labelUids}
      labels={labels}
      onTabChange={handleTabChange}
      onCustomerSelect={handleCustomerSelect}
      onConfirm={handleConfirm}
      onSearchChange={setSearch}
      onRegionChange={handleRegionChange}
      onRoleFilterChange={handleRoleFilterChange}
      onLabelFilterChange={handleLabelFilterChange}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
    />
  );
};

export default CustomerSelectModal;
