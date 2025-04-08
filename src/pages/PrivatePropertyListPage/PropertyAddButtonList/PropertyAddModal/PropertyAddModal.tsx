import axios from "axios";
import { useEffect, useState } from "react";
import Button from "@components/Button";
import TextField from "@components/TextField";
import {
  Modal,
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import useInput from "@hooks/useInput";
import apiClient from "@apis/apiClient";
import { isNumberOrNumericString } from "@utils/numberUtil";
import DaumPost from "./DaumPost";

type EstateType = "SALE" | "DEPOSIT" | "MONTHLY";
type RealCategory =
  | "ONE_ROOM"
  | "TWO_ROOM"
  | "APARTMENT"
  | "VILLA"
  | "HOUSE"
  | "OFFICETEL"
  | "COMMERCIAL";

interface Props {
  open: boolean;
  handleClose: () => void;
  fetchPropertyData: any;
}

function PropertyAddModal({
  open,
  handleClose: setModalClose,
  fetchPropertyData,
}: Props) {
  const [address, setAddress] = useState<string | null>(null);
  const [addressForCoord, setAddressForCoord] = useState<string | null>(null);
  const [detailAddress, handleChangeDetailAddress] = useInput<string>("");
  const [deposit, handleChangeDeposit, setDeposit] = useInput(null);
  const [monthlyRent, handleChangeMonthlyRent, setMonthlyRent] = useInput(null);
  const [price, handleChangePrice, setPrice] = useInput(null);
  const [type, setType] = useState<EstateType>("SALE");
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [moveInDate, setMoveInDate] = useState<Dayjs | null>(null);
  const [realCategory, setRealCategory] = useState("APARTMENT");
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [floor, handleChangeFloor, setFloor] = useInput(null);
  const [hasElevator, setHasElevator] = useState<boolean>(false);
  const [constructionYear, handleChangeConstructionYear, setConstructionYear] =
    useInput(null);
  const [parkingCapacity, handleChangeParkingCapacity, setParkingCapacity] =
    useInput(null);
  const [netArea, handleChangeNetArea, setNetArea] = useInput(null);
  const [totalArea, handleChangeTotalArea, setTotalArea] = useInput(null);
  const [details, handleChangeDetails, setDetails] = useInput(null);

  const handleClickSubmitButton = () => {
    const propertyDataToSubmit = {
      customerUid: 1,
      address: address + detailAddress,
      deposit,
      monthlyRent,
      price,
      type,
      longitude,
      latitude,
      moveInDate,
      realCategory,
      petsAllowed,
      floor,
      hasElevator,
      constructionYear,
      parkingCapacity,
      netArea,
      totalArea,
      details,
    };

    apiClient
      .post("/properties", propertyDataToSubmit)
      .then((res) => {
        console.log(res);
        if (res.status === 201) {
          alert("매물 등록 성공");
          fetchPropertyData();
          handleModalClose();
          resetPropertyData();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const isSubmitButtonDisabled =
    !address ||
    !type ||
    !netArea ||
    !totalArea ||
    (type == "SALE" && !price) ||
    (type == "DEPOSIT" && !deposit) ||
    (type == "MONTHLY" && (!monthlyRent || !deposit)) ||
    (price && !isNumberOrNumericString(price)) ||
    (monthlyRent && !isNumberOrNumericString(monthlyRent)) ||
    (deposit && !isNumberOrNumericString(deposit));

  const resetPropertyData = () => {
    setDeposit(null);
    setMonthlyRent(null);
    setPrice(null);
    setType("SALE");
    setLongitude(null);
    setLatitude(null);
    setMoveInDate(null);
    setRealCategory("APARTMENT");
    setPetsAllowed(false);
    setFloor(null);
    setHasElevator(false);
    setConstructionYear(null);
    setParkingCapacity(null);
    setNetArea(null);
    setTotalArea(null);
    setDetails(null);
  };

  const handleModalClose = () => {
    setModalClose();
    resetPropertyData();
  };

  useEffect(() => {
    axios
      .get(
        `https://dapi.kakao.com/v2/local/search/address.json?query=${addressForCoord}`,
        {
          headers: {
            Authorization: "KakaoAK ce08657ba311e8fe08e4166e26db13b5",
          },
        }
      )
      .then((res) => {
        const result = res?.data?.documents[0]?.address;

        if (result) {
          setLongitude(result.x);
          setLatitude(result.y);
        }
      });
  }, [address, addressForCoord]);

  return (
    <Modal open={open} onClose={handleModalClose}>
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
          p: 0,
          height: "80vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            overflowY: "scroll",
            flexGrow: 1,
            p: 4,
          }}
        >
          <Typography variant="h6">매물 등록</Typography>
          <TextField
            label="주소"
            value={address ?? ""}
            variant="outlined"
            disabled
            fullWidth
          />
          <DaumPost
            setAddress={setAddress}
            setAddressForCoord={setAddressForCoord}
          />
          <TextField
            label="상세 주소"
            value={detailAddress ?? ""}
            onChange={handleChangeDetailAddress}
            disabled={!address}
            variant="outlined"
            fullWidth
          />
          {/* 거래 유형 */}
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            거래 유형
          </Typography>
          <RadioGroup
            row
            value={type}
            onChange={(event) => setType(event.target.value as EstateType)}
          >
            <FormControlLabel value="SALE" control={<Radio />} label="매매" />
            <FormControlLabel
              value="DEPOSIT"
              control={<Radio />}
              label="전세"
            />
            <FormControlLabel
              value="MONTHLY"
              control={<Radio />}
              label="월세"
            />
          </RadioGroup>
          {/* 조건부 TextField 렌더링 */}
          {type === "SALE" && (
            <TextField
              label="매매 가격"
              value={price ?? ""}
              onChange={handleChangePrice}
              sx={{ mt: 2 }}
              fullWidth
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
            <FormControlLabel
              value="ONE_ROOM"
              control={<Radio />}
              label="원룸"
            />
            <FormControlLabel
              value="TWO_ROOM"
              control={<Radio />}
              label="투룸"
            />
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
            value={totalArea ?? ""}
            onChange={handleChangeTotalArea}
            sx={{ mt: 2 }}
            fullWidth
          />
          <TextField
            label="전용 면적"
            value={netArea ?? ""}
            onChange={handleChangeNetArea}
            sx={{ mt: 2 }}
            fullWidth
          />
          <TextField
            label="층수"
            value={floor ?? ""}
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
            <FormControlLabel
              value={"false"}
              control={<Radio />}
              label="불가"
            />
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

          {/* 입주 가능일 */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DesktopDatePicker
                onChange={setMoveInDate}
                value={moveInDate}
                format="YYYY. MM. DD"
                label="입주 가능일"
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
            disabled={isSubmitButtonDisabled}
            text="등록"
            onClick={handleClickSubmitButton}
            sx={{
              mt: 4,
              color: "white !important",
              backgroundColor: "#2E5D9F",
              "&:disabled": {
                backgroundColor: "lightgray",
                color: "white",
              },
            }}
          />
        </Box>
      </Box>
    </Modal>
  );
}
export default PropertyAddModal;
