import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  TablePagination,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import { fetchLabels, searchCustomers } from "@apis/customerService";
import { Label, Customer } from "@ts/customer";
import { RegionState } from "@ts/region";
import { fetchSido, fetchSigungu, fetchDong } from "@apis/regionService";
import CustomerFilters from "./CustomerFilters";
import CustomerList from "./CustomerList";

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
  const [roleFilters, setRoleFilters] = useState({
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
        (item) => item.cortarName === event.target.value
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
    const isSelected = selectedCustomers.some((c) => c.uid === customer.uid);
    if (isSelected) {
      setSelectedCustomers(
        selectedCustomers.filter((c) => c.uid !== customer.uid)
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
    setRoleFilters((f) => ({ ...f, [role]: !f[role as keyof typeof f] }));
  };

  const handleLabelFilterChange = (labelUid: number) => {
    setLabelUids((uids) =>
      uids.includes(labelUid)
        ? uids.filter((id) => id !== labelUid)
        : [...uids, labelUid]
    );
  };

  const filteredCustomers = customers.filter((customer) => {
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
      customer.labels.some((l) => labelUids.includes(l.uid));
    return regionMatch && roleMatch && labelMatch;
  });

  const currentPageCustomers =
    selectedTab === 0
      ? filteredCustomers
      : selectedCustomers.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "8px",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          단체 문자 발송 대상 선택
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pb: 0 }}>
        <CustomerFilters
          search={search}
          region={region}
          roleFilters={roleFilters}
          labelUids={labelUids}
          labels={labels}
          onSearchChange={setSearch}
          onRegionChange={handleRegionChange}
          onRoleFilterChange={handleRoleFilterChange}
          onLabelFilterChange={handleLabelFilterChange}
        />

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs
            value={selectedTab}
            onChange={(_, newValue) => {
              setSelectedTab(newValue);
              setPage(0);
            }}
            sx={{
              "& .MuiTab-root": {
                minWidth: "auto",
                px: 2,
                py: 1,
              },
              "& .Mui-selected": {
                color: "#164F9E !important",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#164F9E",
              },
            }}
          >
            <Tab label={`선택 가능한 고객 (${totalCount}명)`} />
            <Tab label={`선택된 고객 (${selectedCustomers.length}명)`} />
          </Tabs>
        </Box>

        <CustomerList
          customers={currentPageCustomers}
          selectedCustomers={selectedCustomers}
          loading={loading}
          onCustomerSelect={handleCustomerSelect}
        />

        <TablePagination
          component="div"
          count={selectedTab === 0 ? totalCount : selectedCustomers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 20, 50]}
          sx={{
            borderTop: 1,
            borderColor: "divider",
            "& .MuiTablePagination-select": {
              paddingTop: 0,
              paddingBottom: 0,
            },
          }}
          labelRowsPerPage="페이지당 고객 수"
          labelDisplayedRows={({ from, to, count }) =>
            `${count}명 중 ${from}-${to}명`
          }
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: "#666666",
            color: "#666666",
            "&:hover": {
              borderColor: "#333333",
              backgroundColor: "rgba(102, 102, 102, 0.04)",
            },
          }}
        >
          취소
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          sx={{
            backgroundColor: "#164F9E",
            "&:hover": {
              backgroundColor: "#0D3B7A",
            },
          }}
        >
          확인 ({selectedCustomers.length}명)
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerSelectModal;
