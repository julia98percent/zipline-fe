import axios from "axios";
import { useEffect, useState } from "react";
import Button from "@components/Button";
import { Modal, Box, Typography } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { showToast } from "@components/Toast/Toast";
import { useNumericInput, useRawNumericInput } from "@hooks/useNumericInput";
import { updateProperty } from "@apis/propertyService";
import { fetchCustomerList } from "@apis/customerService";
import {
  CustomerSelectSection,
  AddressSection,
  TransactionTypeSection,
  PropertyTypeSection,
  PropertyDetailsSection,
  PropertyFeaturesSection,
  AdditionalInfoSection,
} from "./components";
import { Property, PropertyType } from "@ts/property";

interface PropertyEditModalProps {
  open: boolean;
  handleClose: () => void;
  initialData?: Partial<Property>;
  propertyUid: number;
  fetchPropertyData: () => void;
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
  const [address, setAddress] = useState<string | null>("");
  const [detailAddress, setdetailAddress] = useState("");
  const [legalDistrictCode, setLegalDistrictCode] = useState("");
  const [deposit, handleChangeDeposit, , setDepositManually] =
    useNumericInput("");
  const [monthlyRent, handleChangeMonthlyRent, , setMonthlyRentManually] =
    useNumericInput("");
  const [price, handleChangePrice, , setPriceManually] = useNumericInput("");

  const [netArea, handleChangeNetArea, , setNetAreaManually] =
    useRawNumericInput("");
  const [totalArea, handleChangeTotalArea, , setTotalAreaManually] =
    useRawNumericInput("");
  const [floor, handleChangeFloor, , setFloorManually] = useRawNumericInput("");
  const [
    constructionYear,
    handleChangeConstructionYear,
    ,
    setConstructionYearManually,
  ] = useRawNumericInput("");
  const [
    parkingCapacity,
    handleChangeParkingCapacity,
    ,
    setParkingCapacityManually,
  ] = useRawNumericInput("");

  const [details, setDetails] = useState("");
  const [type, setType] = useState<PropertyType>("SALE");
  const [longitude, setLongitude] = useState<number | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [moveInDate, setMoveInDate] = useState<Dayjs | null>(null);
  const [realCategory, setRealCategory] = useState("APARTMENT");
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [hasElevator, setHasElevator] = useState(false);
  console.log(initialData);
  useEffect(() => {
    if (open && initialData) {
      if (initialData.customerUid != null)
        setCustomerUid(initialData.customerUid);
      if (initialData.address) setAddress(initialData.address);
      if (initialData.detailAddress)
        setdetailAddress(initialData.detailAddress);
      if (initialData.legalDistrictCode)
        setLegalDistrictCode(initialData.legalDistrictCode);

      if (initialData.deposit != null)
        setDepositManually(String(initialData.deposit));
      if (initialData.monthlyRent != null)
        setMonthlyRentManually(String(initialData.monthlyRent));
      if (initialData.price != null)
        setPriceManually(String(initialData.price));

      if (initialData.netArea != null)
        setNetAreaManually(String(initialData.netArea));
      if (initialData.totalArea != null)
        setTotalAreaManually(String(initialData.totalArea));
      if (initialData.floor != null)
        setFloorManually(String(initialData.floor));
      if (initialData.constructionYear != null)
        setConstructionYearManually(String(initialData.constructionYear));
      if (initialData.parkingCapacity != null)
        setParkingCapacityManually(String(initialData.parkingCapacity));

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
    const loadCustomers = async () => {
      try {
        const customers = await fetchCustomerList();
        setcustoemrUid(customers);

        // 고객 이름 → UID 매핑
        if (initialData?.customer) {
          const matched = customers.find(
            (c: { name: string }) => c.name === initialData.customer
          );
          setCustomerUid(matched?.uid ?? null);
        }
      } catch (error) {
        console.error("고객 목록 로드 실패:", error);
      }
    };

    loadCustomers();
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
  const handleSubmit = async () => {
    if (!customerUid)
      return showToast({
        message: "고객을 선택해주세요.",
        type: "error",
      });
    if (!address)
      return showToast({
        message: "주소를 입력해주세요.",
        type: "error",
      });
    if (!realCategory)
      return showToast({
        message: "매물 유형을 선택해주세요.",
        type: "error",
      });
    if (hasElevator === null || hasElevator === undefined)
      return showToast({
        message: "엘리베이터 유무를 선택해주세요.",
        type: "error",
      });
    if (!netArea || Number(netArea) <= 0)
      return showToast({
        message: "공급면적을 입력해주세요.",
        type: "error",
      });
    if (!totalArea || Number(totalArea) <= 0)
      return showToast({
        message: "공급면적을 입력해주세요.",
        type: "error",
      });
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

    try {
      await updateProperty(propertyUid, payload);
      showToast({
        message: "매물을 수정했습니다.",
        type: "success",
      });
      fetchPropertyData();
      handleClose();
    } catch {
      showToast({
        message: "매물 수정 중 오류가 발생했습니다. 다시 시도해주세요.",
        type: "error",
      });
    }
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

        <CustomerSelectSection
          customerUid={customerUid}
          customers={custoemrUid}
          onCustomerChange={setCustomerUid}
        />

        <AddressSection
          address={address}
          detailAddress={detailAddress}
          onAddressChange={setAddress}
          onDetailAddressChange={setdetailAddress}
        />

        <TransactionTypeSection
          type={type}
          price={price}
          deposit={deposit}
          monthlyRent={monthlyRent}
          onTypeChange={setType}
          onPriceChange={handleChangePrice}
          onDepositChange={handleChangeDeposit}
          onMonthlyRentChange={handleChangeMonthlyRent}
        />

        <PropertyTypeSection
          realCategory={realCategory}
          onRealCategoryChange={setRealCategory}
        />

        <PropertyDetailsSection
          totalArea={totalArea}
          netArea={netArea}
          floor={floor}
          onTotalAreaChange={handleChangeTotalArea}
          onNetAreaChange={handleChangeNetArea}
          onFloorChange={handleChangeFloor}
        />

        <PropertyFeaturesSection
          petsAllowed={petsAllowed}
          hasElevator={hasElevator}
          onPetsAllowedChange={setPetsAllowed}
          onHasElevatorChange={setHasElevator}
        />

        <AdditionalInfoSection
          moveInDate={moveInDate}
          constructionYear={constructionYear}
          parkingCapacity={parkingCapacity}
          details={details}
          onMoveInDateChange={setMoveInDate}
          onConstructionYearChange={handleChangeConstructionYear}
          onParkingCapacityChange={handleChangeParkingCapacity}
          onDetailsChange={(e) => setDetails(e.target.value)}
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
