import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from "@mui/material";
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
import { ContractStatus } from "@ts/contract";
import { NumericInputResponse } from "@hooks/useNumericInput";

interface Props {
  open: boolean;
  handleModalClose: () => void;
  category: string | null;
  handleCategoryChange: (category: string | null) => void;
  contractDate: Dayjs | null;
  setContractDate: (date: Dayjs | null) => void;
  contractStartDate: Dayjs | null;
  setContractStartDate: (date: Dayjs | null) => void;
  contractEndDate: Dayjs | null;
  setContractEndDate: (date: Dayjs | null) => void;
  expectedContractEndDate: Dayjs | null;
  setExpectedContractEndDate: (date: Dayjs | null) => void;
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
  handleFileRemove: (index: number) => void;
  handleSubmit: () => void;
  validationErrors: string[];
  isSubmitButtonDisabled: boolean;
  errorMessage: string;
  priceInput: NumericInputResponse;
  monthlyRentInput: NumericInputResponse;
  depositInput: NumericInputResponse;
}

const ContractAddModalView = ({
  open,
  handleModalClose,
  category,
  handleCategoryChange,
  contractDate,
  setContractDate,
  contractStartDate,
  setContractStartDate,
  contractEndDate,
  setContractEndDate,
  expectedContractEndDate,
  setExpectedContractEndDate,
  depositInput,
  monthlyRentInput,
  priceInput,
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
  handleFileRemove,
  handleSubmit,
  validationErrors,
  isSubmitButtonDisabled,
  errorMessage,
}: Props) => {
  return (
    <Dialog
      open={open}
      onClose={handleModalClose}
      maxWidth={false}
      PaperProps={{
        className: "w-[90vw] sm:w-[70vw] max-h-[90vh] rounded-lg",
      }}
    >
      <DialogTitle className="border-b text-primary font-bold border-gray-200">
        계약 등록
      </DialogTitle>

      <DialogContent className="bg-neutral-100 flex flex-col gap-3 p-3">
        <ContractBasicInfoSection
          category={category}
          handleCategoryChange={handleCategoryChange}
          status={status}
          setStatus={setStatus}
          propertyUid={propertyUid}
          setPropertyUid={setPropertyUid}
          propertyOptions={propertyOptions}
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
        />

        <ContractCustomerSection
          lessorUids={lessorUids}
          setLessorUids={setLessorUids}
          lesseeUids={lesseeUids}
          setLesseeUids={setLesseeUids}
          customerOptions={customerOptions}
        />

        <ContractPriceSection
          category={category}
          priceInput={priceInput}
          monthlyRentInput={monthlyRentInput}
          depositInput={depositInput}
        />

        <ContractFileUploadSection
          files={files}
          handleFileChange={handleFileChange}
          onFileRemove={handleFileRemove}
        />
      </DialogContent>

      <DialogActions className="flex flex-col xs:flex-row items-start xs:items-center justify-between p-6 border-t border-gray-200">
        {errorMessage && (
          <p className="absolute left-6 text-red-600 text-sm">{errorMessage}</p>
        )}
        {isSubmitButtonDisabled && validationErrors.length > 0 && (
          <Tooltip
            title={
              <div>
                {validationErrors.map((error, index) => (
                  <div key={index}>• {error}</div>
                ))}
              </div>
            }
            arrow
            placement="top"
          >
            <div className="text-sm text-red-600 cursor-help">
              <ul className="list-disc list-inside">
                {validationErrors.slice(0, 1).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
                {validationErrors.length > 1 && (
                  <li>외 {validationErrors.length - 1}개 항목</li>
                )}
              </ul>
            </div>
          </Tooltip>
        )}
        <ContractActionButtons
          handleSubmit={handleSubmit}
          isSubmitButtonDisabled={isSubmitButtonDisabled}
          handleModalClose={handleModalClose}
        />
      </DialogActions>
    </Dialog>
  );
};

export default ContractAddModalView;
