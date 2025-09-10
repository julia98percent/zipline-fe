"use client";
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import Select, { MenuItem, StringSelect } from "@/components/Select";
import {
  ContractStatusEnum,
  CONTRACT_STATUS_OPTION_LIST,
} from "@/constants/contract";
import Button from "@/components/Button";

interface ContractFilterModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (filter: { period: string; status: string }) => void;
  initialFilter: { period: string; status: string };
}

const ContractStatusSelect = Select<ContractStatusEnum>;

const ContractFilterModal = ({
  open,
  onClose,
  onApply,
  initialFilter = { period: "", status: "" },
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
          <StringSelect
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            label="기간"
          >
            <MenuItem value="">전체</MenuItem>
            <MenuItem value="1개월 이내">1개월 이내</MenuItem>
            <MenuItem value="3개월 이내">3개월 이내</MenuItem>
            <MenuItem value="6개월 이내">6개월 이내</MenuItem>
          </StringSelect>

          <ContractStatusSelect
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            label="계약 상태"
          >
            <MenuItem value="">전체</MenuItem>
            <MenuItem value="">전체</MenuItem>
            {CONTRACT_STATUS_OPTION_LIST.map(({ value, label }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </ContractStatusSelect>
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
