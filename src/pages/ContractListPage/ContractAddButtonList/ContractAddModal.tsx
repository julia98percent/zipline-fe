import { useEffect, useState } from "react";
import { Dayjs } from "dayjs";
import { showToast } from "@components/Toast";
import { CONTRACT_STATUS_OPTION_LIST } from "@constants/contract";
import {
  createContract,
  fetchProperties,
  fetchCustomers,
  AgentPropertyResponse,
  CustomerResponse,
} from "@apis/contractService";
import ContractAddModalView from "./ContractAddModalView";

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

  const [deposit, setDeposit] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [price, setPrice] = useState("");

  const [lessorUids, setLessorUids] = useState<number[]>([]);
  const [lesseeUids, setLesseeUids] = useState<number[]>([]);
  const [propertyUid, setPropertyUid] = useState<number | null>(null);
  const [status, setStatus] = useState<ContractStatus>("IN_PROGRESS");

  const [customerOptions, setCustomerOptions] = useState<CustomerResponse[]>(
    []
  );
  const [propertyOptions, setPropertyOptions] = useState<
    AgentPropertyResponse[]
  >([]);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<{
    category?: string;
    contractDate?: string;
    contractStartDate?: string;
    contractEndDate?: string;
    expectedContractEndDate?: string;
    deposit?: string;
    monthlyRent?: string;
    price?: string;
    lessorUids?: string;
    lesseeUids?: string;
    propertyUid?: string;
    status?: string;
  }>({});

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
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const isValidInteger = (value: string) => {
    if (value === "") return true;
    return /^\d+$/.test(value);
  };

  const validateInputs = () => {
    const newErrors: typeof errors = {};

    if (
      contractDate &&
      contractStartDate &&
      contractDate.isAfter(contractStartDate)
    ) {
      newErrors.contractDate = "계약일은 시작일보다 이전이어야 합니다.";
    }

    if (
      contractStartDate &&
      contractEndDate &&
      !contractStartDate.isBefore(contractEndDate)
    ) {
      newErrors.contractStartDate = "시작일은 종료일보다 이전이어야 합니다.";
    }

    if (lessorUids.length === 0)
      newErrors.lessorUids = "임대/매도자를 선택해 주세요.";

    // 임대자와 임차자가 겹치는지 확인
    const hasOverlap = lessorUids.some((id) => lesseeUids.includes(id));
    if (hasOverlap) {
      newErrors.lesseeUids = "임대자와 임차자는 같을 수 없습니다.";
    }

    if (!propertyUid) newErrors.propertyUid = "매물을 선택해 주세요.";
    if (!status) newErrors.status = "계약 상태를 선택해 주세요.";
    if (deposit && !isValidInteger(deposit)) {
      newErrors.deposit = "유효한 값을 입력해 주세요.";
    } else if (deposit && Number(deposit) < 0) {
      newErrors.deposit = "보증금은 0 이상의 숫자여야 합니다.";
    }
    if (monthlyRent && !isValidInteger(monthlyRent)) {
      newErrors.monthlyRent = "유효한 값을 입력해 주세요.";
    } else if (monthlyRent && Number(monthlyRent) < 0) {
      newErrors.monthlyRent = "월세는 0 이상의 숫자여야 합니다.";
    }

    if (price && !isValidInteger(price)) {
      newErrors.price = "유효한 값을 입력해 주세요.";
    } else if (price && Number(price) < 0) {
      newErrors.price = "매매가는 0 이상의 숫자여야 합니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;

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
      deposit: deposit ? parseInt(deposit, 10) : 0,
      monthlyRent: monthlyRent ? parseInt(monthlyRent, 10) : 0,
      price: price ? parseInt(price, 10) : 0,
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

      // Type assertion for axios error response
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

  const handleModalClose = () => {
    setCategory("");
    setContractDate(null);
    setContractStartDate(null);
    setContractEndDate(null);
    setExpectedContractEndDate(null);
    setDeposit("");
    setMonthlyRent("");
    setPrice("");
    setLessorUids([]);
    setLesseeUids([]);
    setPropertyUid(null);
    setStatus("IN_PROGRESS");
    setFiles([]);
    setErrors({});
    handleClose();
  };

  return (
    <ContractAddModalView
      open={open}
      handleModalClose={handleModalClose}
      category={category}
      setCategory={setCategory}
      contractDate={contractDate}
      setContractDate={setContractDate}
      contractStartDate={contractStartDate}
      setContractStartDate={setContractStartDate}
      contractEndDate={contractEndDate}
      setContractEndDate={setContractEndDate}
      expectedContractEndDate={expectedContractEndDate}
      setExpectedContractEndDate={setExpectedContractEndDate}
      deposit={deposit}
      setDeposit={setDeposit}
      monthlyRent={monthlyRent}
      setMonthlyRent={setMonthlyRent}
      price={price}
      setPrice={setPrice}
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
      errors={errors}
      handleSubmit={handleSubmit}
    />
  );
};

export default ContractAddModal;
