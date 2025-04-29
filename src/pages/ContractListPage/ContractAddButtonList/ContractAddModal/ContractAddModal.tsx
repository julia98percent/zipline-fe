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
interface Props {
  open: boolean;
  handleClose: () => void;
  fetchContractData: () => void;
}

const ContractAddModal = ({ open, handleClose, fetchContractData }: Props) => {
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

  const [customerOptions, setCustomerOptions] = useState<{ uid: number; name: string }[]>([]);
  const [propertyOptions, setPropertyOptions] = useState<{ uid: number; address: string }[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    apiClient.get("/customers").then((res) => {
      setCustomerOptions(res.data.data.customers);
    });
    apiClient.get("/properties").then((res) => {
      setPropertyOptions(res.data.data.agentProperty);
    }).catch((err) => {
      console.error("매물 목록 불러오기 실패", err);
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };
  const [errors, setErrors] = useState<{
    propertyUid?: string;
    lessorOrSellerUid?: string;
    status?: string;
  }>({});

  const handleSubmit = () => {
     if (!propertyUid) {
    alert("매물을 선택해 주세요.");
    return;
  }
  if (!lessorUid) {
    alert("임대/매도 고객을 선택해 주세요.");
    return;
  }
  if (!status) {
    alert("계약 상태를 선택해 주세요.");
    return;
  }

  const requestPayload = {
    category,
    contractDate: contractDate ? contractDate.format("YYYY-MM-DD") : null,
    contractStartDate: contractStartDate ? contractStartDate.format("YYYY-MM-DD") : null,
    contractEndDate: contractEndDate ? contractEndDate.format("YYYY-MM-DD") : null,
    expectedContractEndDate: expectedContractEndDate ? expectedContractEndDate.format("YYYY-MM-DD") : null,
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

    apiClient
      .post("/contracts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        alert("계약 등록 성공");
        fetchContractData();
        handleModalClose();
      })
      .catch((err) => {
        console.error("계약 등록 실패", err);
      });
  };

  const handleModalClose = () => {
    setCategory("");
    setContractDate(null);
    setContractStartDate(null);
    setContractEndDate(null);
    setExpectedContractEndDate(null);
    setDeposit("");
    setMonthlyRent("");
    setPrice("");
    setLessorUid(null);
    setLesseeUid(null);
    setPropertyUid(null);
    setStatus("IN_PROGRESS");
    setFiles([]);
    handleClose();
  };

  const isDisabled = !category || !contractDate || !contractStartDate || !contractEndDate || !expectedContractEndDate || !lessorUid || !lesseeUid || !propertyUid;

  return (
    <Modal open={open} onClose={handleModalClose}>
      <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "40vw", bgcolor: "white", p: 4, borderRadius: 2,  maxHeight: "90vh", 
    overflowY: "auto" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>계약 등록</Typography>

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

        <TextField select label="임대/매도자 선택" value={lessorUid ?? ""} onChange={(e) => setLessorUid(Number(e.target.value))} fullWidth sx={{ mb: 2 }}>
          {customerOptions.map((c) => (
            <MenuItem key={c.uid} value={c.uid}>{c.name}</MenuItem>
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
          text="등록"
          disabled={false}
          onClick={handleSubmit}
          sx={{
            mt: 2,
            color: "white !important",
            backgroundColor: "#164F9E",
            "&:disabled": { backgroundColor: "lightgray", color: "white" },
          }}
        />
      </Box>
    </Modal>
  );
};

export default ContractAddModal;
