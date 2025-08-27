import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  SelectChangeEvent,
  Tooltip,
} from "@mui/material";
import Button from "@components/Button";
import { Label } from "@ts/customer";
import { CustomerBaseFormData } from "@ts/customer";
import { RegionState } from "@ts/region";
import {
  BasicInfoSection,
  LabelSection,
  PriceSection,
  AdditionalInfoSection,
  RoleSection,
} from "./components";
import { NumericInputResponse } from "@hooks/useNumericInput";

interface CustomerAddModalViewProps {
  open: boolean;
  formData: CustomerBaseFormData;
  minPriceInput: NumericInputResponse;
  minRentInput: NumericInputResponse;
  minDepositInput: NumericInputResponse;
  maxPriceInput: NumericInputResponse;
  maxRentInput: NumericInputResponse;
  maxDepositInput: NumericInputResponse;
  regionState: RegionState;
  labels: Label[];
  selectedLabels: Label[];
  isAddingLabel: boolean;
  newLabelName: string;
  isSubmitButtonDisabled: boolean;
  validationErrors: string[];
  onClose: () => void;
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBirthdayChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTelProviderChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRoleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFieldBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onRegionChange: (
    type: "sido" | "sigungu" | "dong"
  ) => (event: SelectChangeEvent) => void;
  onSubmit: () => void;
  onLabelSelect: (label: Label) => void;
  onAddLabel: () => void;
  onSetIsAddingLabel: (value: boolean) => void;
  onSetNewLabelName: (value: string) => void;
}

export default function CustomerAddModalView({
  open,
  formData,
  minPriceInput,
  minRentInput,
  minDepositInput,
  maxPriceInput,
  maxRentInput,
  maxDepositInput,
  regionState,
  labels,
  selectedLabels,
  isAddingLabel,
  newLabelName,
  isSubmitButtonDisabled,
  validationErrors,
  onClose,
  onFieldChange,
  onNameChange,
  onPhoneChange,
  onBirthdayChange,
  onTelProviderChange,
  onRoleChange,
  onFieldBlur,
  onRegionChange,
  onSubmit,
  onLabelSelect,
  onAddLabel,
  onSetIsAddingLabel,
  onSetNewLabelName,
}: CustomerAddModalViewProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        className: "w-[90vw] rounded-lg max-h-[90vh]",
      }}
    >
      <DialogTitle className="border-b text-primary font-bold border-gray-200">
        고객 등록
      </DialogTitle>

      <DialogContent className="flex flex-col gap-4 p-3 bg-neutral-100 overflow-x-hidden">
        <BasicInfoSection
          name={formData.name}
          phoneNo={formData.phoneNo}
          birthday={formData.birthday}
          telProvider={formData.telProvider}
          onNameChange={onNameChange}
          onPhoneChange={onPhoneChange}
          onBirthdayChange={onBirthdayChange}
          onTelProviderChange={onTelProviderChange}
          onFieldBlur={onFieldBlur}
        />
        <div className="p-5 card flex flex-col gap-5">
          <AdditionalInfoSection
            regionState={regionState}
            trafficSource={formData.trafficSource}
            onRegionChange={onRegionChange}
            onFieldChange={onFieldChange}
          />

          <RoleSection
            seller={formData.seller}
            buyer={formData.buyer}
            tenant={formData.tenant}
            landlord={formData.landlord}
            onRoleChange={onRoleChange}
          />

          <PriceSection
            showSalePrice={formData.seller || formData.buyer}
            showRentPrice={formData.tenant || formData.landlord}
            minPriceInput={minPriceInput}
            maxPriceInput={maxPriceInput}
            minRentInput={minRentInput}
            maxRentInput={maxRentInput}
            minDepositInput={minDepositInput}
            maxDepositInput={maxDepositInput}
            onFieldChange={onFieldChange}
          />

          <LabelSection
            labels={labels}
            selectedLabels={selectedLabels}
            isAddingLabel={isAddingLabel}
            newLabelName={newLabelName}
            onLabelSelect={onLabelSelect}
            onAddLabel={onAddLabel}
            onSetIsAddingLabel={onSetIsAddingLabel}
            onSetNewLabelName={onSetNewLabelName}
          />
        </div>
      </DialogContent>

      <DialogActions className="flex flex-row-reverse items-center justify-between p-6 border-t border-gray-200">
        <div className="flex gap-2">
          <Button onClick={onClose} variant="outlined" color="info">
            취소
          </Button>
          <Button
            onClick={onSubmit}
            variant="contained"
            disabled={isSubmitButtonDisabled}
          >
            확인
          </Button>
        </div>
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
}
