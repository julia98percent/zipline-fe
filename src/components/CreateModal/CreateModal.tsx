import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useState } from "react";

export interface FormData {
  property: {
    title: string;
    type: string;
    price: string;
    address: string;
  };
  customer: {
    name: string;
    phone: string;
    email: string;
    type: string;
  };
  contract: {
    customerId: string;
    propertyId: string;
    type: string;
    startDate: string;
    endDate: string;
  };
  schedule: {
    title: string;
    date: string;
    time: string;
    type: string;
    description: string;
  };
  consultation: {
    customerName: string;
    title: string;
    date: string;
    time: string;
    description: string;
  };
}

interface CreateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  initialTab?: number;
}

const initialFormData: FormData = {
  property: {
    title: "",
    type: "",
    price: "",
    address: "",
  },
  customer: {
    name: "",
    phone: "",
    email: "",
    type: "",
  },
  contract: {
    customerId: "",
    propertyId: "",
    type: "",
    startDate: "",
    endDate: "",
  },
  schedule: {
    title: "",
    date: "",
    time: "",
    type: "",
    description: "",
  },
  consultation: {
    customerName: "",
    title: "",
    date: "",
    time: "",
    description: "",
  },
};

const CreateModal = ({
  open,
  onClose,
  onSubmit,
  initialTab = 0,
}: CreateModalProps) => {
  const [createTab, setCreateTab] = useState(initialTab);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleCreateTabChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setCreateTab(newValue);
  };

  const handleFormChange = (
    section: keyof FormData,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleClose = () => {
    setFormData(initialFormData);
    onClose();
  };

  const handleSubmit = () => {
    onSubmit(formData);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: "800px",
          height: "700px",
          maxHeight: "80vh",
          backgroundColor: "#FFFFFF",
          borderRadius: "8px",
        },
      }}
    >
      <DialogTitle sx={{ color: "#164F9E", fontWeight: "bold", p: 3 }}>
        등록하기
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Tabs
          value={createTab}
          onChange={handleCreateTabChange}
          sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
        >
          <Tab label="매물 등록" />
          <Tab label="고객 등록" />
          <Tab label="계약 등록" />
          <Tab label="일정 등록" />
          <Tab label="상담 등록" />
        </Tabs>

        {createTab === 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ width: "100%" }}>
              <TextField
                fullWidth
                label="제목"
                value={formData.property.title}
                onChange={(e) =>
                  handleFormChange("property", "title", e.target.value)
                }
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "240px" }}>
                <FormControl fullWidth>
                  <InputLabel>매물 유형</InputLabel>
                  <Select
                    value={formData.property.type}
                    onChange={(e) =>
                      handleFormChange("property", "type", e.target.value)
                    }
                    label="매물 유형"
                  >
                    <MenuItem value="apartment">아파트</MenuItem>
                    <MenuItem value="house">주택</MenuItem>
                    <MenuItem value="land">토지</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "240px" }}>
                <TextField
                  fullWidth
                  label="가격"
                  value={formData.property.price}
                  onChange={(e) =>
                    handleFormChange("property", "price", e.target.value)
                  }
                />
              </Box>
            </Box>
            <Box sx={{ width: "100%" }}>
              <TextField
                fullWidth
                label="주소"
                value={formData.property.address}
                onChange={(e) =>
                  handleFormChange("property", "address", e.target.value)
                }
              />
            </Box>
          </Box>
        )}

        {createTab === 1 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ width: "100%" }}>
              <TextField
                fullWidth
                label="고객명"
                value={formData.customer.name}
                onChange={(e) =>
                  handleFormChange("customer", "name", e.target.value)
                }
              />
            </Box>
            <Box sx={{ width: "100%" }}>
              <TextField
                fullWidth
                label="연락처"
                value={formData.customer.phone}
                onChange={(e) =>
                  handleFormChange("customer", "phone", e.target.value)
                }
              />
            </Box>
            <Box sx={{ width: "100%" }}>
              <TextField
                fullWidth
                label="이메일"
                value={formData.customer.email}
                onChange={(e) =>
                  handleFormChange("customer", "email", e.target.value)
                }
              />
            </Box>
            <Box sx={{ width: "100%" }}>
              <FormControl fullWidth>
                <InputLabel>고객 유형</InputLabel>
                <Select
                  value={formData.customer.type}
                  label="고객 유형"
                  onChange={(e) =>
                    handleFormChange("customer", "type", e.target.value)
                  }
                >
                  <MenuItem value="buyer">매수자</MenuItem>
                  <MenuItem value="seller">매도자</MenuItem>
                  <MenuItem value="tenant">임차인</MenuItem>
                  <MenuItem value="landlord">임대인</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        )}

        {createTab === 2 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ width: "100%" }}>
              <TextField
                fullWidth
                label="고객 ID"
                value={formData.contract.customerId}
                onChange={(e) =>
                  handleFormChange("contract", "customerId", e.target.value)
                }
              />
            </Box>
            <Box sx={{ width: "100%" }}>
              <TextField
                fullWidth
                label="매물 ID"
                value={formData.contract.propertyId}
                onChange={(e) =>
                  handleFormChange("contract", "propertyId", e.target.value)
                }
              />
            </Box>
            <Box sx={{ width: "100%" }}>
              <FormControl fullWidth>
                <InputLabel>계약 유형</InputLabel>
                <Select
                  value={formData.contract.type}
                  label="계약 유형"
                  onChange={(e) =>
                    handleFormChange("contract", "type", e.target.value)
                  }
                >
                  <MenuItem value="sale">매매</MenuItem>
                  <MenuItem value="rent">임대</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ width: "100%" }}>
              <TextField
                fullWidth
                label="시작일"
                type="date"
                value={formData.contract.startDate}
                onChange={(e) =>
                  handleFormChange("contract", "startDate", e.target.value)
                }
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box sx={{ width: "100%" }}>
              <TextField
                fullWidth
                label="종료일"
                type="date"
                value={formData.contract.endDate}
                onChange={(e) =>
                  handleFormChange("contract", "endDate", e.target.value)
                }
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Box>
        )}

        {createTab === 3 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ width: "100%" }}>
              <TextField
                fullWidth
                label="일정 제목"
                value={formData.schedule.title}
                onChange={(e) =>
                  handleFormChange("schedule", "title", e.target.value)
                }
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "240px" }}>
                <TextField
                  fullWidth
                  label="날짜"
                  type="date"
                  value={formData.schedule.date}
                  onChange={(e) =>
                    handleFormChange("schedule", "date", e.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "240px" }}>
                <TextField
                  fullWidth
                  label="시간"
                  type="time"
                  value={formData.schedule.time}
                  onChange={(e) =>
                    handleFormChange("schedule", "time", e.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Box>
            <Box sx={{ width: "100%" }}>
              <FormControl fullWidth>
                <InputLabel>일정 유형</InputLabel>
                <Select
                  value={formData.schedule.type}
                  label="일정 유형"
                  onChange={(e) =>
                    handleFormChange("schedule", "type", e.target.value)
                  }
                >
                  <MenuItem value="meeting">미팅</MenuItem>
                  <MenuItem value="inspection">실사</MenuItem>
                  <MenuItem value="contract">계약</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ width: "100%" }}>
              <TextField
                fullWidth
                label="설명"
                multiline
                rows={4}
                value={formData.schedule.description}
                onChange={(e) =>
                  handleFormChange("schedule", "description", e.target.value)
                }
              />
            </Box>
          </Box>
        )}

        {createTab === 4 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ width: "100%" }}>
              <TextField
                fullWidth
                label="고객명"
                value={formData.consultation.customerName}
                onChange={(e) =>
                  handleFormChange(
                    "consultation",
                    "customerName",
                    e.target.value
                  )
                }
              />
            </Box>
            <Box sx={{ width: "100%" }}>
              <TextField
                fullWidth
                label="상담 제목"
                value={formData.consultation.title}
                onChange={(e) =>
                  handleFormChange("consultation", "title", e.target.value)
                }
              />
            </Box>
            <Box sx={{ width: "100%" }}>
              <TextField
                fullWidth
                label="날짜"
                type="date"
                value={formData.consultation.date}
                onChange={(e) =>
                  handleFormChange("consultation", "date", e.target.value)
                }
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box sx={{ width: "100%" }}>
              <TextField
                fullWidth
                label="시간"
                type="time"
                value={formData.consultation.time}
                onChange={(e) =>
                  handleFormChange("consultation", "time", e.target.value)
                }
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box sx={{ width: "100%" }}>
              <TextField
                fullWidth
                label="상담 내용"
                multiline
                rows={4}
                value={formData.consultation.description}
                onChange={(e) =>
                  handleFormChange(
                    "consultation",
                    "description",
                    e.target.value
                  )
                }
              />
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} sx={{ color: "#666666" }}>
          취소
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            backgroundColor: "#164F9E",
            "&:hover": {
              backgroundColor: "#0D3B7A",
            },
          }}
        >
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateModal;
