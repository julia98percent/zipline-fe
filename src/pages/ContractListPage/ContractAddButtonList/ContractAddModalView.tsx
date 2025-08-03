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
  deposit: string;
  setDeposit: (e: React.ChangeEvent<HTMLInputElement>) => void;
  monthlyRent: string;
  setMonthlyRent: (e: React.ChangeEvent<HTMLInputElement>) => void;
  price: string;
  setPrice: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  handleSubmit: () => void;
  validationErrors: string[];
  isSubmitButtonDisabled: boolean;
  errorMessage: string;
  handleDepositBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  handleMonthlyRentBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  handlePriceBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  depositError: string | null;
  monthlyError: string | null;
  priceError: string | null;
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
  handleSubmit,
  validationErrors,
  isSubmitButtonDisabled,
  errorMessage,
  handleDepositBlur,
  handleMonthlyRentBlur,
  handlePriceBlur,
  depositError,
  monthlyError,
  priceError,
}: Props) => {
  return (
    <Dialog
      open={open}
      onClose={handleModalClose}
      PaperProps={{
        className: "w-200 h-175 max-h-[90vh] bg-white rounded-lg",
      }}
    >
      <DialogTitle className="border-b text-primary font-bold border-gray-200">
        계약 등록
      </DialogTitle>

      <DialogContent className="flex flex-col gap-4 p-7">
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
          deposit={deposit}
          setDeposit={setDeposit}
          monthlyRent={monthlyRent}
          setMonthlyRent={setMonthlyRent}
          price={price}
          setPrice={setPrice}
          handleDepositBlur={handleDepositBlur}
          handleMonthlyRentBlur={handleMonthlyRentBlur}
          handlePriceBlur={handlePriceBlur}
          category={category}
          depositError={depositError}
          monthlyError={monthlyError}
          priceError={priceError}
        />

        <ContractFileUploadSection
          files={files}
          handleFileChange={handleFileChange}
        />
      </DialogContent>

      <DialogActions className="flex flex-row-reverse items-center justify-between p-6 border-t border-gray-200">
        {errorMessage && (
          <p className="absolute left-6 text-red-600 text-sm">{errorMessage}</p>
        )}
        <ContractActionButtons
          handleSubmit={handleSubmit}
          isSubmitButtonDisabled={isSubmitButtonDisabled}
          handleModalClose={handleModalClose}
        />
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
      </DialogActions>
    </Dialog>
  );
};

export default ContractAddModalView;
