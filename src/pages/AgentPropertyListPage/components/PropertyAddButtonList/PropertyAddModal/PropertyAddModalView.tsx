import Button from "@components/Button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from "@mui/material";
import { Customer } from "@ts/customer";
import { PropertyType } from "@ts/property";
import { Dayjs } from "dayjs";
import CustomerAddressSection from "./CustomerAddressSection";
import PropertyTypeAndPriceSection from "./PropertyTypeAndPriceSection";
import PropertyDetailsSection from "./PropertyDetailsSection";
import PropertyOptionsSection from "./PropertyOptionsSection";
import { NumericInputResponse } from "@hooks/useNumericInput";

interface CustomerData {
  uid: number | null;
  options: Customer[];
  onChange: (uid: number) => void;
}

interface AddressData {
  address: string | null;
  extraAddress: string;
  onAddressChange: (address: string | null) => void;
  onDaumPostAddressChange: React.Dispatch<React.SetStateAction<string | null>>;
  onExtraAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface PropertyTypeData {
  type: PropertyType;
  realCategory: string;
  onTypeChange: (type: PropertyType) => void;
  onRealCategoryChange: (category: string) => void;
}

interface NumericInputs {
  price: NumericInputResponse;
  deposit: NumericInputResponse;
  monthlyRent: NumericInputResponse;
  netArea: NumericInputResponse;
  totalArea: NumericInputResponse;
  floor: NumericInputResponse;
  constructionYear: NumericInputResponse;
  parkingCapacity: NumericInputResponse;
}

interface OtherData {
  moveInDate: Dayjs | null;
  petsAllowed: boolean;
  hasElevator: boolean;
  details: string | null;
  createContract: boolean;
  onMoveInDateChange: (date: Dayjs | null) => void;
  onPetsAllowedChange: (allowed: boolean) => void;
  onHasElevatorChange: (hasElevator: boolean) => void;
  onDetailsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCreateContractChange: (checked: boolean) => void;
}

interface PropertyAddModalViewProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  customerData: CustomerData;
  addressData: AddressData;
  propertyTypeData: PropertyTypeData;
  numericInputs: NumericInputs;
  otherData: OtherData;
  isFormValid: boolean;
  validationErrors: string[];
}

const PropertyAddModalView = ({
  open,
  onClose,
  onSubmit,
  customerData,
  addressData,
  propertyTypeData,
  numericInputs,
  otherData,
  isFormValid,
  validationErrors,
}: PropertyAddModalViewProps) => {
  const priceInputs = {
    price: numericInputs.price,
    deposit: numericInputs.deposit,
    monthlyRent: numericInputs.monthlyRent,
  };

  // Extract detail-related inputs
  const detailInputs = {
    netArea: numericInputs.netArea,
    totalArea: numericInputs.totalArea,
    floor: numericInputs.floor,
    constructionYear: numericInputs.constructionYear,
    parkingCapacity: numericInputs.parkingCapacity,
  };

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
        매물 등록
      </DialogTitle>
      <DialogContent className="p-7 pt-0 flex flex-col mt-4">
        <CustomerAddressSection
          customerData={customerData}
          addressData={addressData}
        />
        <PropertyTypeAndPriceSection
          propertyTypeData={propertyTypeData}
          priceInputs={priceInputs}
          createContract={otherData.createContract}
          onCreateContractChange={otherData.onCreateContractChange}
        />
        <PropertyDetailsSection detailInputs={detailInputs} />
        <PropertyOptionsSection
          moveInDate={otherData.moveInDate}
          petsAllowed={otherData.petsAllowed}
          hasElevator={otherData.hasElevator}
          details={otherData.details}
          onMoveInDateChange={otherData.onMoveInDateChange}
          onPetsAllowedChange={otherData.onPetsAllowedChange}
          onHasElevatorChange={otherData.onHasElevatorChange}
          onDetailsChange={otherData.onDetailsChange}
        />
      </DialogContent>
      <DialogActions className="flex flex-row-reverse items-center justify-between p-6 border-t border-gray-200">
        <div className="flex gap-2">
          <Button onClick={onClose} variant="outlined">
            취소
          </Button>
          <Button onClick={onSubmit} color="primary" disabled={!isFormValid}>
            확인
          </Button>
        </div>
        {!isFormValid && validationErrors.length > 0 && (
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
              <ul className=" list-disc list-inside">
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

export default PropertyAddModalView;
