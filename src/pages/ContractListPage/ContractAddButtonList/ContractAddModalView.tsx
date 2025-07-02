import { Modal, Box, Typography } from "@mui/material";
import { Dayjs } from "dayjs";
import { AgentPropertyResponse, CustomerResponse } from "@apis/contractService";
import {
  ContractBasicInfoSection,
  ContractDateSection,
  ContractCustomerSection,
  ContractPriceSection,
  ContractFileUploadSection,
  ContractActionButtons,
} from "./components";
import { ContractStatus, FormErrors } from "@ts/contract";

interface Props {
  open: boolean;
  handleModalClose: () => void;
  category: string | null;
  setCategory: (category: string | null) => void;
  contractDate: Dayjs | null;
  setContractDate: (date: Dayjs | null) => void;
  contractStartDate: Dayjs | null;
  setContractStartDate: (date: Dayjs | null) => void;
  contractEndDate: Dayjs | null;
  setContractEndDate: (date: Dayjs | null) => void;
  expectedContractEndDate: Dayjs | null;
  setExpectedContractEndDate: (date: Dayjs | null) => void;
  deposit: string;
  setDeposit: (deposit: string) => void;
  monthlyRent: string;
  setMonthlyRent: (monthlyRent: string) => void;
  price: string;
  setPrice: (price: string) => void;
  lessorUids: number[];
  setLessorUids: (uids: number[]) => void;
  lesseeUids: number[];
  setLesseeUids: (uids: number[]) => void;
  propertyUid: number | null;
  setPropertyUid: (uid: number | null) => void;
  status: ContractStatus;
  setStatus: (status: ContractStatus) => void;
  customerOptions: CustomerResponse[];
  propertyOptions: AgentPropertyResponse[];
  files: File[];
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: FormErrors;
  handleSubmit: () => void;
}

const ContractAddModalView = ({
  open,
  handleModalClose,
  category,
  setCategory,
  contractDate,
  setContractDate,
  contractStartDate,
  setContractStartDate,
  contractEndDate,
  setContractEndDate,
  expectedContractEndDate,
  setExpectedContractEndDate,
  deposit,
  setDeposit,
  monthlyRent,
  setMonthlyRent,
  price,
  setPrice,
  lessorUids,
  setLessorUids,
  lesseeUids,
  setLesseeUids,
  propertyUid,
  setPropertyUid,
  status,
  setStatus,
  customerOptions,
  propertyOptions,
  files,
  handleFileChange,
  errors,
  handleSubmit,
}: Props) => {
  return (
    <Modal open={open} onClose={handleModalClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "40vw",
          bgcolor: "white",
          p: 4,
          borderRadius: 2,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          계약 등록
        </Typography>

        <ContractBasicInfoSection
          category={category}
          setCategory={setCategory}
          status={status}
          setStatus={setStatus}
          propertyUid={propertyUid}
          setPropertyUid={setPropertyUid}
          propertyOptions={propertyOptions}
          errors={errors}
        />

        <ContractDateSection
          contractDate={contractDate}
          setContractDate={setContractDate}
          contractStartDate={contractStartDate}
          setContractStartDate={setContractStartDate}
          contractEndDate={contractEndDate}
          setContractEndDate={setContractEndDate}
          expectedContractEndDate={expectedContractEndDate}
          setExpectedContractEndDate={setExpectedContractEndDate}
          errors={errors}
        />

        <ContractCustomerSection
          lessorUids={lessorUids}
          setLessorUids={setLessorUids}
          lesseeUids={lesseeUids}
          setLesseeUids={setLesseeUids}
          customerOptions={customerOptions}
          errors={errors}
        />

        <ContractPriceSection
          deposit={deposit}
          setDeposit={setDeposit}
          monthlyRent={monthlyRent}
          setMonthlyRent={setMonthlyRent}
          price={price}
          setPrice={setPrice}
          errors={errors}
        />

        <ContractFileUploadSection
          files={files}
          handleFileChange={handleFileChange}
        />

        <ContractActionButtons handleSubmit={handleSubmit} />
      </Box>
    </Modal>
  );
};

export default ContractAddModalView;
