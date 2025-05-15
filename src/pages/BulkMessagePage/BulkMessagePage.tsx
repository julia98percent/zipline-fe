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
import apiClient from "@apis/apiClient";
import { SelectChangeEvent } from "@mui/material";
import useUserStore from "@stores/useUserStore";
import { showToast } from "@components/Toast/Toast";

interface Customer {
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

interface Template {
  uid: number;
  name: string;
  content: string;
  category: string;
}

interface TemplateResponse {
  success: boolean;
  code: number;
  message: string;
  data: Template[];
}

interface Label {
  uid: number;
  name: string;
}

interface LabelResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    labels: Label[];
  };
}

interface CustomerListResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    customers: Customer[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
  };
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
  const [regionCode, setRegionCode] = useState("");
  const [roleFilters, setRoleFilters] = useState({
    tenant: false,
    landlord: false,
    buyer: false,
    seller: false,
    noRole: false,
  });
  const [labelUids, setLabelUids] = useState<number[]>([]);

  // 역할 한글 라벨 및 색상 매핑
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

  useEffect(() => {
    const fetchLabels = async () => {
      if (!open) return;

      try {
        const { data: response } = await apiClient.get<LabelResponse>(
          "/labels"
        );

        if (response.success && response.code === 200) {
          setLabels(response.data.labels);
        } else {
          console.error("Failed to fetch labels:", response.message);
        }
      } catch (error) {
        console.error("Error fetching labels:", error);
      }
    };

    fetchLabels();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("page", (page + 1).toString());
        params.append("size", rowsPerPage.toString());
        if (search) params.append("search", search);
        if (regionCode) params.append("regionCode", regionCode);
        Object.entries(roleFilters).forEach(([key, value]) => {
          if (value) params.append(key, "true");
        });
        labelUids.forEach((uid) => params.append("labelUids", String(uid)));
        const { data: response } = await apiClient.get<CustomerListResponse>(
          `/customers?${params.toString()}`
        );

        if (response.success) {
          setCustomers(response.data.customers);
          setTotalCount(response.data.totalElements);
        }
      } catch {
        setCustomers([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [open, page, rowsPerPage, search, regionCode, roleFilters, labelUids]);

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
      regionCode === "전체" ||
      !regionCode ||
      customer.trafficSource === regionCode;
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

  const handleChangePage = (event: unknown, newPage: number) => {
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
            <Select
              size="small"
              value={regionCode}
              onChange={(e) => setRegionCode(e.target.value)}
              displayEmpty
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="">전체</MenuItem>
              <MenuItem value="SEOUL">서울</MenuItem>
              <MenuItem value="BUSAN">부산</MenuItem>
              <MenuItem value="DAEJEON">대전</MenuItem>
              <MenuItem value="GWANGJU">광주</MenuItem>
              <MenuItem value="INCHEON">인천</MenuItem>
            </Select>
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

const BulkMessagePage = () => {
  const { user } = useUserStore();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<number | "">("");
  const [messageContent, setMessageContent] = useState<string>("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  // 변수를 고객 정보로 대체하는 함수
  const replaceVariablesWithCustomerInfo = (
    content: string,
    customer: Customer
  ) => {
    // 생일 포맷팅 (YYYYMMDD -> M월 D일)
    const formatBirthday = (dateStr: string) => {
      try {
        const month = parseInt(dateStr.substring(4, 6), 10);
        const day = parseInt(dateStr.substring(6, 8), 10);
        return `${month}월 ${day}일`;
      } catch (error) {
        console.error("Invalid date format:", error);
        return "날짜 정보 없음";
      }
    };

    const replacements = {
      "{{이름}}": `${customer.name}`,
      "{{생년월일}}": customer.birthday
        ? formatBirthday(customer.birthday)
        : "생일 정보 없음",
      "{{관심지역}}": customer.legalDistrictCode
        ? `$$###{${customer.legalDistrictCode}}`
        : "",
    };

    return content.replace(/{{[^}]+}}/g, (match) => {
      return replacements[match as keyof typeof replacements] || match;
    });
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setIsLoading(true);
        const { data: response } = await apiClient.get<TemplateResponse>(
          "/templates"
        );

        if (response.success && response.code === 200) {
          setTemplates(response.data);
        } else {
          console.error("Failed to fetch templates:", response.message);
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleTemplateChange = (event: SelectChangeEvent<number | string>) => {
    const selectedTemplateUid =
      event.target.value === "" ? "" : Number(event.target.value);
    setSelectedTemplate(selectedTemplateUid);

    if (!selectedTemplateUid) {
      setMessageContent("");
      return;
    }

    const template = templates.find((t) => t.uid === selectedTemplateUid);
    if (template) {
      setMessageContent(template.content);
    }
  };

  const handleAddCustomer = () => {
    setIsCustomerModalOpen(true);
  };

  const handleCustomerSelectConfirm = (selectedCustomers: Customer[]) => {
    setCustomers(selectedCustomers);
  };

  const handleRemoveCustomer = (index: number) => {
    setCustomers(customers.filter((_, i) => i !== index));
  };

  const handleSendMessage = async () => {
    if (!customers.length || !selectedTemplate) return;
    const from = import.meta.env.VITE_MSG_PHONE_NUMBER;
    const template = templates.find((t) => t.uid === selectedTemplate);
    if (!template) return;

    const payload = customers.map((customer) => ({
      from,
      to: customer.phoneNo.replace(/\D/g, ""),
      text: replaceVariablesWithCustomerInfo(template.content, customer),
    }));

    try {
      await apiClient.post("/messages", payload);
      showToast({
        message: "문자를 발송했습니다.",
        type: "success",
      });
      setCustomers([]);
      setSelectedTemplate("");
      setMessageContent("");
    } catch {
      showToast({
        message: "문자 발송에 실패했습니다.",
        type: "error",
      });
    }
  };

  // Group templates by category
  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, Template[]>);

  return (
    <Box
      sx={{
        p: 0,
        pb: 3,
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <PageHeader title="단체 문자 발송" userName={user?.name || "-"} />

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
              onChange={handleTemplateChange}
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
              SelectProps={{
                sx: {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderRadius: "20px",
                  },
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
            onChange={(e) => setMessageContent(e.target.value)}
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
                onClick={handleAddCustomer}
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
                    onClick={() => handleRemoveCustomer(index)}
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
            onClick={handleSendMessage}
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
        onClose={() => setIsCustomerModalOpen(false)}
        onConfirm={handleCustomerSelectConfirm}
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
