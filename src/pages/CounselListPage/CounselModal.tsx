import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  CircularProgress,
} from "@mui/material";
import { MenuItem, StringSelect } from "@components/Select";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  fetchCustomersForCounsel,
  fetchPropertiesForCounsel,
  createCounsel,
} from "@apis/counselService";
import { CounselCategory } from "@ts/counsel";
import Button from "@components/Button";

dayjs.extend(utc);
dayjs.extend(timezone);

interface Customer {
  uid: number;
  name: string;
}

interface Property {
  uid: number;
  address: string;
}

export interface CounselQuestion {
  content: string;
}

interface CounselModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function CounselModal({ open, onClose, onSuccess }: CounselModalProps) {
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [counselType, setCounselType] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [counselDateTime, setCounselDateTime] = useState(
    dayjs().tz("Asia/Seoul").format("YYYY-MM-DDTHH:mm")
  );
  const [counselContent, setCounselContent] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isCustomersLoading, setIsCustomersLoading] = useState(false);
  const [isPropertiesLoading, setIsPropertiesLoading] = useState(false);

  const fetchCustomers = async () => {
    setIsCustomersLoading(true);
    try {
      const customerList = await fetchCustomersForCounsel();
      setCustomers(customerList);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      setCustomers([]);
    } finally {
      setIsCustomersLoading(false);
    }
  };

  const fetchProperties = async () => {
    setIsPropertiesLoading(true);
    try {
      const propertyList = await fetchPropertiesForCounsel();
      setProperties(propertyList);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      setProperties([]);
    } finally {
      setIsPropertiesLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchCustomers();
      fetchProperties();
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!selectedCustomer || !counselType || !title || !counselDateTime) {
      alert("고객, 상담 유형, 제목, 상담일시는 필수 입력 항목입니다.");
      return;
    }

    if (!counselContent.trim()) {
      alert("상담 내용을 입력해주세요.");
      return;
    }

    try {
      await createCounsel(selectedCustomer, {
        title,
        counselDate: new Date(counselDateTime).toISOString(),
        type: counselType,
        dueDate,
        propertyUid: selectedProperty || undefined,

        content: counselContent,
      });

      onClose();
      onSuccess();
    } catch (error) {
      console.error("Failed to create counsel:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>상담 등록</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
          <TextField
            label="상담 제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />

          <StringSelect
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            label="고객 선택"
            disabled={isCustomersLoading}
            required
          >
            {isCustomersLoading ? (
              <MenuItem value="">
                <CircularProgress size={20} />
              </MenuItem>
            ) : (
              customers.map((customer) => (
                <MenuItem key={customer.uid} value={customer.uid}>
                  {customer.name}
                </MenuItem>
              ))
            )}
          </StringSelect>

          <StringSelect
            value={counselType}
            onChange={(e) => setCounselType(e.target.value)}
            label="상담 유형"
            required
          >
            {Object.entries(CounselCategory).map(([key, value]) => (
              <MenuItem key={key} value={value}>
                {value}
              </MenuItem>
            ))}
          </StringSelect>

          <TextField
            label="상담일시"
            type="datetime-local"
            value={counselDateTime}
            onChange={(e) => setCounselDateTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
          />

          <TextField
            label="희망 마감 기한"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <StringSelect
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            label="관련 매물"
            disabled={isPropertiesLoading}
          >
            {isPropertiesLoading ? (
              <MenuItem value="">
                <CircularProgress size={20} />
              </MenuItem>
            ) : (
              properties.map((property) => (
                <MenuItem key={property.uid} value={property.uid}>
                  {property.address}
                </MenuItem>
              ))
            )}
          </StringSelect>

          <TextField
            label="상담 내용"
            value={counselContent}
            onChange={(e) => setCounselContent(e.target.value)}
            multiline
            rows={6}
            placeholder="상담 내용을 입력해주세요"
            fullWidth
            required
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={
            !selectedCustomer || !counselType || !title || !counselDateTime
          }
        >
          등록
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CounselModal;
