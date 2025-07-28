import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Switch,
  FormControlLabel,
  Alert,
} from "@mui/material";
import { AgentPropertyFilterParams } from "@ts/property";
import Button from "@components/Button";

interface PriceInputs {
  minPrice: string;
  maxPrice: string;
  minDeposit: string;
  maxDeposit: string;
  minMonthlyRent: string;
  maxMonthlyRent: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  filter: Partial<AgentPropertyFilterParams>;
  priceInputs: PriceInputs;
  error: string | null;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof AgentPropertyFilterParams
  ) => void;
  onSwitchChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof AgentPropertyFilterParams
  ) => void;
  onApply: () => void;
  onReset: () => void;
}

const PropertyFilterModalView = ({
  open,
  onClose,
  filter,
  priceInputs,
  error,
  onInputChange,
  onSwitchChange,
  onApply,
  onReset,
}: Props) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>필터</DialogTitle>
      <DialogContent dividers className="flex flex-col gap-4 mt-2">
        {/* 엘리베이터, 반려동물 */}
        <Box className="flex gap-4">
          <FormControlLabel
            control={
              <Switch
                checked={filter.hasElevator || false}
                onChange={(e) => onSwitchChange(e, "hasElevator")}
              />
            }
            label="엘리베이터 있음"
          />
          <FormControlLabel
            control={
              <Switch
                checked={filter.petsAllowed || false}
                onChange={(e) => onSwitchChange(e, "petsAllowed")}
              />
            }
            label="반려동물 가능"
          />
        </Box>

        {/* 면적 */}
        <Box className="flex gap-4">
          <TextField
            label="최소 전용 면적"
            type="number"
            inputProps={{ step: "any" }}
            value={filter.minNetArea ?? ""}
            onChange={(e) => onInputChange(e, "minNetArea")}
            fullWidth
          />
          <TextField
            label="최대 전용 면적"
            type="number"
            inputProps={{ step: "any" }}
            value={filter.maxNetArea ?? ""}
            onChange={(e) => onInputChange(e, "maxNetArea")}
            fullWidth
          />
        </Box>

        {/* 공급면적 */}
        <Box className="flex gap-4">
          <TextField
            label="최소 공급 면적"
            type="number"
            inputProps={{ step: "any" }}
            value={filter.minTotalArea ?? ""}
            onChange={(e) => onInputChange(e, "minTotalArea")}
            fullWidth
          />
          <TextField
            label="최대 공급 면적"
            type="number"
            inputProps={{ step: "any" }}
            value={filter.maxTotalArea ?? ""}
            onChange={(e) => onInputChange(e, "maxTotalArea")}
            fullWidth
          />
        </Box>

        {/* 가격 범위 */}
        <Box className="flex gap-4">
          <TextField
            label="최소 매매가"
            type="text"
            value={priceInputs.minPrice}
            onChange={(e) => onInputChange(e, "minPrice")}
            fullWidth
          />
          <TextField
            label="최대 매매가"
            type="text"
            value={priceInputs.maxPrice}
            onChange={(e) => onInputChange(e, "maxPrice")}
            fullWidth
          />
        </Box>

        {/* 보증금/월세 범위 */}
        <Box className="flex gap-4">
          <TextField
            label="최소 보증금"
            type="text"
            value={priceInputs.minDeposit}
            onChange={(e) => onInputChange(e, "minDeposit")}
            fullWidth
          />
          <TextField
            label="최대 보증금"
            type="text"
            value={priceInputs.maxDeposit}
            onChange={(e) => onInputChange(e, "maxDeposit")}
            fullWidth
          />
        </Box>

        <Box className="flex gap-4">
          <TextField
            label="최소 월세"
            type="text"
            value={priceInputs.minMonthlyRent}
            onChange={(e) => onInputChange(e, "minMonthlyRent")}
            fullWidth
          />
          <TextField
            label="최대 월세"
            type="text"
            value={priceInputs.maxMonthlyRent}
            onChange={(e) => onInputChange(e, "maxMonthlyRent")}
            fullWidth
          />
        </Box>

        {/* 층수, 주차, 건축연도 */}
        <Box className="flex gap-4">
          <TextField
            label="최소 층수"
            type="number"
            value={filter.minFloor ?? ""}
            onChange={(e) => onInputChange(e, "minFloor")}
            fullWidth
          />
          <TextField
            label="최대 층수"
            type="number"
            value={filter.maxFloor ?? ""}
            onChange={(e) => onInputChange(e, "maxFloor")}
            fullWidth
          />
        </Box>

        <Box className="flex gap-4">
          <TextField
            label="최소 주차가능수"
            type="number"
            inputProps={{ step: "any" }}
            value={filter.minParkingCapacity ?? ""}
            onChange={(e) => onInputChange(e, "minParkingCapacity")}
            fullWidth
          />
          <TextField
            label="최대 주차가능수"
            type="number"
            inputProps={{ step: "any" }}
            value={filter.maxParkingCapacity ?? ""}
            onChange={(e) => onInputChange(e, "maxParkingCapacity")}
            fullWidth
          />
        </Box>

        <Box className="flex gap-4">
          <TextField
            label="최소 건축연도"
            type="number"
            value={filter.minConstructionYear ?? ""}
            onChange={(e) => onInputChange(e, "minConstructionYear")}
            fullWidth
          />
          <TextField
            label="최대 건축연도"
            type="number"
            value={filter.maxConstructionYear ?? ""}
            onChange={(e) => onInputChange(e, "maxConstructionYear")}
            fullWidth
          />
        </Box>

        {/* 경고 메시지 표시 */}
        {error && (
          <Alert severity="error" className="mt-4">
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onReset}>초기화</Button>
        <Button onClick={onApply} variant="contained">
          적용하기
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PropertyFilterModalView;
