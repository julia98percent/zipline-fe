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
  const {
    value: deposit,
    handleChange: handleChangeDeposit,
    setValueManually: setDepositManually,
  } = useNumericInput("");
  const {
    value: monthlyRent,
    handleChange: handleChangeMonthlyRent,
    setValueManually: setMonthlyRentManually,
  } = useNumericInput("");
  const {
    value: price,
    handleChange: handleChangePrice,
    setValueManually: setPriceManually,
  } = useNumericInput("");

  const {
    value: netArea,
    handleChange: handleChangeNetArea,
    setValueManually: setNetAreaManually,
  } = useRawNumericInput("");
  const {
    value: totalArea,
    handleChange: handleChangeTotalArea,
    setValueManually: setTotalAreaManually,
  } = useRawNumericInput("");
  const {
    value: floor,
    handleChange: handleChangeFloor,
    setValueManually: setFloorManually,
  } = useRawNumericInput("");

  const {
    value: constructionYear,
    handleChange: handleChangeConstructionYear,
    setValueManually: setConstructionYearManually,
  } = useRawNumericInput("");

  const {
    value: parkingCapacity,
    handleChange: handleChangeParkingCapacity,
    setValueManually: setParkingCapacityManually,
  } = useRawNumericInput("");

  const [details, setDetails] = useState("");
  const [type, setType] = useState<PropertyType>("SALE");
  const [longitude, setLongitude] = useState<number | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [moveInDate, setMoveInDate] = useState<Dayjs | null>(null);
  const [realCategory, setRealCategory] = useState("APARTMENT");
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [hasElevator, setHasElevator] = useState(false);

  useEffect(() => {
    if (open && initialData) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      moveInDate: moveInDate ? moveInDate?.format("YYYY-MM-DD") : null,
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
      <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[50vw] bg-white p-8 rounded-lg max-h-[80vh] overflow-y-auto">
        <Typography variant="h6">매물 수정</Typography>

        <CustomerSelectSection
          customerUid={customerUid}
          customers={custoemrUid}
          onCustomerChange={(uid: string) => setCustomerUid(Number(uid))}
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

        <Button onClick={handleSubmit} color="primary" className="mt-8">
          수정
        </Button>
      </Box>
    </Modal>
  );
}

export default PropertyEditModal;
