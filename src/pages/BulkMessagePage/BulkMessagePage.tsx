import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Select,
  MenuItem,
  IconButton,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
  ListSubheader,
  TablePagination,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import PageHeader from "@components/PageHeader/PageHeader";
import { SelectChangeEvent } from "@mui/material";
import { fetchLabels, Label, searchCustomers } from "@apis/customerService";
import { Template } from "@apis/messageService";
import {
  Region,
  fetchSido,
  fetchSigungu,
  fetchDong,
} from "@apis/regionService";

export interface Customer {
  uid: number;
  name: string;
  phoneNo: string;
  trafficSource: string;
  labels: { uid: number; name: string }[];
  tenant: boolean;
  landlord: boolean;
  buyer: boolean;
  seller: boolean;
  birthday: string; // YYYYMMDD 형식
  legalDistrictCode: string;
}

interface RegionState {
  sido: Region[];
  sigungu: Region[];
  dong: Region[];
  selectedSido: number | null;
  selectedSigungu: number | null;
  selectedDong: number | null;
  [key: string]: Region[] | number | null;
}

interface BulkMessagePageProps {
  templates: Template[];
  selectedTemplate: number | "";
  messageContent: string;
  customers: Customer[];
  isCustomerModalOpen: boolean;
  isLoading: boolean;
  groupedTemplates: Record<string, Template[]>;
  onTemplateChange: (event: SelectChangeEvent<number | string>) => void;
  onAddCustomer: () => void;
  onCustomerSelectConfirm: (selectedCustomers: Customer[]) => void;
  onRemoveCustomer: (index: number) => void;
  onSendMessage: () => void;
  onCloseCustomerModal: () => void;
}

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

  const ROLE_LABELS: Record<string, string> = {
    tenant: "임차인",
    landlord: "임대인",
    buyer: "매수자",
    seller: "매도자",
    noRole: "역할없음",
  };
  const ROLE_COLORS: Record<
    string,
    { bg: string; color: string; selectedBg?: string; selectedColor?: string }
  > = {
    tenant: { bg: "#FEF5EB", color: "#F2994A" },
    landlord: { bg: "#FDEEEE", color: "#EB5757" },
    buyer: { bg: "#E9F7EF", color: "#219653" },
    seller: { bg: "#EBF2FC", color: "#2F80ED" },
    noRole: {
      bg: "#F5F5F5",
      color: "#666666",
      selectedBg: "#BDBDBD",
      selectedColor: "#fff",
    },
  };

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
        <Box
          sx={{ mb: 3, display: "flex", flexDirection: "column", gap: "28px" }}
        >
          <Box
            sx={{
              display: "flex",
              gap: "28px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {/* 검색창 */}
            <TextField
              size="small"
              placeholder="이름, 전화번호 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: 180 }}
            />
            {/* 지역 선택 */}
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Typography
                variant="body2"
                sx={{ color: "#666666", minWidth: 60 }}
              >
                지역
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                {(["sido", "sigungu", "dong"] as const).map((type) => {
                  const regions = region[type] as Region[];
                  const selectedValue =
                    region[
                      `selected${type.charAt(0).toUpperCase() + type.slice(1)}`
                    ];

                  return (
                    <FormControl key={type} size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={
                          regions.find(
                            (item) => item.cortarNo === selectedValue
                          )?.cortarName || ""
                        }
                        onChange={handleRegionChange(type)}
                        displayEmpty
                        disabled={
                          type !== "sido" &&
                          !region[
                            `selected${type === "dong" ? "Sigungu" : "Sido"}`
                          ]
                        }
                        sx={{
                          backgroundColor: "#fff",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#E0E0E0",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#164F9E",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#164F9E",
                          },
                        }}
                      >
                        <MenuItem value="">
                          <em>
                            {type === "sido"
                              ? "시/도"
                              : type === "sigungu"
                              ? "시/군/구"
                              : "읍/면/동"}
                          </em>
                        </MenuItem>
                        {regions.map((item) => (
                          <MenuItem key={item.cortarNo} value={item.cortarName}>
                            {item.cortarName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
                })}
              </Box>
            </Box>
            {/* 역할 필터 */}
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Typography
                variant="body2"
                sx={{ color: "#666666", minWidth: 60 }}
              >
                고객 역할
              </Typography>
              {(Object.keys(roleFilters) as (keyof typeof roleFilters)[]).map(
                (role) => (
                  <Chip
                    key={role}
                    label={ROLE_LABELS[role]}
                    onClick={() =>
                      setRoleFilters((f) => ({ ...f, [role]: !f[role] }))
                    }
                    sx={{
                      backgroundColor:
                        role === "noRole"
                          ? roleFilters[role]
                            ? ROLE_COLORS.noRole.selectedBg
                            : ROLE_COLORS.noRole.bg
                          : roleFilters[role]
                          ? ROLE_COLORS[role].bg
                          : "#F8F9FA",
                      color:
                        role === "noRole"
                          ? roleFilters[role]
                            ? ROLE_COLORS.noRole.selectedColor
                            : ROLE_COLORS.noRole.color
                          : roleFilters[role]
                          ? ROLE_COLORS[role].color
                          : "#666666",
                      fontWeight: 500,
                      borderRadius: "4px",
                      height: "28px",
                      fontSize: "13px",
                      "&:hover": {
                        backgroundColor:
                          role === "noRole"
                            ? roleFilters[role]
                              ? ROLE_COLORS.noRole.selectedBg
                              : "#E0E0E0"
                            : roleFilters[role]
                            ? ROLE_COLORS[role].bg
                            : "#E0E0E0",
                      },
                    }}
                  />
                )
              )}
            </Box>
            {/* 라벨 필터 */}
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Typography
                variant="body2"
                sx={{ color: "#666666", minWidth: 60 }}
              >
                고객 라벨
              </Typography>
              {labels.map((label) => (
                <Chip
                  key={label.uid}
                  label={label.name}
                  onClick={() =>
                    setLabelUids((uids) =>
                      uids.includes(label.uid)
                        ? uids.filter((id) => id !== label.uid)
                        : [...uids, label.uid]
                    )
                  }
                  sx={{
                    backgroundColor: labelUids.includes(label.uid)
                      ? "#164F9E"
                      : "#F8F9FA",
                    color: labelUids.includes(label.uid)
                      ? "#FFFFFF"
                      : "#666666",
                    "&:hover": {
                      backgroundColor: labelUids.includes(label.uid)
                        ? "#0D3B7A"
                        : "#E0E0E0",
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>

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

        <List
          sx={{
            height: 320,
            overflowY: "auto",
            border: "1px solid #eee",
            borderRadius: "8px",
            background: "#fff",
            mb: 2,
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            currentPageCustomers.map((customer) => (
              <ListItem
                key={customer.uid}
                sx={{
                  borderRadius: 1,
                  mb: 1,
                  backgroundColor: selectedCustomers.some(
                    (c) => c.uid === customer.uid
                  )
                    ? "#F6F8FF"
                    : "#F8F9FA",
                  cursor: "pointer",
                  border: selectedCustomers.some((c) => c.uid === customer.uid)
                    ? "1px solid #164F9E"
                    : "1px solid transparent",
                  "&:hover": {
                    backgroundColor: selectedCustomers.some(
                      (c) => c.uid === customer.uid
                    )
                      ? "#EBF2FC"
                      : "#E0E0E0",
                  },
                }}
                onClick={() => handleCustomerSelect(customer)}
              >
                <ListItemText
                  primary={customer.name}
                  secondary={
                    <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                      {customer.tenant && (
                        <Chip
                          label="임차인"
                          size="small"
                          sx={{ backgroundColor: "#FEF5EB", color: "#F2994A" }}
                        />
                      )}
                      {customer.landlord && (
                        <Chip
                          label="임대인"
                          size="small"
                          sx={{ backgroundColor: "#FDEEEE", color: "#EB5757" }}
                        />
                      )}
                      {customer.buyer && (
                        <Chip
                          label="매수자"
                          size="small"
                          sx={{ backgroundColor: "#E9F7EF", color: "#219653" }}
                        />
                      )}
                      {customer.seller && (
                        <Chip
                          label="매도자"
                          size="small"
                          sx={{ backgroundColor: "#EBF2FC", color: "#2F80ED" }}
                        />
                      )}
                      {customer.labels &&
                        customer.labels.length > 0 &&
                        customer.labels.map((label) => (
                          <Chip
                            key={label.uid}
                            label={label.name}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCustomerSelect(customer);
                    }}
                  >
                    {selectedCustomers.some((c) => c.uid === customer.uid) ? (
                      <CloseIcon sx={{ color: "#164F9E" }} />
                    ) : (
                      <AddIcon />
                    )}
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          )}
        </List>

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

const BulkMessagePage = ({
  templates,
  selectedTemplate,
  messageContent,
  customers,
  isCustomerModalOpen,
  isLoading,
  groupedTemplates,
  onTemplateChange,
  onAddCustomer,
  onCustomerSelectConfirm,
  onRemoveCustomer,
  onSendMessage,
  onCloseCustomerModal,
}: BulkMessagePageProps) => {
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  return (
    <Box
      sx={{
        p: 0,
        pb: 3,
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <PageHeader title="단체 문자 발송" />

      <Box sx={{ p: 3, display: "flex", gap: "28px" }}>
        {/* 왼쪽 영역: 문자 템플릿 선택 및 내용 */}
        <Paper
          sx={{
            flex: 1,
            p: 3,
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: "#333333" }}>
            문자 템플릿 선택
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Select
              value={selectedTemplate}
              onChange={onTemplateChange}
              displayEmpty
              disabled={isLoading}
              renderValue={(selected) => {
                if (!selected) return <em>템플릿을 선택해주세요</em>;
                const template = templates.find((t) => t.uid === selected);
                return template?.name || "";
              }}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "20px",
                },
              }}
              MenuProps={{
                PaperProps: {
                  borderRadius: "20px",
                  sx: {
                    maxHeight: 300,
                    "& .MuiMenuItem-root": {
                      padding: "8px 16px",
                    },

                    "& .MuiListSubheader-root": {
                      backgroundColor: "#f5f5f5",
                      lineHeight: "32px",
                      fontSize: "0.875rem",
                    },
                  },
                },
              }}
            >
              <MenuItem value="">
                <em>템플릿을 선택해주세요</em>
              </MenuItem>
              {isLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                Object.entries(groupedTemplates).map(
                  ([category, categoryTemplates]) => [
                    <ListSubheader key={category}>{category}</ListSubheader>,
                    ...categoryTemplates.map((template) => (
                      <MenuItem
                        key={template.uid}
                        value={template.uid}
                        sx={{
                          pl: 4,
                          "&.Mui-selected": {
                            backgroundColor: "#E3F2FD !important",
                          },
                          "&.Mui-selected:hover": {
                            backgroundColor: "#BBDEFB !important",
                          },
                        }}
                      >
                        {template.name}
                      </MenuItem>
                    )),
                  ]
                )
              )}
            </Select>
          </FormControl>
          <TextField
            disabled
            fullWidth
            multiline
            rows={10}
            value={messageContent}
            onChange={() => {}}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderRadius: "20px",
              },
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#FFFFFF",
                "& fieldset": {
                  borderColor: "#E0E0E0",
                },
                "&:hover fieldset": {
                  borderColor: "#164F9E",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#164F9E",
                },
              },
            }}
          />
        </Paper>

        {/* 오른쪽 영역: 고객 추가 */}
        <Box sx={{ width: "400px" }}>
          <Paper
            sx={{
              p: 3,
              mb: 2,
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" sx={{ color: "#333333" }}>
                고객 추가
              </Typography>
              <Button
                variant="contained"
                onClick={onAddCustomer}
                sx={{
                  backgroundColor: "#164F9E",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "#0D3B7A",
                    boxShadow: "none",
                  },
                }}
              >
                고객 선택하기
              </Button>
            </Box>
            <Box sx={{ maxHeight: "300px", overflowY: "auto" }}>
              {customers.map((customer, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 1,
                    mb: "28px",
                    backgroundColor: "#F8F9FA",
                    borderRadius: "4px",
                  }}
                >
                  <Box>
                    <Typography variant="body1">{customer.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {customer.phoneNo}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => onRemoveCustomer(index)}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Paper>

          <Button
            fullWidth
            variant="contained"
            onClick={onSendMessage}
            disabled={customers.length === 0 || !selectedTemplate}
            sx={{
              height: "48px",

              backgroundColor: "#164F9E",
              "&:hover": {
                backgroundColor: "#0D3B7A",
              },
              "&.Mui-disabled": {
                backgroundColor: "#E0E0E0",
                color: "#9E9E9E",
              },
            }}
          >
            {customers.length === 0
              ? "고객을 추가해주세요"
              : !selectedTemplate
              ? "템플릿을 선택해주세요"
              : `${customers.length}명에게 발송하기`}
          </Button>
        </Box>
      </Box>

      <CustomerSelectModal
        open={isCustomerModalOpen}
        onClose={onCloseCustomerModal}
        onConfirm={onCustomerSelectConfirm}
        selectedCustomers={customers}
      />
      <Snackbar
        open={toast.open}
        autoHideDuration={2000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ bottom: "24px !important" }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          sx={{
            width: "100%",
            minWidth: "240px",
            borderRadius: "8px",
            backgroundColor:
              toast.severity === "success" ? "#F6F8FF" : "#FFF5F5",
            color: toast.severity === "success" ? "#164F9E" : "#D32F2F",
            border: `1px solid ${
              toast.severity === "success" ? "#164F9E" : "#D32F2F"
            }`,
            "& .MuiAlert-icon": {
              color: toast.severity === "success" ? "#164F9E" : "#D32F2F",
            },
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BulkMessagePage;
