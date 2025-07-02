import { Box } from "@mui/material";
import { Dayjs } from "dayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FormErrors } from "@ts/contract";

interface Props {
  contractDate: Dayjs | null;
  setContractDate: (date: Dayjs | null) => void;
  contractStartDate: Dayjs | null;
  setContractStartDate: (date: Dayjs | null) => void;
  contractEndDate: Dayjs | null;
  setContractEndDate: (date: Dayjs | null) => void;
  expectedContractEndDate: Dayjs | null;
  setExpectedContractEndDate: (date: Dayjs | null) => void;
  errors: FormErrors;
}

const ContractDateSection = ({
  contractDate,
  setContractDate,
  contractStartDate,
  setContractStartDate,
  contractEndDate,
  setContractEndDate,
  expectedContractEndDate,
  setExpectedContractEndDate,
  errors,
}: Props) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
        label="계약일"
        value={contractDate}
        onChange={setContractDate}
        format="YYYY. MM. DD"
        slotProps={{
          textField: {
            fullWidth: true,
            error: !!errors.contractDate,
            helperText: errors.contractDate,
          },
        }}
      />
      <Box sx={{ display: "flex", gap: 2, my: 2 }}>
        <DesktopDatePicker
          label="시작일"
          value={contractStartDate}
          onChange={setContractStartDate}
          format="YYYY. MM. DD"
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!errors.contractStartDate,
              helperText: errors.contractStartDate,
            },
          }}
        />
        <DesktopDatePicker
          label="종료일"
          value={contractEndDate}
          onChange={setContractEndDate}
          format="YYYY. MM. DD"
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!errors.contractEndDate,
              helperText: errors.contractEndDate,
            },
          }}
        />
      </Box>
      <DesktopDatePicker
        label="예상 종료일"
        value={expectedContractEndDate}
        onChange={setExpectedContractEndDate}
        format="YYYY. MM. DD"
        slotProps={{
          textField: {
            fullWidth: true,
            error: !!errors.expectedContractEndDate,
            helperText: errors.expectedContractEndDate,
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default ContractDateSection;
