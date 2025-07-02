import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import { AgentPropertySearchParams } from "@apis/propertyService";

interface AgentPropertyFilterModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: Partial<AgentPropertySearchParams>) => void;
  filters: AgentPropertySearchParams;
  regions: unknown[];
  selectedSido: string;
  selectedGu: string;
  selectedDong: string;
  onSidoChange: (event: SelectChangeEvent<string>) => void;
  onGuChange: (event: SelectChangeEvent<string>) => void;
  onDongChange: (event: SelectChangeEvent<string>) => void;
}

const AgentPropertyFilterModal = ({
  open,
  onClose,
  onApply,
}: AgentPropertyFilterModalProps) => {
  const [customerName, setCustomerName] = useState("");

  const handleApply = () => {
    const cleanedFilters: Partial<AgentPropertySearchParams> = {};

    if (customerName) {
      cleanedFilters.customerName = customerName;
    }

    onApply(cleanedFilters);
  };

  const handleReset = () => {
    setCustomerName("");
    onApply({});
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>상세 필터</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ minHeight: "200px", pt: 2 }}>
          <Typography variant="h6" gutterBottom>
            기본 정보
          </Typography>

          <TextField
            fullWidth
            label="고객명"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* TODO: 추후 더 많은 필터 옵션 추가 */}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReset} color="secondary">
          초기화
        </Button>
        <Button onClick={onClose}>취소</Button>
        <Button onClick={handleApply} variant="contained">
          적용
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AgentPropertyFilterModal;
