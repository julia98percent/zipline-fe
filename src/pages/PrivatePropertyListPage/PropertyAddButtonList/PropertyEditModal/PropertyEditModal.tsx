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
import dayjs from "dayjs";

export interface AgentPropertyDetail {
  customer: string;
  address: string;
  legalDistrictCode: string;
  deposit: number;
  monthlyRent: number;
  price: number;
  type: "SALE" | "DEPOSIT" | "MONTHLY";
  longitude: number;
  latitude: number;
  startDate: string;
  endDate: string;
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

function PropertyEditModal({ open, handleClose, fetchPropertyData, propertyUid, initialData }: PropertyEditModalProps) {
  const [customerUid, setCustomerUid] = useState<number | null>(null);
  const [custoemrUid, setcustoemrUid] = useState<{ uid: number; name: string }[]>([]);
  const [address, setAddress] = useState("");
  const [detailAddress, setdetailAddress] = useState("");
  const [legalDistrictCode, setLegalDistrictCode] = useState("");
  const [deposit, setDeposit] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [price, setPrice] = useState("");
  const [netArea, setNetArea] = useState("");
  const [totalArea, setTotalArea] = useState("");
  const [floor, setFloor] = useState("");
  const [constructionYear, setConstructionYear] = useState("");
  const [parkingCapacity, setParkingCapacity] = useState("");
  const [details, setDetails] = useState("");
  const [type, setType] = useState("SALE");
  const [longitude, setLongitude] = useState<number | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [contractStartDate, setContractStartDate] = useState<Dayjs | null>(null);
  const [contractEndDate, setContractEndDate] = useState<Dayjs | null>(null);
  const [moveInDate, setMoveInDate] = useState<Dayjs | null>(null);
  const [realCategory, setRealCategory] = useState("APARTMENT");
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [hasElevator, setHasElevator] = useState(false);

  useEffect(() => {
    if (open && initialData) {
      if (initialData.customerUid !== undefined && initialData.customerUid !== null) setCustomerUid(initialData.customerUid as number);
      if (initialData.address) setAddress(initialData.address);
      if (initialData.detailAddress) setdetailAddress(initialData.detailAddress);
      if (initialData.legalDistrictCode) setLegalDistrictCode(initialData.legalDistrictCode);
      if (initialData.deposit !== undefined && initialData.deposit !== null) setDeposit(String(initialData.deposit));
      if (initialData.monthlyRent !== undefined && initialData.monthlyRent !== null) setMonthlyRent(String(initialData.monthlyRent));
      if (initialData.price !== undefined && initialData.price !== null) setPrice(String(initialData.price));
      if (initialData.netArea !== undefined && initialData.netArea !== null) setNetArea(String(initialData.netArea));
      if (initialData.totalArea !== undefined && initialData.totalArea !== null) setTotalArea(String(initialData.totalArea));
      if (initialData.floor !== undefined && initialData.floor !== null) setFloor(String(initialData.floor));
      if (initialData.constructionYear) setConstructionYear(String(initialData.constructionYear));
      if (initialData.parkingCapacity !== undefined && initialData.parkingCapacity !== null) setParkingCapacity(String(initialData.parkingCapacity));
      if (initialData.details) setDetails(initialData.details);
      if (initialData.type) setType(initialData.type);
      if (initialData.longitude !== undefined && initialData.longitude !== null) setLongitude(initialData.longitude);
      if (initialData.latitude !== undefined && initialData.latitude !== null) setLatitude(initialData.latitude);
      if (initialData.startDate) setContractStartDate(dayjs(initialData.startDate));
      if (initialData.endDate) setContractEndDate(dayjs(initialData.endDate));
      if (initialData.moveInDate) setMoveInDate(dayjs(initialData.moveInDate));
      if (initialData.realCategory) setRealCategory(initialData.realCategory);
      if (initialData.petsAllowed !== undefined && initialData.petsAllowed !== null) setPetsAllowed(initialData.petsAllowed);
      if (initialData.hasElevator !== undefined && initialData.hasElevator !== null) setHasElevator(initialData.hasElevator);
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
  const handleSubmit = () => {
    const payload = {
      customerUid,
      address,
      legalDistrictCode,
      deposit: Number(deposit),
      monthlyRent: Number(monthlyRent),
      price: Number(price),
      type,
      longitude,
      latitude,
      startDate: contractStartDate?.format("YYYY-MM-DD"),
      endDate: contractEndDate?.format("YYYY-MM-DD"),
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

    apiClient.patch(`/properties/${propertyUid}`, payload)
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
      <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "50vw", bgcolor: "white", p: 4, borderRadius: 2, maxHeight: "80vh", overflowY: "auto" }}>
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
            value={price ?? ""}
            onChange={(e) => setPrice(e.target.value)}
            sx={{ mt: 2 }}
            fullWidth
            placeholder="숫자만 입력하세요"
          />
        )}
        {type === "DEPOSIT" && (
          <TextField
            label="보증금"
            value={deposit ?? ""}
            onChange={(e) => setDeposit(e.target.value)}
            sx={{ mt: 2 }}
            fullWidth
          />
        )}
        {type === "MONTHLY" && (
          <>
            <TextField
              label="보증금"
              value={deposit ?? ""}
              onChange={(e) => setDeposit(e.target.value)}
              sx={{ mt: 2 }}
              fullWidth
            />
            <TextField
              label="월세"
              value={monthlyRent ?? ""}
              onChange={(e) => setMonthlyRent(e.target.value)}
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
          <FormControlLabel value="APARTMENT" control={<Radio />} label="아파트" />
          <FormControlLabel value="VILLA" control={<Radio />} label="빌라" />
          <FormControlLabel value="HOUSE" control={<Radio />} label="주택" />
          <FormControlLabel value="OFFICETEL" control={<Radio />} label="오피스텔" />
          <FormControlLabel value="COMMERCIAL" control={<Radio />} label="상가" />
        </RadioGroup>
        <TextField
          label="공급 면적"
          value={totalArea}
          onChange={(e) => setTotalArea(e.target.value)}
          sx={{ mt: 2 }}
          fullWidth
          placeholder="숫자만 입력하세요"
        />
        <TextField
          label="전용 면적"
          value={netArea ?? ""}
          onChange={(e) => setNetArea(e.target.value)}
          sx={{ mt: 2 }}
          fullWidth
          placeholder="숫자만 입력하세요"
        />
        <TextField
          label="층수"
          value={floor ?? ""}
          onChange={(e) => setFloor(e.target.value)}
          sx={{ mt: 2 }}
          fullWidth
          placeholder="숫자만 입력하세요"
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

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Box sx={{ flex: 1 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DesktopDatePicker
                  onChange={setContractStartDate}
                  value={contractStartDate}
                  format="YYYY. MM. DD"
                  label="계약 시작일"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Box>
          <Box sx={{ flex: 1 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DesktopDatePicker
                  onChange={setContractEndDate}
                  value={contractEndDate}
                  format="YYYY. MM. DD"
                  label="계약 종료일"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Box>
        </Box>

        {/* 입주 가능일 */}
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
          value={constructionYear ?? ""}
          onChange={(e) => setConstructionYear(e.target.value)}
          sx={{ mt: 2 }}
          fullWidth
          placeholder="숫자만 입력하세요 ex)2010"
        />
        <TextField
          label="주차 가능 대수"
          value={parkingCapacity}
          onChange={(e) => setParkingCapacity(e.target.value)}
          sx={{ mt: 2 }}
          fullWidth
          placeholder="숫자만 입력하세요"
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
