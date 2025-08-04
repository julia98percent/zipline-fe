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
import {
  MAX_PROPERTY_PRICE,
  MAX_PROPERTY_AREA,
  MIN_PROPERTY_AREA,
  MIN_PROPERTY_FLOOR,
  MAX_PROPERTY_FLOOR,
  MIN_PROPERTY_CONSTRUCTION_YEAR,
  MAX_PROPERTY_CONSTRUCTION_YEAR,
  MIN_PROPERTY_PARKING_CAPACITY,
  MAX_PROPERTY_PARKING_CAPACITY,
} from "@constants/property";

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
  const [customerUid, setCustomerUid] = useState<number | null>(null);
  const [customerOptions, setCustomerOptions] = useState<Customer[]>([]);
  const [address, setAddress] = useState<string | null>(null);
  const [legalDistrictCode, setLegalDistrictCode] = useState<string>("");
  const [extraAddress, handleChangeDetailAddress] = useInput<string>("");
  const [createContract, setCreateContract] = useState<boolean>(false);

  const priceInput = useNumericInput("", { max: MAX_PROPERTY_PRICE });
  const depositInput = useNumericInput("", { max: MAX_PROPERTY_PRICE });
  const monthlyRentInput = useNumericInput("", { max: MAX_PROPERTY_PRICE });
  const netAreaInput = useNumericInput("", {
    max: MAX_PROPERTY_AREA,
    min: MIN_PROPERTY_AREA,
  });
  const totalAreaInput = useNumericInput("", {
    max: MAX_PROPERTY_AREA,
    min: MIN_PROPERTY_AREA,
  });
  const floorInput = useRawNumericInput("", {
    min: MIN_PROPERTY_FLOOR,
    allowNegative: true,
    max: MAX_PROPERTY_FLOOR,
  });
  const constructionYearInput = useRawNumericInput("", {
    min: MIN_PROPERTY_CONSTRUCTION_YEAR,
    max: MAX_PROPERTY_CONSTRUCTION_YEAR,
  });
  const parkingCapacityInput = useRawNumericInput("", {
    min: MIN_PROPERTY_PARKING_CAPACITY,
    max: MAX_PROPERTY_PARKING_CAPACITY,
  });

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

  const getValidationErrors = () => {
    const errors: string[] = [];

    if (!customerUid) errors.push("고객을 선택해주세요");
    if (!address) errors.push("주소를 입력해주세요");
    if (!realCategory) errors.push("매물 유형을 선택해주세요");
    if (!type) errors.push("거래 유형을 선택해주세요");
    if (hasElevator === null || hasElevator === undefined)
      errors.push("엘리베이터 유무를 선택해주세요");
    if (!netAreaInput.value || Number(netAreaInput.value) <= 0)
      errors.push("전용면적을 입력해주세요");
    if (!totalAreaInput.value || Number(totalAreaInput.value) <= 0)
      errors.push("공급면적을 입력해주세요");

    if (netAreaInput.error) errors.push("유효한 전용 면적을 입력해주세요");
    if (totalAreaInput.error) errors.push("유효한 공급 면적을 입력해주세요");
    if (floorInput.error) errors.push("유효한 층수를 입력해주세요");
    if (constructionYearInput.error)
      errors.push("유효한 건축년도를 입력해주세요");
    if (parkingCapacityInput.error)
      errors.push("유효한 주차 가능 대수를 입력해주세요");
    if (priceInput.error) errors.push("유효한 가격을 입력해주세요");
    if (depositInput.error) errors.push("유효한 보증금을 입력해주세요");
    if (monthlyRentInput.error) errors.push("유효한 월세를 입력해주세요");

    return errors;
  };

  const isFormValid = getValidationErrors().length === 0;

  const validateForm = (): boolean => {
    const errors = getValidationErrors();
    if (errors.length > 0) {
      showToast({ message: errors[0], type: "error" });
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
      deposit: parseNumber(depositInput.value),
      monthlyRent: parseNumber(monthlyRentInput.value),
      price: parseNumber(priceInput.value),
      type: type,
      longitude,
      latitude,
      moveInDate: moveInDate?.format("YYYY-MM-DD") || null,
      realCategory,
      petsAllowed,
      floor: Number(floorInput.value),
      hasElevator,
      constructionYear: constructionYearInput.value
        ? Number(constructionYearInput.value)
        : null,
      parkingCapacity: Number(parkingCapacityInput.value),
      netArea: Number(netAreaInput.value),
      totalArea: Number(totalAreaInput.value),
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
        보증금: (msg) => depositInput.setValueManually(msg),
        월세: (msg) => monthlyRentInput.setValueManually(msg),
        "매매 가격": (msg) => priceInput.setValueManually(msg),
        "전용 면적": (msg) => netAreaInput.setValueManually(msg),
        "공급 면적": (msg) => totalAreaInput.setValueManually(msg),
        층수: (msg) => floorInput.setValueManually(msg),
        건축년도: (msg) => constructionYearInput.setValueManually(msg),
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

  // Form data objects
  const customerData = {
    uid: customerUid,
    options: customerOptions,
    onChange: setCustomerUid,
  };

  const addressData = {
    address,
    extraAddress,
    onAddressChange: setAddress,
    onDaumPostAddressChange: handleAddressChange,
    onExtraAddressChange: handleChangeDetailAddress,
  };

  const propertyTypeData = {
    type,
    realCategory,
    onTypeChange: setType,
    onRealCategoryChange: setRealCategory,
  };

  const numericInputs = {
    price: priceInput,
    deposit: depositInput,
    monthlyRent: monthlyRentInput,
    netArea: netAreaInput,
    totalArea: totalAreaInput,
    floor: floorInput,
    constructionYear: constructionYearInput,
    parkingCapacity: parkingCapacityInput,
  };

  const otherData = {
    moveInDate,
    petsAllowed,
    hasElevator,
    details,
    createContract,
    onMoveInDateChange: setMoveInDate,
    onPetsAllowedChange: setPetsAllowed,
    onHasElevatorChange: setHasElevator,
    onDetailsChange: handleChangeDetails,
    onCreateContractChange: setCreateContract,
  };

  const validationErrors = getValidationErrors();

  return (
    <PropertyAddModalView
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit}
      customerData={customerData}
      addressData={addressData}
      propertyTypeData={propertyTypeData}
      numericInputs={numericInputs}
      otherData={otherData}
      isFormValid={isFormValid}
      validationErrors={validationErrors}
    />
  );
};

export default PropertyAddModal;
