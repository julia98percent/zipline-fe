import { Box, Paper, Typography, TextField } from "@mui/material";
import { formatPriceWithKorean } from "@utils/numberUtil";
import { Customer } from "@ts/customer";

interface CustomerPriceInfoProps {
  customer: Customer;
  isEditing: boolean;
  editedCustomer: Customer | null;
  onInputChange: (
    field: keyof Customer,
    value: string | number | boolean | null | { uid: number; name: string }[]
  ) => void;
}

export const MAX_PRICE_LENGTH = 15; // 천조 단위까지 허용 (999조)

const CustomerPriceInfo = ({
  customer,
  isEditing,
  editedCustomer,
  onInputChange,
}: CustomerPriceInfoProps) => {
  const formatSafePrice = (price: number | null | undefined): string => {
    if (price === undefined || price === null) return "-";
    const priceStr = price.toString();
    if (priceStr.length > MAX_PRICE_LENGTH) {
      return "금액이 너무 큽니다";
    }
    return formatPriceWithKorean(price) || "-";
  };

  const renderPriceField = (
    label: string,
    field: keyof Customer,
    value: number | null | undefined,
    editedValue: number | null | undefined
  ) => (
    <Box sx={{ flex: "0 0 calc(50% - 8px)" }}>
      <Typography variant="subtitle2" color="textSecondary">
        {label}
      </Typography>
      {isEditing ? (
        <>
          <TextField
            fullWidth
            size="small"
            value={editedValue || ""}
            onChange={(e) => {
              const inputValue = e.target.value.replace(/[^0-9]/g, "");
              if (inputValue.length <= MAX_PRICE_LENGTH) {
                onInputChange(field, inputValue ? Number(inputValue) : null);
              }
            }}
            placeholder="숫자만 입력"
            inputProps={{ maxLength: MAX_PRICE_LENGTH }}
          />
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", mt: 0.5, display: "block" }}
          >
            {formatSafePrice(editedValue)}
          </Typography>
        </>
      ) : (
        <Typography variant="body1">{formatSafePrice(value)}</Typography>
      )}
    </Box>
  );

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, color: "#164F9E", fontWeight: "bold" }}
      >
        희망 거래 가격
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {renderPriceField(
          "최소 매매가",
          "minPrice",
          customer.minPrice,
          editedCustomer?.minPrice
        )}
        {renderPriceField(
          "최대 매매가",
          "maxPrice",
          customer.maxPrice,
          editedCustomer?.maxPrice
        )}
        {renderPriceField(
          "최소 보증금",
          "minDeposit",
          customer.minDeposit,
          editedCustomer?.minDeposit
        )}
        {renderPriceField(
          "최대 보증금",
          "maxDeposit",
          customer.maxDeposit,
          editedCustomer?.maxDeposit
        )}
        {renderPriceField(
          "최소 임대료",
          "minRent",
          customer.minRent,
          editedCustomer?.minRent
        )}
        {renderPriceField(
          "최대 임대료",
          "maxRent",
          customer.maxRent,
          editedCustomer?.maxRent
        )}
      </Box>
    </Paper>
  );
};

export default CustomerPriceInfo;
