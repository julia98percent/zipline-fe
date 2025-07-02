import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  fetchCustomersForCounsel,
  fetchPropertiesForCounsel,
  createCounsel,
} from "@apis/counselService";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { CounselCategory } from "@ts/counsel";

interface Customer {
  uid: number;
  name: string;
}

interface Property {
  uid: number;
  address: string;
}

export interface CounselQuestion {
  question: string;
  answer: string;
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
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [counselDateTime, setCounselDateTime] = useState("");
  const [questions, setQuestions] = useState<CounselQuestion[]>([
    { question: "", answer: "" },
  ]);
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

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: "", answer: "" }]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
    }
  };

  const handleQuestionChange = (
    index: number,
    field: keyof CounselQuestion,
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async () => {
    // 필수 입력 항목 검증
    if (!selectedCustomer || !counselType || !title || !counselDateTime) {
      alert("고객, 상담 유형, 제목, 상담일시는 필수 입력 항목입니다.");
      return;
    }

    // 최소 하나의 문항이 있는지 확인
    const hasValidQuestion = questions.some(
      (q) => q.question.trim() && q.answer.trim()
    );
    if (!hasValidQuestion) {
      alert("최소 하나의 문항을 입력해주세요.");
      return;
    }

    try {
      await createCounsel(selectedCustomer, {
        title,
        counselDate: new Date(counselDateTime).toISOString(),
        type: counselType,
        dueDate,
        propertyUid: selectedProperty,
        counselDetails: questions.map((q) => ({
          question: q.question,
          answer: q.answer,
        })),
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

          <FormControl fullWidth>
            <InputLabel>고객 선택</InputLabel>
            <Select
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
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>상담 유형</InputLabel>
            <Select
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
            </Select>
          </FormControl>

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

          <FormControl fullWidth>
            <InputLabel>관련 매물</InputLabel>
            <Select
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
            </Select>
          </FormControl>

          {questions.map((question, index) => (
            <Box
              key={index}
              sx={{ display: "flex", gap: 2, alignItems: "center" }}
            >
              <TextField
                label="질문"
                value={question.question}
                onChange={(e) =>
                  handleQuestionChange(index, "question", e.target.value)
                }
                fullWidth
              />
              <TextField
                label="답변"
                value={question.answer}
                onChange={(e) =>
                  handleQuestionChange(index, "answer", e.target.value)
                }
                fullWidth
              />
              <IconButton
                onClick={() => handleRemoveQuestion(index)}
                disabled={questions.length === 1}
                sx={{ color: questions.length === 1 ? "gray" : "red" }}
              >
                <RemoveCircleOutlineIcon />
              </IconButton>
            </Box>
          ))}

          <Button
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleAddQuestion}
            sx={{ alignSelf: "flex-start" }}
          >
            문항 추가
          </Button>
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
