import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
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
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import apiClient from "@apis/apiClient";
import DaumPost from "./DaumPost";
import { toast } from "react-toastify";
import dayjs from "dayjs";

export interface AgentPropertyDetail {
  customer: string;
  address: string;
  legalDistrictCode: string;
  detailAddress: string;
  deposit: number;
  monthlyRent: number;
  price: number;
  type: "SALE" | "DEPOSIT" | "MONTHLY";
  longitude: number;
  latitude: number;
  moveInDate: string;
  realCategory:
    | "ONE_ROOM"
    | "TWO_ROOM"
    | "APARTMENT"
    | "VILLA"
    | "HOUSE"
    | "OFFICETEL"
    | "COMMERCIAL";
  petsAllowed: boolean;
  floor: number;
  hasElevator: boolean;
  constructionYear: string;
  parkingCapacity: number;
  netArea: number;
  totalArea: number;
  details: string;
}

interface PropertyEditModalProps {
  open: boolean;
  handleClose: () => void;
  initialData?: Partial<AgentPropertyDetail>;
  propertyUid: number;
  fetchPropertyData: () => void;
}
function useNumericInput(
  initialValue: string | number | null = ""
): [
  string,
  (e: React.ChangeEvent<HTMLInputElement>) => void,
  string | null,
  (value: string) => void
] {
  const [value, setValue] = useState<string>(initialValue?.toString() ?? "");
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (rawValue && !/^\d*\.?\d*$/.test(rawValue)) {
      setError("숫자만 입력 가능합니다.");
    } else {
      const formatted = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      setValue(formatted);
      setError(null);
    }
  };

  const setValueManually = (input: string) => {
    const rawValue = input.replace(/,/g, "");
    const formatted = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setValue(formatted);
    setError(null);
  };

  return [value, handleChange, error, setValueManually];
}
function useRawNumericInput(
  initialValue: string | number | null = ""
): [
  string,
  (e: React.ChangeEvent<HTMLInputElement>) => void,
  string | null,
  (value: string) => void
] {
  const [value, setValue] = useState<string>(initialValue?.toString() ?? "");
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    if (rawValue && !/^\d*\.?\d*$/.test(rawValue)) {
      setError("숫자만 입력 가능합니다.");
    } else {
      setValue(rawValue);
      setError(null);
    }
  };

  const setValueManually = (input: string) => {
    setValue(input);
    setError(null);
  };

  return [value, handleChange, error, setValueManually];
}
function PropertyEditModal({
  open,
  handleClose,
  fetchPropertyData,
  propertyUid,
  initialData,
}: PropertyEditModalProps) {
  const [customerUid, setCustomerUid] = useState<number | null>(null);
  const [custoemrUid, setcustoemrUid] = useState<
    { uid: number; name: string }[]
  >([]);
  const [address, setAddress] = useState("");
  const [detailAddress, setdetailAddress] = useState("");
  const [legalDistrictCode, setLegalDistrictCode] = useState("");
  const [deposit, handleChangeDeposit, , setDepositManually] = useNumericInput("");
  const [monthlyRent, handleChangeMonthlyRent, , setMonthlyRentManually] = useNumericInput("");
  const [price, handleChangePrice, , setPriceManually] = useNumericInput("");
  
  const [netArea, handleChangeNetArea, , setNetAreaManually] = useRawNumericInput("");
  const [totalArea, handleChangeTotalArea, , setTotalAreaManually] = useRawNumericInput("");
  const [floor, handleChangeFloor, , setFloorManually] = useRawNumericInput("");
  const [constructionYear, handleChangeConstructionYear, , setConstructionYearManually] = useRawNumericInput("");
  const [parkingCapacity, handleChangeParkingCapacity, , setParkingCapacityManually] = useRawNumericInput("");
  
  const [details, setDetails] = useState("");
  const [type, setType] = useState("SALE");
  const [longitude, setLongitude] = useState<number | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [moveInDate, setMoveInDate] = useState<Dayjs | null>(null);
  const [realCategory, setRealCategory] = useState("APARTMENT");
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [hasElevator, setHasElevator] = useState(false);

  useEffect(() => {
    if (open && initialData) {
      if (initialData.customerUid != null) setCustomerUid(initialData.customerUid);
      if (initialData.address) setAddress(initialData.address);
      if (initialData.detailAddress) setdetailAddress(initialData.detailAddress);
      if (initialData.legalDistrictCode) setLegalDistrictCode(initialData.legalDistrictCode);
  
      if (initialData.deposit != null) setDepositManually(String(initialData.deposit));
      if (initialData.monthlyRent != null) setMonthlyRentManually(String(initialData.monthlyRent));
      if (initialData.price != null) setPriceManually(String(initialData.price));
  
      if (initialData.netArea != null) setNetAreaManually(String(initialData.netArea));
      if (initialData.totalArea != null) setTotalAreaManually(String(initialData.totalArea));
      if (initialData.floor != null) setFloorManually(String(initialData.floor));
      if (initialData.constructionYear != null) setConstructionYearManually(String(initialData.constructionYear));
      if (initialData.parkingCapacity != null) setParkingCapacityManually(String(initialData.parkingCapacity));
  
      if (initialData.details) setDetails(initialData.details);
      if (initialData.type) setType(initialData.type);
      if (initialData.longitude !== undefined && initialData.longitude !== null)
        setLongitude(initialData.longitude);
      if (initialData.latitude !== undefined && initialData.latitude !== null)
        setLatitude(initialData.latitude);
      if (initialData.moveInDate) setMoveInDate(dayjs(initialData.moveInDate));
      if (initialData.realCategory) setRealCategory(initialData.realCategory);
      if (
        initialData.petsAllowed !== undefined &&
        initialData.petsAllowed !== null
      )
        setPetsAllowed(initialData.petsAllowed);
      if (
        initialData.hasElevator !== undefined &&
        initialData.hasElevator !== null
      )
        setHasElevator(initialData.hasElevator);
    }
  }, [open, initialData]);

  useEffect(() => {
    apiClient.get("/customers").then((res) => {
      const customers = res.data.data.customers;
      setcustoemrUid(customers);

      // 고객 이름 → UID 매핑
      if (initialData?.customer) {
        const matched = customers.find(
          (c: { name: string }) => c.name === initialData.customer
        );
        setCustomerUid(matched?.uid ?? null);
      }
    });
  }, [initialData]);
  useEffect(() => {
    if (!address) return;
    axios
      .get(
        `https://dapi.kakao.com/v2/local/search/address.json?query=${address}`,
        {
          headers: {
            Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_MAP_KEY}`,
          },
        }
      )
      .then((res) => {
        const result = res?.data?.documents[0]?.address;
        if (result) {
          setLongitude(Number(result.x));
          setLatitude(Number(result.y));
          setLegalDistrictCode(result.b_code);          
        }
      });
  }, [address]);
  const handleSubmit = () => {
    const parseNumber = (str: string) => Number(str.replace(/,/g, ""));

    const payload = {
      customerUid,
      address,
      legalDistrictCode,
      detailAddress,
      deposit: parseNumber(deposit),
      monthlyRent: parseNumber(monthlyRent),
      price: parseNumber(price),
      type,
      longitude,
      latitude,
      moveInDate: moveInDate?.format("YYYY-MM-DD"),
      realCategory,
      petsAllowed,
      floor: Number(floor),
      hasElevator,
      constructionYear: constructionYear ? Number(constructionYear) : null,
      parkingCapacity: Number(parkingCapacity),
      netArea: Number(netArea),
      totalArea: Number(totalArea),
      details,
    };

    apiClient
      .patch(`/properties/${propertyUid}`, payload)
      .then(() => {
        toast.success("매물 수정 완료");
        fetchPropertyData();
        handleClose();
      })
      .catch(() => {
        toast.error("매물 수정 실패");
      });
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50vw",
          bgcolor: "white",
          p: 4,
          borderRadius: 2,
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6">매물 수정</Typography>
        <TextField
          select
          label="고객 선택"
          value={customerUid !== null ? customerUid.toString() : ""}
          onChange={(e) => setCustomerUid(Number(e.target.value))}
          fullWidth
          sx={{ mt: 2 }}
        >
          {custoemrUid.map((customer) => (
            <MenuItem key={customer.uid} value={customer.uid.toString()}>
              {customer.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="주소"
          value={address ?? ""}
          variant="outlined"
          disabled
          fullWidth
          sx={{ mt: 2 }}
        />
        <DaumPost setAddress={setAddress} />
        <TextField
          label="상세 주소"
          value={detailAddress ?? ""}
          onChange={(e) => setdetailAddress(e.target.value)}
          disabled={!address}
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
        />

        {/* 거래 유형 */}
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          거래 유형
        </Typography>
        <RadioGroup
          row
          value={type}
          onChange={(event) =>
            setType(event.target.value as "SALE" | "DEPOSIT" | "MONTHLY")
          }
        >
          <FormControlLabel value="SALE" control={<Radio />} label="매매" />
          <FormControlLabel value="DEPOSIT" control={<Radio />} label="전세" />
          <FormControlLabel value="MONTHLY" control={<Radio />} label="월세" />
        </RadioGroup>
        {/* 조건부 TextField 렌더링 */}
        {type === "SALE" && (
  <TextField
    label="매매 가격"
    value={price}
    onChange={handleChangePrice}
    sx={{ mt: 2 }}
    fullWidth
  />
)}
{type === "DEPOSIT" && (
  <TextField
    label="보증금"
    value={deposit}
    onChange={handleChangeDeposit}
    sx={{ mt: 2 }}
    fullWidth
  />
)}
{type === "MONTHLY" && (
  <>
    <TextField
      label="보증금"
      value={deposit}
      onChange={handleChangeDeposit}
      sx={{ mt: 2 }}
      fullWidth
    />
    <TextField
      label="월세"
      value={monthlyRent}
      onChange={handleChangeMonthlyRent}
      sx={{ mt: 2 }}
      fullWidth
    />
  </>
)}
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          부동산 유형 선택
        </Typography>
        <RadioGroup
          row
          value={realCategory}
          onChange={(event) => setRealCategory(event.target.value)}
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
        <TextField
  label="공급 면적"
  value={totalArea}
  onChange={handleChangeTotalArea}
  sx={{ mt: 2 }}
  fullWidth
/>

<TextField
  label="전용 면적"
  value={netArea}
  onChange={handleChangeNetArea}
  sx={{ mt: 2 }}
  fullWidth
/>

<TextField
  label="층수"
  value={floor}
  onChange={handleChangeFloor}
  sx={{ mt: 2 }}
  fullWidth
/>
        {/* 반려동물 여부 */}
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          반려동물 여부
        </Typography>
        <RadioGroup
          row
          value={petsAllowed.toString()}
          onChange={(e) => setPetsAllowed(e.target.value === "true")}
        >
          <FormControlLabel value={"true"} control={<Radio />} label="허용" />
          <FormControlLabel value={"false"} control={<Radio />} label="불가" />
        </RadioGroup>

        {/* 건물 엘리베이터 여부 */}
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          건물 엘리베이터 여부
        </Typography>
        <RadioGroup
          row
          value={hasElevator.toString()}
          onChange={(e) => setHasElevator(e.target.value === "true")}
        >
          <FormControlLabel value="true" control={<Radio />} label="있음" />
          <FormControlLabel value="false" control={<Radio />} label="없음" />
        </RadioGroup>       

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DesktopDatePicker
              onChange={setMoveInDate}
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
  value={constructionYear}
  onChange={handleChangeConstructionYear}
  sx={{ mt: 2 }}
  fullWidth
  placeholder="숫자만 입력하세요 ex)2010"
/>

<TextField
  label="주차 가능 대수"
  value={parkingCapacity}
  onChange={handleChangeParkingCapacity}
  sx={{ mt: 2 }}
  fullWidth
/>

        {/* 특이사항 */}
        <TextField
          label="특이사항"
          value={details ?? ""}
          onChange={(e) => setDetails(e.target.value)}
          sx={{ mt: 2 }}
          fullWidth
        />

        <Button
          text="수정"
          onClick={handleSubmit}
          sx={{
            mt: 4,
            color: "white !important",
            backgroundColor: "#164F9E",
            "&:disabled": {
              backgroundColor: "lightgray",
              color: "white",
            },
          }}
        />
      </Box>
    </Modal>
  );
}

export default PropertyEditModal;
