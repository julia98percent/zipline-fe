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
import { CustomerFormData } from "@ts/customer";
import { RegionState } from "@ts/region";
import {
  BasicInfoSection,
  LabelSection,
  PriceSection,
  AdditionalInfoSection,
  RoleSection,
} from "./components";

interface CustomerAddModalViewProps {
  open: boolean;
  formData: CustomerFormData;
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
        sx: {
          borderRadius: "8px",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle className="border-b text-primary font-bold border-gray-200">
        고객 등록
      </DialogTitle>

      <DialogContent className="mt-4 p-7 pt-0">
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
          minPrice={formData.minPrice}
          maxPrice={formData.maxPrice}
          minRent={formData.minRent}
          maxRent={formData.maxRent}
          minDeposit={formData.minDeposit}
          maxDeposit={formData.maxDeposit}
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
      </DialogContent>

      <DialogActions className="flex flex-row-reverse items-center justify-between p-6 border-t border-[#E0E0E0]">
        <div className="flex gap-2">
          <Button onClick={onClose} variant="outlined">
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
