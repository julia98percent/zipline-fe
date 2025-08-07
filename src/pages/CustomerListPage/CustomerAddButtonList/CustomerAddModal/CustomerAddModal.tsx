import { useState, useEffect } from "react";
import { CustomerBaseFormData, CustomerUpdateData } from "@ts/customer";
import { RegionState } from "@ts/region";
import { Label } from "@ts/customer";
import { SelectChangeEvent } from "@mui/material";
import {
  createCustomer,
  fetchLabels,
  createLabel,
} from "@apis/customerService";
import { fetchRegions } from "@apis/regionService";
import { showToast } from "@components/Toast";
import { formatPhoneNumber } from "@utils/numberUtil";
import CustomerAddModalView from "./CustomerAddModalView";
import { useRawNumericInput } from "@hooks/useNumericInput";
import { MAX_PROPERTY_PRICE } from "@constants/property";

interface CustomerAddModalProps {
  open: boolean;
  handleClose: () => void;
  fetchCustomerList: () => void;
}

const initialFormData: CustomerBaseFormData = {
  name: "",
  phoneNo: "",
  birthday: "",
  telProvider: "SKT",
  preferredRegion: "",
  trafficSource: "",
  seller: false,
  buyer: false,
  tenant: false,
  landlord: false,
  labelUids: [],
};

