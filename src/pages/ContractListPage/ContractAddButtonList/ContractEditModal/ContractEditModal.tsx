import { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  MenuItem,
  TextField,
  Button as MuiButton,
} from "@mui/material";
import { Dayjs } from "dayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import apiClient from "@apis/apiClient";
import Button from "@components/Button";
import dayjs from "dayjs";

const CONTRACT_STATUSES = [
  "LISTED",
  "NEGOTIATING",
  "INTENT_SIGNED",
  "CANCELLED",
  "CONTRACTED",
  "IN_PROGRESS",
  "PAID_COMPLETE",
  "REGISTERED",
  "MOVED_IN",
  "TERMINATED",
] as const;

type ContractStatus = (typeof CONTRACT_STATUSES)[number];

interface ContractEditModalProps {
  open: boolean;
  handleClose: () => void;
  fetchContractData: () => void;
  contractUid: number;
  initialData: any;
}


const ContractEditModal = ({
  open, handleClose, fetchContractData, contractUid, initialData,
}: ContractEditModalProps) => {
  const [category, setCategory] = useState("");
  const [contractDate, setContractDate] = useState<Dayjs | null>(null);
  const [contractStartDate, setContractStartDate] = useState<Dayjs | null>(null);
  const [contractEndDate, setContractEndDate] = useState<Dayjs | null>(null);
  const [expectedContractEndDate, setExpectedContractEndDate] = useState<Dayjs | null>(null);
  const [deposit, setDeposit] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [price, setPrice] = useState("");
  const [lessorUid, setLessorUid] = useState<number | null>(null);
  const [lesseeUid, setLesseeUid] = useState<number | null>(null);
  const [propertyUid, setPropertyUid] = useState<number | null>(null);
  const [status, setStatus] = useState<ContractStatus>("IN_PROGRESS");
  const [files, setFiles] = useState<File[]>([]);
  const [customerOptions, setCustomerOptions] = useState<{ uid: number; name: string }[]>([]);
  const [propertyOptions, setPropertyOptions] = useState<{ uid: number; address: string }[]>([]);



  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [customerRes, propertyRes] = await Promise.all([
          apiClient.get("/customers"),
          apiClient.get("/properties"), 
        ]);
  
        const customers = customerRes.data.data.customers;
        const properties = propertyRes.data.data.agentProperty;
  
        setCustomerOptions(customers);
        setPropertyOptions(properties);
      } catch (err) {
        console.error("옵션 로딩 실패", err);
      }
    };
  
    fetchOptions();
  }, []);
  
  useEffect(() => {
    if (
      initialData &&
      customerOptions.length > 0 &&
      propertyOptions.length > 0
    ) {
      setCategory(initialData.category ?? "");
      setContractDate(initialData.contractDate ? dayjs(initialData.contractDate) : null);
      setContractStartDate(initialData.contractStartDate ? dayjs(initialData.contractStartDate) : null);
      setContractEndDate(initialData.contractEndDate ? dayjs(initialData.contractEndDate) : null);
      setExpectedContractEndDate(initialData.expectedContractEndDate ? dayjs(initialData.expectedContractEndDate) : null);
      setDeposit(initialData.deposit?.toString() ?? "");
      setMonthlyRent(initialData.monthlyRent?.toString() ?? "");
      setPrice(initialData.price?.toString() ?? "");
      setLessorUid(initialData.lessorOrSellerUid ?? null);
      setLesseeUid(initialData.lesseeOrBuyerUid ?? null);
      setPropertyUid(initialData.propertyUid ?? null);
      setStatus(initialData.status ?? "IN_PROGRESS");
    }
  }, [initialData, customerOptions, propertyOptions]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const handleSubmit = () => {
    if (!category || !status || !lessorUid || !propertyUid) {
      alert("필수 항목을 모두 입력해 주세요.");
      return;
    }

    const requestPayload = {
      category,
      contractDate: contractDate?.format("YYYY-MM-DD") ?? null,
      contractStartDate: contractStartDate?.format("YYYY-MM-DD") ?? null,
      contractEndDate: contractEndDate?.format("YYYY-MM-DD") ?? null,
      expectedContractEndDate: expectedContractEndDate?.format("YYYY-MM-DD") ?? null,
      deposit: deposit ? parseInt(deposit, 10) : 0,
      monthlyRent: monthlyRent ? parseInt(monthlyRent, 10) : 0,
      price: price ? parseInt(price, 10) : 0,
      lessorOrSellerUid: lessorUid,
      lesseeOrBuyerUid: lesseeUid,
      propertyUid,
      status,
    };

    const formData = new FormData();
    formData.append("contractRequestDTO", new Blob([JSON.stringify(requestPayload)], { type: "application/json" }));
    files.forEach((file) => formData.append("files", file));

    apiClient.patch(`/contracts/${contractUid}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(() => {
        alert("계약 수정 성공");
        fetchContractData();
        handleClose();
      })
      .catch((err) => {
        const message = err.response?.data?.message || "계약 수정 중 오류가 발생했습니다.";
        alert(message);
      });
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box    
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "40vw",
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "white",
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>계약 수정</Typography>
        <TextField select label="계약 카테고리" value={category} onChange={(e) => setCategory(e.target.value)} fullWidth sx={{ mb: 2 }}>
                  <MenuItem value="SALE">매매</MenuItem>
                  <MenuItem value="DEPOSIT">전세</MenuItem>
                  <MenuItem value="MONTHLY">월세</MenuItem>
                </TextField>
        
                <TextField
          select
          label="계약 상태"
          value={status}
          onChange={(e) => setStatus(e.target.value as ContractStatus)}
          fullWidth
          sx={{ mb: 2 }}
        >
          {CONTRACT_STATUSES.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
        <TextField
  select
  label="임대/매도자 선택"
  value={lessorUid?.toString() ?? ""}
  onChange={(e) => setLessorUid(Number(e.target.value))}
  fullWidth
  sx={{ mb: 2 }}
>
  {customerOptions.map((c) => (
    <MenuItem key={c.uid} value={c.uid.toString()}>
      {c.name}
    </MenuItem>
  ))}
</TextField>
        
                <TextField select label="임차/매수자 선택" value={lesseeUid ?? ""} onChange={(e) => setLesseeUid(Number(e.target.value))} fullWidth sx={{ mb: 2 }}>
                  {customerOptions.map((c) => (
                    <MenuItem key={c.uid} value={c.uid}>{c.name}</MenuItem>
                  ))}
                </TextField>
        
                <TextField
          select
          label="매물 선택"
          value={propertyUid ?? ""}
          onChange={(e) => setPropertyUid(Number(e.target.value))}
          fullWidth
          sx={{ mb: 2 }}
        >
          {propertyOptions.length > 0 ? (
            propertyOptions.map((p) => (
              <MenuItem key={p.uid} value={p.uid}>
                {p.address}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled value="">
              등록된 매물이 없습니다
            </MenuItem>
          )}
        </TextField>
        
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker label="계약일" value={contractDate} onChange={setContractDate} format="YYYY. MM. DD" slotProps={{ textField: { fullWidth: true } }} />
                  <Box sx={{ display: "flex", gap: 2, my: 2 }}>
                    <DesktopDatePicker label="시작일" value={contractStartDate} onChange={setContractStartDate} format="YYYY. MM. DD" slotProps={{ textField: { fullWidth: true } }} />
                    <DesktopDatePicker label="종료일" value={contractEndDate} onChange={setContractEndDate} format="YYYY. MM. DD" slotProps={{ textField: { fullWidth: true } }} />
                  </Box>
                  <DesktopDatePicker label="예상 종료일" value={expectedContractEndDate} onChange={setExpectedContractEndDate} format="YYYY. MM. DD" slotProps={{ textField: { fullWidth: true } }} />
                </LocalizationProvider>
        
                <TextField label="보증금 (숫자)" value={deposit} onChange={(e) => setDeposit(e.target.value)} type="number" fullWidth sx={{ mt: 2 }} />
                <TextField label="월세 (숫자)" value={monthlyRent} onChange={(e) => setMonthlyRent(e.target.value)} type="number" fullWidth sx={{ mt: 2 }} />
                <TextField label="매매가 (숫자)" value={price} onChange={(e) => setPrice(e.target.value)} type="number" fullWidth sx={{ mt: 2 }} />
        
                <MuiButton variant="outlined" component="label" sx={{ my: 2 }} fullWidth>
                  파일 업로드
                  <input type="file" hidden multiple onChange={handleFileChange} />
                </MuiButton>
        
                {files.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">업로드된 파일:</Typography>
                    <ul>
                      {files.map((file, idx) => (
                        <li key={idx}>{file.name}</li>
                      ))}
                    </ul>
                  </Box>
                )}

        <Button
          text="수정"
          onClick={handleSubmit}
          sx={{
            mt: 2,
            color: "white !important",
            backgroundColor: "#164F9E",
            "&:disabled": {
              backgroundColor: "lightgray",
              color: "white",
            },
          }}
        />
      </Box>
    </Modal>
  );
};

export default ContractEditModal;
