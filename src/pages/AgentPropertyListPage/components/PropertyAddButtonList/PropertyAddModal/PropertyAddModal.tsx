import { useEffect, useState } from "react";
import { Dayjs } from "dayjs";
import axios from "axios";
import { createProperty, PropertyAddData } from "@apis/propertyService";
import { fetchCustomerList } from "@apis/customerService";
import { Customer } from "@ts/customer";
import { PropertyType } from "@ts/property";
import { showToast } from "@components/Toast/Toast";
import { useNumericInput, useRawNumericInput } from "@hooks/useNumericInput";
import useInput from "@hooks/useInput";
import PropertyAddModalView from "./PropertyAddModalView";

interface PropertyAddModalProps {
  open: boolean;
  handleClose: () => void;
  fetchPropertyData: () => void;
}

const PropertyAddModal = ({
  open,
  handleClose,
  fetchPropertyData,
}: PropertyAddModalProps) => {
  // State for form fields
  const [customerUid, setCustomerUid] = useState<number | null>(null);
  const [customerOptions, setCustomerOptions] = useState<Customer[]>([]);
  const [address, setAddress] = useState<string | null>(null);
  const [legalDistrictCode, setLegalDistrictCode] = useState<string>("");
  const [extraAddress, handleChangeDetailAddress] = useInput<string>("");
  const [createContract, setCreateContract] = useState<boolean>(false);

  // Numeric inputs with validation
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

  // Other form fields
  const [details, handleChangeDetails] = useInput(null);
  const [type, setType] = useState<PropertyType>("SALE");
  const [longitude, setLongitude] = useState<number | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [moveInDate, setMoveInDate] = useState<Dayjs | null>(null);
  const [realCategory, setRealCategory] = useState("APARTMENT");
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [hasElevator, setHasElevator] = useState<boolean>(false);

  // Handler for DaumPost
  const handleAddressChange = (
    value: string | null | ((prevState: string | null) => string | null)
  ) => {
    if (typeof value === "function") {
      setAddress(value);
    } else {
      setAddress(value);
    }
  };

  // Form validation and submission
  const validateForm = (): boolean => {
    if (!customerUid) {
      showToast({ message: "고객을 선택해주세요.", type: "error" });
      return false;
    }
    if (!address) {
      showToast({ message: "주소를 입력해주세요.", type: "error" });
      return false;
    }
    if (!realCategory) {
      showToast({ message: "매물 유형을 선택해주세요.", type: "error" });
      return false;
    }
    if (!type) {
      showToast({ message: "거래 유형을 선택해주세요.", type: "error" });
      return false;
    }
    if (hasElevator === null || hasElevator === undefined) {
      showToast({
        message: "엘리베이터 유무를 선택해주세요.",
        type: "error",
      });
      return false;
    }
    if (!netArea || Number(netArea) <= 0) {
      showToast({ message: "전용면적을 입력해주세요.", type: "error" });
      return false;
    }
    if (!totalArea || Number(totalArea) <= 0) {
      showToast({ message: "공급면적을 입력해주세요.", type: "error" });
      return false;
    }
    return true;
  };

  const parseNumber = (str: string) => {
    if (!str || str.replace(/,/g, "") === "") return null;
    return Number(str.replace(/,/g, ""));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const propertyDataToSubmit: PropertyAddData = {
      customerUid: customerUid!,
      address: address!,
      detailAddress: extraAddress,
      legalDistrictCode,
      deposit: parseNumber(deposit),
      monthlyRent: parseNumber(monthlyRent),
      price: parseNumber(price),
      type: type,
      longitude,
      latitude,
      moveInDate: moveInDate?.format("YYYY-MM-DD") || null,
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

    try {
      await createProperty(propertyDataToSubmit);
      handleClose();
      showToast({ message: "매물을 등록했습니다.", type: "success" });
      fetchPropertyData();
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      if (!message) {
        showToast({
          message: "등록 중 오류가 발생했습니다.",
          type: "error",
        });
        return;
      }

      const errorMap: Record<string, (msg: string) => void> = {
        보증금: (msg) => setDepositError(msg),
        월세: (msg) => setMonthlyRentError(msg),
        "매매 가격": (msg) => setPriceError(msg),
        "전용 면적": (msg) => setNetAreaError(msg),
        "공급 면적": (msg) => setTotalAreaError(msg),
        층수: (msg) => setFloorError(msg),
        건축년도: (msg) => setConstructionYearError(msg),
        주소: (msg) => showToast({ message: msg, type: "error" }),
        고객: () => showToast({ message, type: "error" }),
        "이미 등록되어있는 매물입니다.": () =>
          showToast({
            message: "이미 등록되어있는 매물입니다.",
            type: "error",
          }),
      };

      const matched = Object.entries(errorMap).find(([key]) =>
        message.includes(key)
      );
      if (matched) matched[1](message);
      else showToast({ message, type: "error" });
    }
  };

  // Fetch coordinates when address changes
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
          setLongitude(result.x);
          setLatitude(result.y);
          setLegalDistrictCode(result.b_code);
        }
      })
      .catch((error) => {
        console.error("Error fetching coordinates:", error);
      });
  }, [address]);

  // Fetch customers on mount
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const customers = await fetchCustomerList();
        setCustomerOptions(customers);
      } catch (error) {
        console.error("Error fetching customers:", error);
        showToast({
          message: "고객 목록을 불러오는데 실패했습니다.",
          type: "error",
        });
      }
    };

    if (open) {
      loadCustomers();
    }
  }, [open]);

  return (
    <PropertyAddModalView
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit}
      // Customer
      customerUid={customerUid}
      customerOptions={customerOptions}
      onCustomerChange={setCustomerUid}
      // Address
      address={address}
      onAddressChange={setAddress}
      onDaumPostAddressChange={handleAddressChange}
      extraAddress={extraAddress}
      onExtraAddressChange={handleChangeDetailAddress}
      // Contract
      createContract={createContract}
      onCreateContractChange={setCreateContract}
      // Property type
      type={type}
      onTypeChange={setType}
      realCategory={realCategory}
      onRealCategoryChange={setRealCategory}
      // Price fields
      deposit={deposit}
      onDepositChange={handleChangeDeposit}
      monthlyRent={monthlyRent}
      onMonthlyRentChange={handleChangeMonthlyRent}
      price={price}
      priceError={priceError}
      onPriceChange={handleChangePrice}
      // Area and floor
      netArea={netArea}
      netAreaError={netAreaError}
      onNetAreaChange={handleChangeNetArea}
      totalArea={totalArea}
      totalAreaError={totalAreaError}
      onTotalAreaChange={handleChangeTotalArea}
      floor={floor}
      floorError={floorError}
      onFloorChange={handleChangeFloor}
      // Construction and parking
      constructionYear={constructionYear}
      constructionYearError={constructionYearError}
      onConstructionYearChange={handleChangeConstructionYear}
      parkingCapacity={parkingCapacity}
      parkingCapacityError={parkingCapacityError}
      onParkingCapacityChange={handleChangeParkingCapacity}
      // Other properties
      moveInDate={moveInDate}
      onMoveInDateChange={setMoveInDate}
      petsAllowed={petsAllowed}
      onPetsAllowedChange={setPetsAllowed}
      hasElevator={hasElevator}
      onHasElevatorChange={setHasElevator}
      details={details}
      onDetailsChange={handleChangeDetails}
    />
  );
};

export default PropertyAddModal;
// This