function CustomerAddModal({
  open,
  handleClose,
  fetchCustomerList,
}: CustomerAddModalProps) {
  const [formData, setFormData] =
    useState<CustomerBaseFormData>(initialFormData);
  const [region, setRegion] = useState<RegionState>({
    sido: [],
    sigungu: [],
    dong: [],
    selectedSido: null,
    selectedSigungu: null,
    selectedDong: null,
  });
  const [labels, setLabels] = useState<Label[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<Label[]>([]);
  const [isAddingLabel, setIsAddingLabel] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");

  const minPriceInput = useRawNumericInput("", { max: MAX_PROPERTY_PRICE });
  const maxPriceInput = useRawNumericInput("", { max: MAX_PROPERTY_PRICE });
  const minRentInput = useRawNumericInput("", { max: MAX_PROPERTY_PRICE });
  const maxRentInput = useRawNumericInput("", { max: MAX_PROPERTY_PRICE });
  const minDepositInput = useRawNumericInput("", { max: MAX_PROPERTY_PRICE });
  const maxDepositInput = useRawNumericInput("", { max: MAX_PROPERTY_PRICE });

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev: CustomerBaseFormData) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: CustomerBaseFormData) => ({
      ...prev,
      name: e.target.value,
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    setFormData((prev: CustomerBaseFormData) => ({
      ...prev,
      phoneNo: formattedNumber,
    }));
  };

  const handleBirthdayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 8) {
      setFormData((prev: CustomerBaseFormData) => ({
        ...prev,
        birthday: value,
      }));
    }
  };

  const handleTelProviderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: CustomerBaseFormData) => ({
      ...prev,
      telProvider: e.target.value,
    }));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev: CustomerBaseFormData) => ({ ...prev, [name]: checked }));
  };
  const handleFieldBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phoneNo") {
      const formattedNumber = formatPhoneNumber(value);
      setFormData((prev: CustomerBaseFormData) => ({
        ...prev,
        [name]: formattedNumber,
      }));
    }
  };

  const getValidationErrors = () => {
    const errors: string[] = [];

    if (!formData.name) errors.push("이름을 입력해주세요");
    if (!formData.phoneNo) errors.push("전화번호를 입력해주세요");
    if (formData.phoneNo && !/^\d{3}-\d{3,4}-\d{4}$/.test(formData.phoneNo)) {
      errors.push("올바른 전화번호 형식을 입력해주세요");
    }
    if (formData.birthday && !/^\d{8}$/.test(formData.birthday)) {
      errors.push("생년월일을 올바르게 입력해주세요 (예: 19910501)");
    }
    if (!formData.telProvider) errors.push("통신사를 선택해주세요");

    return errors;
  };

  const handleRegionChange =
    (type: "sido" | "sigungu" | "dong") => (event: SelectChangeEvent) => {
      const value = Number(event.target.value);
      const key = `selected${
        type.charAt(0).toUpperCase() + type.slice(1)
      }` as keyof RegionState;
      setRegion((prev: RegionState) => ({
        ...prev,
        [key]: value,
      }));
    };

  const onClose = () => {
    setFormData(initialFormData);
    handleClose();
  };

  const handleSubmit = async () => {
    try {
      // 선택된 지역 코드 (동 > 군구 > 시도 순으로 선택)
      const selectedRegion =
        region.selectedDong || region.selectedSigungu || region.selectedSido;

      const customerData: CustomerUpdateData = {
        name: formData.name,
        phoneNo: formData.phoneNo,
        birthday: formData.birthday || null,
        telProvider: formData.telProvider,
        preferredRegion: String(selectedRegion || ""),
        trafficSource: formData.trafficSource,
        landlord: formData.landlord,
        tenant: formData.tenant,
        buyer: formData.buyer,
        seller: formData.seller,
        minPrice: parseInt(minPriceInput.value) || null,
        maxPrice: parseInt(maxPriceInput.value) || null,
        minRent: parseInt(minRentInput.value) || null,
        maxRent: parseInt(maxRentInput.value) || null,
        minDeposit: parseInt(minDepositInput.value) || null,
        maxDeposit: parseInt(maxDepositInput.value) || null,
        labelUids: formData.labelUids,
      };

      const result = await createCustomer(customerData);

      if (!result.success) {
        throw new Error(result.message);
      }

      showToast({
        message: "고객 등록에 성공했습니다.",
        type: "success",
      });

      fetchCustomerList();
      onClose();
    } catch (error: unknown) {
      let errorMessage = "고객 등록에 실패했습니다.";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        errorMessage =
          String((error as { message: unknown }).message) || errorMessage;
      }

      showToast({
        message: errorMessage,
        type: "error",
      });
    }
  };

  // 라벨 목록 불러오기
  const fetchLabelsData = async () => {
    try {
      const labelsData = await fetchLabels();
      setLabels(labelsData);
    } catch (error) {
      console.error("라벨 목록 불러오기 실패:", error);
    }
  };

  // 새 라벨 추가
  const handleAddLabel = async () => {
    if (!newLabelName.trim()) return;

    try {
      await createLabel(newLabelName);
      setNewLabelName("");
      setIsAddingLabel(false);
      fetchLabelsData(); // 라벨 목록 새로고침
    } catch (error) {
      console.error("라벨 추가 실패:", error);
    }
  };

  // 라벨 선택 처리
  const handleLabelSelect = (label: Label) => {
    const isSelected = selectedLabels.some((l) => l.uid === label.uid);
    let newSelectedLabels: Label[];

    if (isSelected) {
      newSelectedLabels = selectedLabels.filter((l) => l.uid !== label.uid);
    } else {
      newSelectedLabels = [...selectedLabels, label];
    }

    setSelectedLabels(newSelectedLabels);
    setFormData((prev: CustomerBaseFormData) => ({
      ...prev,
      labelUids: newSelectedLabels.map((l) => l.uid),
    }));
  };

  // 모달이 열릴 때 초기 데이터 로드
  useEffect(() => {
    if (open) {
      // 시도 데이터 로드
      fetchRegions(0)
        .then((data) => {
          setRegion((prev: RegionState) => ({ ...prev, sido: data }));
        })
        .catch(console.error);

      // 라벨 데이터 로드
      fetchLabelsData();
    } else {
      // 모달이 닫힐 때 지역 상태 초기화
      setRegion({
        sido: [],
        sigungu: [],
        dong: [],
        selectedSido: null,
        selectedSigungu: null,
        selectedDong: null,
      });
      setSelectedLabels([]);
    }
  }, [open]);

  // 시도 선택 시 군구 로드
  useEffect(() => {
    if (!region.selectedSido) return;
    fetchRegions(region.selectedSido)
      .then((data) => {
        setRegion((prev: RegionState) => ({
          ...prev,
          sigungu: data,
          selectedSigungu: null,
          selectedDong: null,
          dong: [],
        }));
      })
      .catch(console.error);
  }, [region.selectedSido]);

  // 군구 선택 시 동 로드
  useEffect(() => {
    if (!region.selectedSigungu) return;
    fetchRegions(region.selectedSigungu)
      .then((data) => {
        setRegion((prev: RegionState) => ({
          ...prev,
          dong: data,
          selectedDong: null,
        }));
      })
      .catch(console.error);
  }, [region.selectedSigungu]);

  const validationErrors = getValidationErrors();
  const isSubmitButtonDisabled = validationErrors.length > 0;

  return (
    <CustomerAddModalView
      open={open}
      formData={formData}
      minPriceInput={minPriceInput}
      minRentInput={minRentInput}
      minDepositInput={minDepositInput}
      maxPriceInput={maxPriceInput}
      maxRentInput={maxRentInput}
      maxDepositInput={maxDepositInput}
      regionState={region}
      labels={labels}
      selectedLabels={selectedLabels}
      isAddingLabel={isAddingLabel}
      newLabelName={newLabelName}
      isSubmitButtonDisabled={isSubmitButtonDisabled}
      validationErrors={validationErrors}
      onClose={onClose}
      onFieldChange={handleFieldChange}
      onNameChange={handleNameChange}
      onPhoneChange={handlePhoneChange}
      onBirthdayChange={handleBirthdayChange}
      onTelProviderChange={handleTelProviderChange}
      onRoleChange={handleRoleChange}
      onFieldBlur={handleFieldBlur}
      onRegionChange={handleRegionChange}
      onSubmit={handleSubmit}
      onLabelSelect={handleLabelSelect}
      onAddLabel={handleAddLabel}
      onSetIsAddingLabel={setIsAddingLabel}
      onSetNewLabelName={setNewLabelName}
    />
  );
}

export default CustomerAddModal;
