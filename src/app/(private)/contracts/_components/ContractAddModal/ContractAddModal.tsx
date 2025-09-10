import { useEffect, useState } from "react";
import { Dayjs } from "dayjs";
import { showToast } from "@/components/Toast";
import { CONTRACT_STATUS_OPTION_LIST } from "@/constants/contract";
import {
  createContract,
  fetchProperties,
  fetchCustomers,
  AgentPropertyResponse,
  CustomerResponse,
} from "@/apis/contractService";
import ContractAddModalView from "./ContractAddModalView";
import { useNumericInput, useRawNumericInput } from "@/hooks/useNumericInput";
import { MAX_PROPERTY_PRICE } from "@/constants/property";

type ContractStatus = (typeof CONTRACT_STATUS_OPTION_LIST)[number]["value"];

interface Props {
  open: boolean;
  handleClose: () => void;
  fetchContractData: () => void;
}

const ContractAddModal = ({ open, handleClose, fetchContractData }: Props) => {
  const [category, setCategory] = useState<string | null>(null);
  const [contractDate, setContractDate] = useState<Dayjs | null>(null);
  const [contractStartDate, setContractStartDate] = useState<Dayjs | null>(
    null
  );
  const [contractEndDate, setContractEndDate] = useState<Dayjs | null>(null);
  const [expectedContractEndDate, setExpectedContractEndDate] =
    useState<Dayjs | null>(null);

  const depositInput = useRawNumericInput("", {
    max: MAX_PROPERTY_PRICE,
  });
  const monthlyRentInput = useNumericInput("", {
    max: MAX_PROPERTY_PRICE,
  });
  const priceInput = useNumericInput("", {
    max: MAX_PROPERTY_PRICE,
  });

  const [lessorUids, setLessorUids] = useState<number[]>([]);
  const [lesseeUids, setLesseeUids] = useState<number[]>([]);
  const [propertyUid, setPropertyUid] = useState<number | null>(null);
  const [status, setStatus] = useState<ContractStatus>(
    CONTRACT_STATUS_OPTION_LIST[5].value
  ); // 기본값: '진행 중'

  const [customerOptions, setCustomerOptions] = useState<CustomerResponse[]>(
    []
  );
  const [propertyOptions, setPropertyOptions] = useState<
    AgentPropertyResponse[]
  >([]);
  const [files, setFiles] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [customers, properties] = await Promise.all([
          fetchCustomers(),
          fetchProperties(),
        ]);
        setCustomerOptions(customers);
        setPropertyOptions(properties);
      } catch (error) {
        console.error("초기 데이터 로딩 실패", error);
      }
    };

    fetchInitialData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleFileRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getValidationErrors = () => {
    const errors: string[] = [];

    if (
      contractDate &&
      contractStartDate &&
      contractDate.isAfter(contractStartDate)
    ) {
      errors.push("계약일은 시작일보다 이전이어야 합니다.");
    }

    if (
      contractStartDate &&
      contractEndDate &&
      !contractStartDate.isBefore(contractEndDate)
    ) {
      errors.push("시작일은 종료일보다 이전이어야 합니다.");
    }

    if (lessorUids.length === 0) errors.push("임대/매도인를 선택해 주세요.");

    const hasOverlap = lessorUids.some((id) => lesseeUids.includes(id));
    if (hasOverlap) {
      errors.push("임대인와 임차인은 같을 수 없습니다.");
    }
    if (!propertyUid) errors.push("매물을 선택해 주세요.");
    if (!status) errors.push("계약 상태를 선택해 주세요.");
    if (priceInput.error) errors.push("유효한 가격을 입력해주세요");
    if (depositInput.error) errors.push("유효한 보증금을 입력해주세요");
    if (monthlyRentInput.error) errors.push("유효한 월세를 입력해주세요");

    return errors;
  };

  const handleCategoryChange = (value: string | null) => {
    setCategory(value);
    if (value === "SALE") {
      depositInput.setValueManually("");
      monthlyRentInput.setValueManually("");
    } else if (value === "DEPOSIT") {
      monthlyRentInput.setValueManually("");
      priceInput.setValueManually("");
    } else if (value === "MONTHLY") {
      priceInput.setValueManually("");
    }
  };

  const handleSubmit = async () => {
    const requestPayload = {
      category: category === "" ? null : category,
      contractDate: contractDate ? contractDate.format("YYYY-MM-DD") : null,
      contractStartDate: contractStartDate
        ? contractStartDate.format("YYYY-MM-DD")
        : null,
      contractEndDate: contractEndDate
        ? contractEndDate.format("YYYY-MM-DD")
        : null,
      expectedContractEndDate: expectedContractEndDate
        ? expectedContractEndDate.format("YYYY-MM-DD")
        : null,
      deposit: depositInput.value ? parseInt(depositInput.value, 10) : 0,
      monthlyRent: monthlyRentInput.value
        ? parseInt(monthlyRentInput.value, 10)
        : 0,
      price: priceInput.value ? parseInt(priceInput.value, 10) : 0,
      lessorOrSellerUids: lessorUids,
      lesseeOrBuyerUids: lesseeUids,
      propertyUid,
      status,
    };

    const formData = new FormData();
    formData.append(
      "contractRequestDTO",
      new Blob([JSON.stringify(requestPayload)], { type: "application/json" })
    );
    files.forEach((file) => formData.append("files", file));

    try {
      await createContract(formData);
      showToast({
        message: "계약을 등록했습니다.",
        type: "success",
      });
      fetchContractData();
      handleModalClose();
    } catch (err) {
      console.error("계약 등록 실패", err);

      const axiosError = err as { response?: { data?: { message?: string } } };
      const message = axiosError?.response?.data?.message;

      if (!message) {
        showToast({
          message: "계약 등록에 실패했습니다.",
          type: "error",
        });
        return;
      }

      if (message.includes("이미 등록된 계약입니다")) {
        showToast({
          message: "이미 등록된 계약입니다.",
          type: "error",
        });
        return;
      }

      if (message.includes("해당 매물은 이미 계약 중입니다")) {
        showToast({
          message: "해당 매물은 이미 진행 중인 계약이 있습니다.",
          type: "error",
        });
        return;
      }
      showToast({
        message,
        type: "error",
      });
    }
  };

  const validationErrors = getValidationErrors();
  const isSubmitButtonDisabled = validationErrors.length > 0;

  const handleModalClose = () => {
    setCategory("");
    setContractDate(null);
    setContractStartDate(null);
    setContractEndDate(null);
    setExpectedContractEndDate(null);
    depositInput.setValueManually("");
    monthlyRentInput.setValueManually("");
    priceInput.setValueManually("");
    setLessorUids([]);
    setLesseeUids([]);
    setPropertyUid(null);
    setStatus(CONTRACT_STATUS_OPTION_LIST[5].value);
    setFiles([]);
    setErrorMessage("");
    handleClose();
  };

  return (
    <ContractAddModalView
      open={open}
      handleModalClose={handleModalClose}
      category={category}
      handleCategoryChange={handleCategoryChange}
      contractDate={contractDate}
      setContractDate={setContractDate}
      contractStartDate={contractStartDate}
      setContractStartDate={setContractStartDate}
      contractEndDate={contractEndDate}
      setContractEndDate={setContractEndDate}
      expectedContractEndDate={expectedContractEndDate}
      setExpectedContractEndDate={setExpectedContractEndDate}
      depositInput={depositInput}
      monthlyRentInput={monthlyRentInput}
      priceInput={priceInput}
      lessorUids={lessorUids}
      setLessorUids={setLessorUids}
      lesseeUids={lesseeUids}
      setLesseeUids={setLesseeUids}
      propertyUid={propertyUid}
      setPropertyUid={setPropertyUid}
      status={status}
      setStatus={setStatus}
      customerOptions={customerOptions}
      propertyOptions={propertyOptions}
      files={files}
      handleFileChange={handleFileChange}
      handleFileRemove={handleFileRemove}
      handleSubmit={handleSubmit}
      isSubmitButtonDisabled={isSubmitButtonDisabled}
      errorMessage={errorMessage}
      validationErrors={validationErrors}
    />
  );
};

export default ContractAddModal;
