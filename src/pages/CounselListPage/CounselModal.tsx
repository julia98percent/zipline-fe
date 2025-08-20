import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
} from "@mui/material";
import DatePicker from "@components/DatePicker";
import { MenuItem, StringSelect } from "@components/Select";
import dayjs, { Dayjs } from "dayjs";
import {
  fetchCustomersForCounsel,
  fetchPropertiesForCounsel,
  createCounsel,
} from "@apis/counselService";
import { CounselCategory } from "@ts/counsel";
import Button from "@components/Button";

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
  const [dueDate, setDueDate] = useState<Dayjs | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [title, setTitle] = useState("");
  const [counselDateTime, setCounselDateTime] = useState<Dayjs | null>(
    dayjs().tz("Asia/Seoul")
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

  const handleResetForm = () => {
    setSelectedCustomer("");
    setCounselType("");
    setDueDate(null);
    setSelectedProperty("");
    setTitle("");
    setCounselDateTime(dayjs().tz("Asia/Seoul"));
    setCounselContent("");
  };

  const handleSubmit = async () => {
    if (!counselDateTime) return;

    try {
      await createCounsel(selectedCustomer, {
        title,
        counselDate: counselDateTime,
        type: counselType,
        dueDate,
        propertyUid: selectedProperty || undefined,
        content: counselContent,
      });

      onClose();
      onSuccess();
      handleResetForm();
    } catch (error) {
      console.error("Failed to create counsel:", error);
    }
  };

  const getValidationErrors = () => {
    const errors: string[] = [];

    if (!selectedCustomer) {
      errors.push("고객을 선택해주세요.");
    }
    if (!counselType) {
      errors.push("상담 유형을 선택해주세요.");
    }
    if (!title) {
      errors.push("상담 제목을 입력해주세요.");
    }
    if (!counselDateTime) {
      errors.push("상담 일시를 선택해주세요.");
    }
    if (!counselContent.trim()) {
      errors.push("상담 내용을 입력해주세요.");
    }

    return errors;
  };
  const validationErrors = getValidationErrors();
  const isSubmitButtonDisabled = validationErrors.length > 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="border-b text-primary font-bold border-gray-200">
        상담 등록
      </DialogTitle>

      <DialogContent className=" p-7">
        <div className="flex flex-col gap-4">
          <TextField
            label="상담 제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StringSelect
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              label="고객 선택"
              disabled={isCustomersLoading}
              required
              size="medium"
            >
              {customers.map((customer) => (
                <MenuItem key={customer.uid} value={customer.uid}>
                  {customer.name}
                </MenuItem>
              ))}
            </StringSelect>

            <StringSelect
              value={counselType}
              onChange={(e) => setCounselType(e.target.value)}
              label="상담 유형"
              required
              size="medium"
            >
              {Object.entries(CounselCategory).map(([key, value]) => (
                <MenuItem key={key} value={value}>
                  {value}
                </MenuItem>
              ))}
            </StringSelect>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DatePicker
              isDateTimePicker
              label="상담일시"
              value={counselDateTime}
              onChange={setCounselDateTime}
            />

            <DatePicker
              label="의뢰 마감일"
              value={dueDate}
              onChange={setDueDate}
            />
          </div>

          <StringSelect
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            label="관련 매물"
            disabled={isPropertiesLoading}
            size="medium"
          >
            {properties.map((property) => (
              <MenuItem key={property.uid} value={property.uid}>
                {property.address}
              </MenuItem>
            ))}
          </StringSelect>

          <TextField
            label="상담 내용"
            value={counselContent}
            onChange={(e) => setCounselContent(e.target.value)}
            multiline
            rows={6}
            placeholder="상담 내용을 입력해주세요 (최대 500자)"
            fullWidth
            required
            inputProps={{ maxLength: 500 }}
          />
        </div>
      </DialogContent>
      <DialogActions className="flex flex-row-reverse items-center justify-between p-6 border-t border-gray-200">
        <div className="flex gap-2">
          <Button variant="outlined" onClick={onClose}>
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isSubmitButtonDisabled}
          >
            등록
          </Button>
        </div>
        {isSubmitButtonDisabled && (
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
}

export default CounselModal;
