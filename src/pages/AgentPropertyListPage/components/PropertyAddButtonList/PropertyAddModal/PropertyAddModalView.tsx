import Button from "@components/Button";
import TextField from "@components/TextField";
import {
  Modal,
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Checkbox,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import DaumPost from "@components/DaumPost";
import { Customer } from "@ts/customer";
import { PropertyType } from "@ts/property";

interface PropertyAddModalViewProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;

  // Customer
  customerUid: number | null;
  customerOptions: Customer[];
  onCustomerChange: (uid: number) => void;

  // Address
  address: string | null;
  onAddressChange: (address: string | null) => void;
  onDaumPostAddressChange: React.Dispatch<React.SetStateAction<string | null>>;
  extraAddress: string;
  onExtraAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  // Contract
  createContract: boolean;
  onCreateContractChange: (checked: boolean) => void;

  // Property type
  type: PropertyType;
  onTypeChange: (type: PropertyType) => void;
  realCategory: string;
  onRealCategoryChange: (category: string) => void;

  // Price fields
  deposit: string;
  onDepositChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  monthlyRent: string;
  onMonthlyRentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  price: string;
  priceError: string | null;
  onPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  // Area and floor
  netArea: string;
  netAreaError: string | null;
  onNetAreaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  totalArea: string;
  totalAreaError: string | null;
  onTotalAreaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  floor: string;
  floorError: string | null;
  onFloorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  // Construction and parking
  constructionYear: string;
  constructionYearError: string | null;
  onConstructionYearChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  parkingCapacity: string;
  parkingCapacityError: string | null;
  onParkingCapacityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  // Other properties
  moveInDate: Dayjs | null;
  onMoveInDateChange: (date: Dayjs | null) => void;
  petsAllowed: boolean;
  onPetsAllowedChange: (allowed: boolean) => void;
  hasElevator: boolean;
  onHasElevatorChange: (hasElevator: boolean) => void;
  details: string | null;
  onDetailsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PropertyAddModalView = ({
  open,
  onClose,
  onSubmit,
  customerUid,
  customerOptions,
  onCustomerChange,
  address,
  onDaumPostAddressChange,
  extraAddress,
  onExtraAddressChange,
  createContract,
  onCreateContractChange,
  type,
  onTypeChange,
  realCategory,
  onRealCategoryChange,
  deposit,
  onDepositChange,
  monthlyRent,
  onMonthlyRentChange,
  price,
  priceError,
  onPriceChange,
  netArea,
  netAreaError,
  onNetAreaChange,
  totalArea,
  totalAreaError,
  onTotalAreaChange,
  floor,
  floorError,
  onFloorChange,
  constructionYear,
  constructionYearError,
  onConstructionYearChange,
  parkingCapacity,
  parkingCapacityError,
  onParkingCapacityChange,
  moveInDate,
  onMoveInDateChange,
  petsAllowed,
  onPetsAllowedChange,
  hasElevator,
  onHasElevatorChange,
  details,
  onDetailsChange,
}: PropertyAddModalViewProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50vw",
          backgroundColor: "white",
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: "#164F9E", fontWeight: "bold", mb: 1.5 }}
        >
          매물 등록
        </Typography>
        {/* 고객 선택 */}
        <TextField
          select
          label="고객 선택"
          value={customerUid !== null ? customerUid.toString() : ""}
          onChange={(e) => onCustomerChange(Number(e.target.value))}
          fullWidth
          sx={{ mt: 2 }}
        >
          {customerOptions.map((customer) => (
            <MenuItem key={customer.uid} value={customer.uid.toString()}>
              {customer.name}
            </MenuItem>
          ))}
        </TextField>
        {/* 주소 */}
        <TextField
          label="주소"
          value={address ?? ""}
          variant="outlined"
          disabled
          fullWidth
          sx={{ mt: 2 }}
        />{" "}
        <DaumPost setAddress={onDaumPostAddressChange} />
        <TextField
          label="상세 주소"
          value={extraAddress ?? ""}
          onChange={onExtraAddressChange}
          disabled={!address}
          variant="outlined"
          fullWidth
        />
        {/* 계약 자동 생성 */}
        <FormControlLabel
          control={
            <Checkbox
              checked={createContract}
              onChange={(e) => onCreateContractChange(e.target.checked)}
            />
          }
          label="계약 자동 생성하기"
          sx={{ mt: 2 }}
        />
        {/* 거래 유형 */}
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          거래 유형
        </Typography>
        <RadioGroup
          row
          value={type}
          onChange={(event) => onTypeChange(event.target.value as PropertyType)}
        >
          <FormControlLabel value="SALE" control={<Radio />} label="매매" />
          <FormControlLabel value="DEPOSIT" control={<Radio />} label="전세" />
          <FormControlLabel value="MONTHLY" control={<Radio />} label="월세" />
        </RadioGroup>
        {/* 조건부 가격 필드 */}
        {type === "SALE" && (
          <TextField
            label="매매 가격"
            value={price ?? ""}
            onChange={onPriceChange}
            sx={{ mt: 2 }}
            fullWidth
            placeholder="숫자만 입력하세요"
            error={!!priceError}
            helperText={priceError ?? undefined}
          />
        )}
        {type === "DEPOSIT" && (
          <TextField
            label="보증금"
            value={deposit ?? ""}
            onChange={onDepositChange}
            sx={{ mt: 2 }}
            fullWidth
          />
        )}
        {type === "MONTHLY" && (
          <>
            <TextField
              label="보증금"
              value={deposit ?? ""}
              onChange={onDepositChange}
              sx={{ mt: 2 }}
              fullWidth
            />
            <TextField
              label="월세"
              value={monthlyRent ?? ""}
              onChange={onMonthlyRentChange}
              sx={{ mt: 2 }}
              fullWidth
            />
          </>
        )}
        {/* 부동산 유형 */}
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          부동산 유형 선택
        </Typography>
        <RadioGroup
          row
          value={realCategory}
          onChange={(event) => onRealCategoryChange(event.target.value)}
        >
          <FormControlLabel value="ONE_ROOM" control={<Radio />} label="원룸" />
          <FormControlLabel value="TWO_ROOM" control={<Radio />} label="투룸" />
          <FormControlLabel
            value="APARTMENT"
            control={<Radio />}
            label="아파트"
          />
          <FormControlLabel value="VILLA" control={<Radio />} label="빌라" />
          <FormControlLabel value="HOUSE" control={<Radio />} label="주택" />
          <FormControlLabel
            value="OFFICETEL"
            control={<Radio />}
            label="오피스텔"
          />
          <FormControlLabel
            value="COMMERCIAL"
            control={<Radio />}
            label="상가"
          />
        </RadioGroup>
        {/* 면적 정보 */}
        <TextField
          label="공급 면적"
          value={totalArea}
          onChange={onTotalAreaChange}
          sx={{ mt: 2 }}
          fullWidth
          placeholder="숫자만 입력하세요"
          error={!!totalAreaError}
          helperText={totalAreaError ?? undefined}
        />
        <TextField
          label="전용 면적"
          value={netArea ?? ""}
          onChange={onNetAreaChange}
          sx={{ mt: 2 }}
          fullWidth
          placeholder="숫자만 입력하세요"
          error={!!netAreaError}
          helperText={netAreaError ?? undefined}
        />
        <TextField
          label="층수"
          value={floor ?? ""}
          onChange={onFloorChange}
          sx={{ mt: 2 }}
          fullWidth
          placeholder="숫자만 입력하세요"
          error={!!floorError}
          helperText={floorError ?? undefined}
        />
        {/* 반려동물 여부 */}
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          반려동물 여부
        </Typography>
        <RadioGroup
          row
          value={petsAllowed.toString()}
          onChange={(e) => onPetsAllowedChange(e.target.value === "true")}
        >
          <FormControlLabel value="true" control={<Radio />} label="허용" />
          <FormControlLabel value="false" control={<Radio />} label="불가" />
        </RadioGroup>
        {/* 엘리베이터 여부 */}
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          건물 엘리베이터 여부
        </Typography>
        <RadioGroup
          row
          value={hasElevator.toString()}
          onChange={(e) => onHasElevatorChange(e.target.value === "true")}
        >
          <FormControlLabel value="true" control={<Radio />} label="있음" />
          <FormControlLabel value="false" control={<Radio />} label="없음" />
        </RadioGroup>
        {/* 입주 가능일 */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DesktopDatePicker
              onChange={onMoveInDateChange}
              value={moveInDate}
              format="YYYY. MM. DD"
              label="입주 가능일"
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
          </DemoContainer>
        </LocalizationProvider>
        {/* 건축년도 */}
        <TextField
          label="건축년도"
          value={constructionYear ?? ""}
          onChange={onConstructionYearChange}
          sx={{ mt: 2 }}
          fullWidth
          placeholder="숫자만 입력하세요 ex)2010"
          error={!!constructionYearError}
          helperText={constructionYearError ?? undefined}
        />
        {/* 주차 가능 대수 */}
        <TextField
          label="주차 가능 대수"
          value={parkingCapacity}
          onChange={onParkingCapacityChange}
          sx={{ mt: 2 }}
          fullWidth
          placeholder="숫자만 입력하세요"
          error={!!parkingCapacityError}
          helperText={parkingCapacityError ?? undefined}
        />
        {/* 특이사항 */}
        <TextField
          label="특이사항"
          value={details ?? ""}
          onChange={onDetailsChange}
          sx={{ mt: 2 }}
          fullWidth
        />
        {/* 등록 버튼 */}
        <Button onClick={onSubmit} className="mt-4" color="primary">
          등록
        </Button>
      </Box>
    </Modal>
  );
};

export default PropertyAddModalView;
