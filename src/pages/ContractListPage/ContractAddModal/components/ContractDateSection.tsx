import { Dayjs } from "dayjs";
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
}: Props) => {
  return (
    <div className="flex flex-col gap-4 p-5 card">
      <DatePicker
        label="계약일"
        value={contractDate}
        onChange={setContractDate}
        slotProps={{
          textField: {
            fullWidth: true,
          },
        }}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DatePicker
          label="계약 시작일"
          value={contractStartDate}
          onChange={setContractStartDate}
          slotProps={{
            textField: {
              fullWidth: true,
            },
          }}
        />
        <DatePicker
          label="계약 종료일"
          value={contractEndDate}
          onChange={setContractEndDate}
        />
      </div>
      <DatePicker
        label="예상 종료일"
        value={expectedContractEndDate}
        onChange={setExpectedContractEndDate}
        slotProps={{
          textField: {
            fullWidth: true,
          },
        }}
      />
    </div>
  );
};

export default ContractDateSection;
