import { Box } from "@mui/material";
import { Dayjs } from "dayjs";
import { FormErrors } from "@ts/contract";
import DatePicker from "@components/DatePicker";

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
    <>
      <DatePicker
        label="계약일"
        value={contractDate}
        onChange={setContractDate}
        slotProps={{
          textField: {
            fullWidth: true,
            error: !!errors.contractDate,
            helperText: errors.contractDate,
          },
        }}
      />
      <Box className="flex gap-2 my-4">
        <DatePicker
          label="시작일"
          value={contractStartDate}
          onChange={setContractStartDate}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!errors.contractStartDate,
              helperText: errors.contractStartDate,
            },
          }}
        />
        <DatePicker
          label="종료일"
          value={contractEndDate}
          onChange={setContractEndDate}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!errors.contractEndDate,
              helperText: errors.contractEndDate,
            },
          }}
        />
      </Box>
      <DatePicker
        label="예상 종료일"
        value={expectedContractEndDate}
        onChange={setExpectedContractEndDate}
        slotProps={{
          textField: {
            fullWidth: true,
            error: !!errors.expectedContractEndDate,
            helperText: errors.expectedContractEndDate,
          },
        }}
      />
    </>
  );
};

export default ContractDateSection;
