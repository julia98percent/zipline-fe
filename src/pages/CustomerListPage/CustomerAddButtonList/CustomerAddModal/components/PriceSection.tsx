import { InputAdornment } from "@mui/material";
import TextField from "@components/TextField";

interface PriceSectionProps {
  showSalePrice: boolean;
  showRentPrice: boolean;
  minPrice: string;
  maxPrice: string;
  minRent: string;
  maxRent: string;
  minDeposit: string;
  maxDeposit: string;
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const formatNumberField = (e: React.FormEvent<HTMLInputElement>) => {
  const value = e.currentTarget.value.replace(/[^0-9]/g, "");
  e.currentTarget.value = value
    ? new Intl.NumberFormat("ko-KR").format(Number(value))
    : "";
};

export default function PriceSection({
  showSalePrice,
  showRentPrice,
  minPrice,
  maxPrice,
  minRent,
  maxRent,
  minDeposit,
  maxDeposit,
  onFieldChange,
}: PriceSectionProps) {
  return (
    <div className="flex flex-col pb-7 mb-4 border-b border-gray-200 gap-4">
      {/* 매매가 범위 - 매도인 또는 매수인 선택 시 */}
      {showSalePrice && (
        <div>
          <h6 className="mb-2 font-medium">희망 매매가 범위</h6>

          <div className="flex gap-4">
            <TextField
              name="minPrice"
              value={minPrice}
              onChange={onFieldChange}
              placeholder="최소 금액"
              size="small"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">원</InputAdornment>
                ),
              }}
              inputProps={{
                type: "text",
                pattern: "[0-9]*",
                inputMode: "numeric",
                onChange: formatNumberField,
              }}
            />
            <TextField
              name="maxPrice"
              value={maxPrice}
              onChange={onFieldChange}
              placeholder="최대 금액"
              size="small"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">원</InputAdornment>
                ),
              }}
              inputProps={{
                type: "text",
                pattern: "[0-9]*",
                inputMode: "numeric",
                onChange: formatNumberField,
              }}
            />
          </div>
        </div>
      )}

      {/* 월세 및 보증금 범위 - 임차인 또는 임대인 선택 시 */}
      {showRentPrice && (
        <>
          <div>
            <h6 className="mb-2 font-medium">희망 월세 범위</h6>
            <div className="flex gap-4">
              <TextField
                name="minRent"
                value={minRent}
                onChange={onFieldChange}
                placeholder="최소 금액"
                size="small"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">원</InputAdornment>
                  ),
                }}
                inputProps={{
                  type: "text",
                  pattern: "[0-9]*",
                  inputMode: "numeric",
                  onChange: formatNumberField,
                }}
              />
              <TextField
                name="maxRent"
                value={maxRent}
                onChange={onFieldChange}
                placeholder="최대 금액"
                size="small"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">원</InputAdornment>
                  ),
                }}
                inputProps={{
                  type: "text",
                  pattern: "[0-9]*",
                  inputMode: "numeric",
                  onChange: formatNumberField,
                }}
              />
            </div>
          </div>

          <div>
            <h6 className="mb-2 font-medium">희망 보증금 범위</h6>
            <div className="flex gap-4">
              <TextField
                name="minDeposit"
                value={minDeposit}
                onChange={onFieldChange}
                placeholder="최소 금액"
                size="small"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">원</InputAdornment>
                  ),
                }}
                inputProps={{
                  type: "text",
                  pattern: "[0-9]*",
                  inputMode: "numeric",
                  onChange: formatNumberField,
                }}
              />
              <TextField
                name="maxDeposit"
                value={maxDeposit}
                onChange={onFieldChange}
                placeholder="최대 금액"
                size="small"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">원</InputAdornment>
                  ),
                }}
                inputProps={{
                  type: "text",
                  pattern: "[0-9]*",
                  inputMode: "numeric",
                  onChange: formatNumberField,
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
