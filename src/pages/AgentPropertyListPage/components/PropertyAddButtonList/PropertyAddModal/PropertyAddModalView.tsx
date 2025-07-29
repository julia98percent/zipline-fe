import Button from "@components/Button";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { Customer } from "@ts/customer";
import { PropertyType } from "@ts/property";
import { Dayjs } from "dayjs";
import CustomerAddressSection from "./CustomerAddressSection";
import PropertyTypeAndPriceSection from "./PropertyTypeAndPriceSection";
import PropertyDetailsSection from "./PropertyDetailsSection";
import PropertyOptionsSection from "./PropertyOptionsSection";

export type NumericInputTuple = [
  string,
  (e: React.ChangeEvent<HTMLInputElement>) => void,
  string | null,
  (value: string) => void,
  (e: React.FocusEvent<HTMLInputElement>) => void
];

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
  price: NumericInputTuple;
  deposit: NumericInputTuple;
  monthlyRent: NumericInputTuple;
  netArea: NumericInputTuple;
  totalArea: NumericInputTuple;
  floor: NumericInputTuple;
  constructionYear: NumericInputTuple;
  parkingCapacity: NumericInputTuple;
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
  // Extract price-related inputs
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
      <DialogContent className="mt-4">
        <CustomerAddressSection
          customerData={customerData}
          addressData={addressData}
          createContract={otherData.createContract}
          onCreateContractChange={otherData.onCreateContractChange}
        />
        <PropertyTypeAndPriceSection
          propertyTypeData={propertyTypeData}
          priceInputs={priceInputs}
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
        {/* 등록 버튼 */}
        <div className="mt-4">
          <Button
            onClick={onSubmit}
            color="primary"
            disabled={!isFormValid}
            className={`w-full ${
              !isFormValid ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            등록
          </Button>
          {!isFormValid && validationErrors.length > 0 && (
            <div className="mt-2 text-sm text-red-600">
              <div className="font-medium">다음 항목을 확인해주세요:</div>
              <ul className="mt-1 list-disc list-inside">
                {validationErrors.slice(0, 3).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
                {validationErrors.length > 3 && (
                  <li>외 {validationErrors.length - 3}개 항목</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyAddModalView;
