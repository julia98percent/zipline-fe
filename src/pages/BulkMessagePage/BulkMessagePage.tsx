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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import PageHeader from "@components/PageHeader/PageHeader";
import apiClient from "@apis/apiClient";
import { SelectChangeEvent } from "@mui/material";

interface Customer {
  name: string;
  phone: string;
  role: string;
  labelId: number;
  labelName: string;
  region: string;
}

interface Template {
  id: string;
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

interface CustomerSelectModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (selectedCustomers: Customer[]) => void;
}

const CustomerSelectModal = ({
  open,
  onClose,
  onConfirm,
}: CustomerSelectModalProps) => {
  const [selectedRegion, setSelectedRegion] = useState<string>("전체");
  const [selectedRole, setSelectedRole] = useState<string[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [isLoadingLabels, setIsLoadingLabels] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // 샘플 데이터
  const customers: Customer[] = [
    {
      name: "김민수",
      phone: "010-1234-5678",
      role: "매도인",
      labelId: 1,
      labelName: "VIP",
      region: "서울",
    },
    {
      name: "이지연",
      phone: "010-2345-6789",
      role: "매수인",
      labelId: 2,
      labelName: "일반",
      region: "서울",
    },
    {
      name: "박준호",
      phone: "010-3456-7890",
      role: "임대인",
      labelId: 3,
      labelName: "신규",
      region: "부산",
    },
    // ... 더 많은 샘플 데이터
  ];

  const regions = ["전체", "서울", "부산", "대전", "광주", "인천"];
  const roles = ["매도인", "매수인", "임대인", "임차인"];

  useEffect(() => {
    const fetchLabels = async () => {
      if (!open) return;

      try {
        setIsLoadingLabels(true);
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
      } finally {
        setIsLoadingLabels(false);
      }
    };

    fetchLabels();
  }, [open]);

  const handleCustomerSelect = (customer: Customer) => {
    const isSelected = selectedCustomers.some((c) => c.name === customer.name);
    if (isSelected) {
      setSelectedCustomers(
        selectedCustomers.filter((c) => c.name !== customer.name)
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
      selectedRegion === "전체" || customer.region === selectedRegion;
    const roleMatch =
      selectedRole.length === 0 || selectedRole.includes(customer.role);
    const labelMatch =
      selectedLabel === null || customer.labelId === selectedLabel;
    return regionMatch && roleMatch && labelMatch;
  });

  // Get current page items
  const currentPageCustomers =
    selectedTab === 0
      ? filteredCustomers.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
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
          borderRadius: "12px",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          단체 문자 발송 대상 선택
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pb: 0 }}>
        <Box sx={{ mb: 3, display: "flex", gap: 3, alignItems: "flex-start" }}>
          <Box>
            <Typography variant="body2" sx={{ mb: 1, color: "#666666" }}>
              관심지역
            </Typography>
            <Select
              size="small"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              sx={{ minWidth: 120 }}
            >
              {regions.map((region) => (
                <MenuItem key={region} value={region}>
                  {region}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ mb: 1, color: "#666666" }}>
              고객 역할
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {roles.map((role) => (
                <Chip
                  key={role}
                  label={role}
                  onClick={() => {
                    if (selectedRole.includes(role)) {
                      setSelectedRole(selectedRole.filter((r) => r !== role));
                    } else {
                      setSelectedRole([...selectedRole, role]);
                    }
                  }}
                  sx={{
                    backgroundColor: selectedRole.includes(role)
                      ? "#164F9E"
                      : "#F8F9FA",
                    color: selectedRole.includes(role) ? "#FFFFFF" : "#666666",
                    "&:hover": {
                      backgroundColor: selectedRole.includes(role)
                        ? "#0D3B7A"
                        : "#E0E0E0",
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ mb: 1, color: "#666666" }}>
              고객 라벨
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Chip
                key="all"
                label="전체"
                onClick={() => setSelectedLabel(null)}
                sx={{
                  backgroundColor:
                    selectedLabel === null ? "#164F9E" : "#F8F9FA",
                  color: selectedLabel === null ? "#FFFFFF" : "#666666",
                  "&:hover": {
                    backgroundColor:
                      selectedLabel === null ? "#0D3B7A" : "#E0E0E0",
                  },
                }}
              />
              {isLoadingLabels ? (
                <CircularProgress size={20} />
              ) : (
                labels.map((label) => (
                  <Chip
                    key={label.uid}
                    label={label.name}
                    onClick={() => setSelectedLabel(label.uid)}
                    sx={{
                      backgroundColor:
                        selectedLabel === label.uid ? "#164F9E" : "#F8F9FA",
                      color:
                        selectedLabel === label.uid ? "#FFFFFF" : "#666666",
                      "&:hover": {
                        backgroundColor:
                          selectedLabel === label.uid ? "#0D3B7A" : "#E0E0E0",
                      },
                    }}
                  />
                ))
              )}
            </Box>
          </Box>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs
            value={selectedTab}
            onChange={(_, newValue) => {
              setSelectedTab(newValue);
              setPage(0); // Reset page when changing tabs
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
            <Tab label={`선택 가능한 고객 (${filteredCustomers.length}명)`} />
            <Tab label={`선택된 고객 (${selectedCustomers.length}명)`} />
          </Tabs>
        </Box>

        <List sx={{ height: "400px" }}>
          {currentPageCustomers.map((customer) => (
            <ListItem
              key={customer.name}
              sx={{
                borderRadius: 1,
                mb: 1,
                backgroundColor: "#F8F9FA",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#E0E0E0",
                },
              }}
              onClick={() => handleCustomerSelect(customer)}
            >
              <ListItemText
                primary={customer.name}
                secondary={
                  <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                    <Chip
                      label={customer.role}
                      size="small"
                      sx={{ backgroundColor: "#E3F2FD", color: "#1976D2" }}
                    />
                    <Chip
                      label={customer.labelName}
                      size="small"
                      sx={{ backgroundColor: "#E8F5E9", color: "#2E7D32" }}
                    />
                    <Chip
                      label={customer.region}
                      size="small"
                      sx={{ backgroundColor: "#FFF3E0", color: "#E65100" }}
                    />
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
                  {selectedCustomers.some((c) => c.name === customer.name) ? (
                    <CloseIcon />
                  ) : (
                    <AddIcon />
                  )}
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        <TablePagination
          component="div"
          count={
            selectedTab === 0
              ? filteredCustomers.length
              : selectedCustomers.length
          }
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
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [messageContent, setMessageContent] = useState<string>("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleTemplateChange = (event: SelectChangeEvent<string>) => {
    const selectedTemplateId = event.target.value;
    console.log(selectedTemplateId);
    setSelectedTemplate(selectedTemplateId);

    if (selectedTemplateId === "") {
      setMessageContent("");
      return;
    }

    const template = templates.find((t) => t.id === selectedTemplateId);
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

  const handleSendMessage = () => {
    // API 호출 로직 구현 예정
    console.log("Sending messages to:", customers);
    console.log("Message content:", messageContent);
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
        backgroundColor: "#F8F9FA",
      }}
    >
      <PageHeader title="단체 문자 발송" userName="사용자 이름" />

      <Box sx={{ p: 3, display: "flex", gap: 2 }}>
        {/* 왼쪽 영역: 문자 템플릿 선택 및 내용 */}
        <Paper
          sx={{
            flex: 1,
            p: 3,
            borderRadius: "12px",
            boxShadow: "none",
            border: "1px solid #E0E0E0",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: "#333333" }}>
            문자 템플릿 선택
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Select
              value={selectedTemplate}
              onChange={(event: SelectChangeEvent<string>) =>
                handleTemplateChange(event)
              }
              displayEmpty
              disabled={isLoading}
              renderValue={(selected) => {
                if (!selected) return <em>템플릿을 선택해주세요</em>;
                const template = templates.find((t) => t.id === selected);
                return template?.name || "";
              }}
              MenuProps={{
                PaperProps: {
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
                        key={template.id}
                        value={template.id}
                        selected={selectedTemplate === template.id}
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
              borderRadius: "12px",
              boxShadow: "none",
              border: "1px solid #E0E0E0",
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
                  "&:hover": {
                    backgroundColor: "#0D3B7A",
                  },
                }}
              >
                고객 추가
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
                    mb: 1,
                    backgroundColor: "#F8F9FA",
                    borderRadius: "4px",
                  }}
                >
                  <Box>
                    <Typography variant="body1">{customer.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {customer.phone}
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
      />
    </Box>
  );
};

export default BulkMessagePage;
