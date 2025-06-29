import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

interface ContractFilterModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (filter: { period: string; status: string }) => void;
  initialFilter: { period: string; status: string };
}

const ContractFilterModal = ({
  open,
  onClose,
  onApply,
  initialFilter = { period: "", status: "" }, // ✅ 기본값 부여
}: ContractFilterModalProps) => {
  const [period, setPeriod] = useState(initialFilter.period);
  const [status, setStatus] = useState(initialFilter.status);

  const handleApply = () => {
    if (onApply) {
      onApply({ period, status }); // ✅ 옵셔널 체이닝 처리
    }
    onClose();
  };

  const handleReset = () => {
    setPeriod("");
    setStatus("");
    if (onApply) {
      onApply({ period: "", status: "" }); // ✅ 옵셔널 체이닝 처리
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>계약 필터</DialogTitle>
      <DialogContent>
        <Box display="flex" gap={2} flexDirection="column" mt={2}>
          {/* 기간 필터 */}
          <FormControl fullWidth>
            <InputLabel>기간</InputLabel>
            <Select value={period} onChange={(e) => setPeriod(e.target.value)} label="기간">
              <MenuItem value="">전체</MenuItem>
              <MenuItem value="1개월 이내">1개월 이내</MenuItem>
              <MenuItem value="3개월 이내">3개월 이내</MenuItem>
              <MenuItem value="6개월 이내">6개월 이내</MenuItem>
            </Select>
          </FormControl>

          {/* 상태 필터 */}
          <FormControl fullWidth>
            <InputLabel>계약 상태</InputLabel>
            <Select value={status} onChange={(e) => setStatus(e.target.value)} label="계약 상태">
              <MenuItem value="">전체</MenuItem>
              <MenuItem value="LISTED">매물 등록됨</MenuItem>
              <MenuItem value="NEGOTIATING">협상 중</MenuItem>
              <MenuItem value="INTENT_SIGNED">가계약</MenuItem>
              <MenuItem value="CANCELLED">계약 취소</MenuItem>
              <MenuItem value="CONTRACTED">계약 체결</MenuItem>
              <MenuItem value="IN_PROGRESS">계약 진행 중</MenuItem>
              <MenuItem value="PAID_COMPLETE">잔금 지급 완료</MenuItem>
              <MenuItem value="REGISTERED">등기 완료</MenuItem>
              <MenuItem value="MOVED_IN">입주 완료</MenuItem>
              <MenuItem value="TERMINATED">계약 해지</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleReset}>초기화</Button>
        <Button onClick={handleApply} variant="contained" color="primary">
          적용
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContractFilterModal;
