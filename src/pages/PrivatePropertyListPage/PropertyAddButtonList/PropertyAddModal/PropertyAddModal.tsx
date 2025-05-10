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
  Checkbox,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import useInput from "@hooks/useInput";
import apiClient from "@apis/apiClient";
import DaumPost from "./DaumPost";
import { toast } from "react-toastify";

function useNumericInput(
  initialValue: string | number | null = ""
): [
  string,
  (e: React.ChangeEvent<HTMLInputElement>) => void,
  string | null,
  React.Dispatch<React.SetStateAction<string | null>>
] {
  const [value, setValue] = useState<string>(initialValue?.toString() ?? "");
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, ""); // 콤마 제거
    if (rawValue && !/^\d*\.?\d*$/.test(rawValue)) {
      setError("숫자만 입력 가능합니다.");
    } else {
      const formatted = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // 콤마 추가
      setValue(formatted);
      setError(null);
    }
  };

  return [value, handleChange, error, setError];
}

function useRawNumericInput(
  initialValue: string | number | null = ""
): [
  string,
  (e: React.ChangeEvent<HTMLInputElement>) => void,
  string | null,
  React.Dispatch<React.SetStateAction<string | null>>
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

  return [value, handleChange, error, setError];
}

interface PropertyAddModalProps {
  open: boolean;
  handleClose: () => void;
  fetchPropertyData: () => void;
}

function PropertyAddModal({
  open,
  handleClose,
  fetchPropertyData,
}: PropertyAddModalProps) {
  const [customerUid, setCustomerUid] = useState<number | null>(null);
  const [customerOptions, setCustomerOptions] = useState<
    { uid: number; name: string }[]
  >([]);
  const [address, setAddress] = useState<string | null>(null);
  const [legalDistrictCode, setLegalDistrictCode] = useState<string>("");
  const [extraAddress, handleChangeDetailAddress] = useInput<string>("");
  const [createContract, setCreateContract] = useState<boolean>(false);

  const [deposit, handleChangeDeposit, , setDepositError] = useNumericInput("");
  const [monthlyRent, handleChangeMonthlyRent, , setMonthlyRentError] =
    useNumericInput("");
  const [price, handleChangePrice, priceError, setPriceError] =
    useNumericInput("");
  const [netArea, handleChangeNetArea, netAreaError, setNetAreaError] =
  useRawNumericInput("");
  const [totalArea, handleChangeTotalArea, totalAreaError, setTotalAreaError] =
  useRawNumericInput("");
  const [floor, handleChangeFloor, floorError, setFloorError] =
    useRawNumericInput("");
  const [
    constructionYear,
    handleChangeConstructionYear,
    constructionYearError,
    setConstructionYearError,
  ] = useRawNumericInput("");

  const [parkingCapacity, handleChangeParkingCapacity, parkingCapacityError] =
    useRawNumericInput("");
  const [details, handleChangeDetails] = useInput(null);
  const [type, setType] = useState("SALE");
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [moveInDate, setMoveInDate] = useState<Dayjs | null>(null);
  const [realCategory, setRealCategory] = useState("APARTMENT");
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [hasElevator, setHasElevator] = useState<boolean>(false);

  const handleClickSubmitButton = () => {
    
    const parseNumber = (str: string) => {
      if (!str || str.replace(/,/g, "") === "") return null;
      return Number(str.replace(/,/g, ""));
    };
    const propertyDataToSubmit = {
      customerUid,
      address: address,
      detailAddress: extraAddress,
      legalDistrictCode,
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
      createContract,
    };

    apiClient
      .post("/properties", propertyDataToSubmit)
      .then((res) => {
        if (res.status === 201) {
          toast("매물 등록 성공");
          fetchPropertyData();
          handleClose();
        }
      })
      .catch((error) => {
        const message = error.response?.data?.message;
        if (!message) return toast.error("등록 중 오류가 발생했습니다.");

        const errorMap: Record<string, (msg: string) => void> = {
          보증금: (msg) => setDepositError(msg),
          월세: (msg) => setMonthlyRentError(msg),
          "매매 가격": (msg) => setPriceError(msg),
          "전용 면적": (msg) => setNetAreaError(msg),
          "공급 면적": (msg) => setTotalAreaError(msg),
          층수: (msg) => setFloorError(msg),
          건축년도: (msg) => setConstructionYearError(msg),
          주소: (msg) => toast.error(msg),
          고객: () => toast.error(message),
        };

        const matched = Object.entries(errorMap).find(([key]) =>
          message.includes(key)
        );
        if (matched) matched[1](message);
        else toast.error(message);
      });
  };
  useEffect(() => {
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
          setLongitude(result.x);
          setLatitude(result.y);
          setLegalDistrictCode(result.b_code);
        }
      });
  }, [address]);

  useEffect(() => {
    apiClient.get("/customers").then((res) => {
      setCustomerOptions(res.data.data.customers);
    });
  }, []);

  return (
    <Modal open={open} onClose={handleClose}>
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
        <Typography variant="h6">매물 등록</Typography>
        <TextField
          select
          label="고객 선택"
          value={customerUid !== null ? customerUid.toString() : ""}
          onChange={(e) => setCustomerUid(Number(e.target.value))}
          fullWidth
          sx={{ mt: 2 }}
        >
          {customerOptions.map((customer) => (
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
          value={extraAddress ?? ""}
          onChange={handleChangeDetailAddress}
          disabled={!address}
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={createContract}
              onChange={(e) => setCreateContract(e.target.checked)}
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
            value={price ?? ""}
            onChange={handleChangePrice}
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
            onChange={handleChangeDeposit}
            sx={{ mt: 2 }}
            fullWidth
          />
        )}
        {type === "MONTHLY" && (
          <>
            <TextField
              label="보증금"
              value={deposit ?? ""}
              onChange={handleChangeDeposit}
              sx={{ mt: 2 }}
              fullWidth
            />
            <TextField
              label="월세"
              value={monthlyRent ?? ""}
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
          placeholder="숫자만 입력하세요"
          error={!!totalAreaError}
          helperText={totalAreaError ?? undefined}
        />
        <TextField
          label="전용 면적"
          value={netArea ?? ""}
          onChange={handleChangeNetArea}
          sx={{ mt: 2 }}
          fullWidth
          placeholder="숫자만 입력하세요"
          error={!!netAreaError}
          helperText={netAreaError ?? undefined}
        />
        <TextField
          label="층수"
          value={floor ?? ""}
          onChange={handleChangeFloor}
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
                  fullWidth: true, // 추가
                },
              }}
            />
          </DemoContainer>
        </LocalizationProvider>

        {/* 건축년도 */}
        <TextField
          label="건축년도"
          value={constructionYear ?? ""}
          onChange={handleChangeConstructionYear}
          sx={{ mt: 2 }}
          fullWidth
          placeholder="숫자만 입력하세요 ex)2010"
          error={!!constructionYearError}
          helperText={constructionYearError ?? undefined}
        />
        <TextField
          label="주차 가능 대수"
          value={parkingCapacity}
          onChange={handleChangeParkingCapacity}
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
          onChange={handleChangeDetails}
          sx={{ mt: 2 }}
          fullWidth
        />

        <Button
          text="등록"
          onClick={handleClickSubmitButton}
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
export default PropertyAddModal;
