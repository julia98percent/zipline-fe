import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  SelectChangeEvent,
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
  onClose: () => void;
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  onClose,
  onFieldChange,
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
      <DialogTitle className="border-b font-bold border-[#E0E0E0]">
        고객 등록
      </DialogTitle>

      <DialogContent className="mt-4">
        <BasicInfoSection
          name={formData.name}
          phoneNo={formData.phoneNo}
          birthday={formData.birthday}
          telProvider={formData.telProvider}
          onFieldChange={onFieldChange}
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
          onFieldChange={onFieldChange}
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

      <DialogActions className="p-6 border-t border-[#E0E0E0]">
        <Button
          onClick={onClose}
          variant="outlined"
          className={"text-[#164F9E] border-[#164F9E]"}
        >
          취소
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          className="bg-[#164F9E]  "
          disabled={isSubmitButtonDisabled}
        >
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
}
