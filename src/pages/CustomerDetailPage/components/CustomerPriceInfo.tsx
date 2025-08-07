import { Paper, Typography, TextField, InputAdornment } from "@mui/material";
import { formatKoreanPrice } from "@utils/numberUtil";
import { Customer } from "@ts/customer";
import { MAX_PROPERTY_PRICE } from "@constants/property";

interface CustomerPriceInfoProps {
  customer: Customer;
  isEditing: boolean;
  editedCustomer: Customer | null;
  onInputChange: (
    field: keyof Customer,
    value: string | number | boolean | null | { uid: number; name: string }[]
  ) => void;
}

const CustomerPriceInfo = ({
  customer,
  isEditing,
  editedCustomer,
  onInputChange,
}: CustomerPriceInfoProps) => {
  const renderPriceField = (
    label: string,
    field: keyof Customer,
    value: number | null | undefined,
    editedValue: number | null
  ) => (
    <div className="flex-[0_0_calc(50%-8px)]">
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      {isEditing ? (
        <TextField
          fullWidth
          size="small"
          value={editedValue || ""}
          onChange={(e) => {
            const rawValue = e.target.value.replace(/[^0-9]/g, "");
            const numValue = rawValue ? Number(rawValue) : null;

            if (numValue && numValue > MAX_PROPERTY_PRICE) return;

            onInputChange(field, numValue);
          }}
          placeholder="숫자만 입력하세요"
          helperText={formatKoreanPrice(editedValue)}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">만원</InputAdornment>
              ),
            },
          }}
        />
      ) : (
        <p className="font-medium">{formatKoreanPrice(value)}</p>
      )}
    </div>
  );

  return (
    <Paper elevation={0} className="p-6 rounded-lg mb-6 shadow-none bg-white">
      <Typography variant="h6" className="mb-4 text-primary font-bold">
        희망 거래 가격
      </Typography>
      <div className="flex flex-wrap gap-4">
        {renderPriceField(
          "최소 매매가",
          "minPrice",
          customer.minPrice,
          editedCustomer?.minPrice ?? null
        )}
        {renderPriceField(
          "최대 매매가",
          "maxPrice",
          customer.maxPrice,
          editedCustomer?.maxPrice ?? null
        )}
        {renderPriceField(
          "최소 보증금",
          "minDeposit",
          customer.minDeposit,
          editedCustomer?.minDeposit ?? null
        )}
        {renderPriceField(
          "최대 보증금",
          "maxDeposit",
          customer.maxDeposit,
          editedCustomer?.maxDeposit ?? null
        )}
        {renderPriceField(
          "최소 임대료",
          "minRent",
          customer.minRent,
          editedCustomer?.minRent ?? null
        )}
        {renderPriceField(
          "최대 임대료",
          "maxRent",
          customer.maxRent,
          editedCustomer?.maxRent ?? null
        )}
      </div>
    </Paper>
  );
};

export default CustomerPriceInfo;
