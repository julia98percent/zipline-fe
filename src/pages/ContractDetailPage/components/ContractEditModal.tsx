import { useEffect, useState, useCallback } from "react";
import dayjs from "dayjs";
import { ContractDetail, ContractDocument } from "@ts/contract";
import {
  fetchContractDetail,
  updateContract,
  fetchProperties,
  fetchCustomers,
  ContractRequest,
  AgentPropertyResponse,
  CustomerResponse,
} from "@apis/contractService";
import { showToast } from "@components/Toast";
import { CONTRACT_STATUS_OPTION_LIST } from "@constants/contract";
import ContractEditModalView, {
  ContractFormData,
} from "./ContractEditModalView";

type ContractStatus = (typeof CONTRACT_STATUS_OPTION_LIST)[number]["value"];

interface Props {
  open: boolean;
  handleClose: () => void;
  fetchContractData: () => void;
  contractUid: number;
  initialData: ContractDetail;
}

interface FormErrors {
  category?: string;
  contractDate?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  expectedContractEndDate?: string;
  deposit?: string;
  monthlyRent?: string;
  price?: string;
  lessorUid?: string;
  lesseeUid?: string;
  propertyUid?: string;
  status?: string;
}

const INITIAL_DATA: ContractFormData = {
  category: null,
  contractDate: null,
  contractStartDate: null,
  contractEndDate: null,
  expectedContractEndDate: null,
  deposit: "",
  monthlyRent: "",
  price: "",
  lessorUids: [],
  lesseeUids: [],
  propertyUid: null,
  status: "",
};

const ContractEditModal = ({
  open,
  handleClose,
  fetchContractData,
  contractUid,
}: Props) => {
  const [formData, setFormData] = useState<ContractFormData>(INITIAL_DATA);

  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [existingDocuments, setExistingDocuments] = useState<
    { documentName: string; documentUrl: string; deleted?: boolean }[]
  >([]);
  const [errors, setErrors] = useState<FormErrors>({});

  const [customerOptions, setCustomerOptions] = useState<CustomerResponse[]>(
    []
  );
  const [propertyOptions, setPropertyOptions] = useState<
    AgentPropertyResponse[]
  >([]);

  const fetchInitialData = useCallback(async () => {
    if (!contractUid) return;

    try {
      const [contractData, properties, customers] = await Promise.all([
        fetchContractDetail(String(contractUid)),
        fetchProperties(),
        fetchCustomers(),
      ]);

      setCustomerOptions(customers);
      setPropertyOptions(properties);

      // Set lessor UIDs
      const lessorUids = (contractData.lessorOrSellerNames ?? [])
        .map((name: string) => {
          const found = customers.find((c) => c.name === name);
          return found ? found.uid : null;
        })
        .filter((uid: number | null): uid is number => uid !== null);

      // Set lessee UIDs
      const lesseeUids = (contractData.lesseeOrBuyerNames ?? [])
        .map((name: string) => {
          const found = customers.find((c) => c.name === name);
          return found ? found.uid : null;
        })
        .filter((uid: number | null): uid is number => uid !== null);

      // Find matching property
      const normalize = (str?: string) =>
        str?.trim().replace(/\\s+/g, "") ?? "";
      const matchedProperty = properties.find(
        (p) => normalize(p.address) === normalize(contractData.propertyAddress)
      );

      setFormData({
        category:
          contractData.category === null || contractData.category === undefined
            ? null
            : contractData.category,
        contractDate: contractData.contractDate
          ? dayjs(contractData.contractDate)
          : null,
        contractStartDate: contractData.contractStartDate
          ? dayjs(contractData.contractStartDate)
          : null,
        contractEndDate: contractData.contractEndDate
          ? dayjs(contractData.contractEndDate)
          : null,
        expectedContractEndDate: contractData.expectedContractEndDate
          ? dayjs(contractData.expectedContractEndDate)
          : null,
        deposit: contractData.deposit?.toString() ?? "",
        monthlyRent: contractData.monthlyRent?.toString() ?? "",
        price: contractData.price?.toString() ?? "",
        lessorUids,
        lesseeUids,
        propertyUid: matchedProperty ? `${matchedProperty.uid}` : null,
        status: (contractData.status ?? "") as ContractStatus | "",
      });

      setExistingDocuments(
        (contractData.documents ?? []).map((doc: ContractDocument) => ({
          documentName: doc.fileName,
          documentUrl: doc.fileUrl,
          deleted: false,
        }))
      );
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
    }
  }, [contractUid]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const updateFormData = (field: keyof ContractFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewFiles((prev) => [...prev, ...Array.from(e.target.files ?? [])]);
    }
  };

  const removeExistingDoc = (idx: number) => {
    const updated = [...existingDocuments];
    updated[idx].deleted = true;
    setExistingDocuments(updated);
  };

  const removeNewFile = (idx: number) => {
    const updated = [...newFiles];
    updated.splice(idx, 1);
    setNewFiles(updated);
  };

  const isValidInteger = (value: string) => {
    if (value === "") return true;
    return /^\\d+$/.test(value);
  };

  const validateInputs = (): boolean => {
    const newErrors: FormErrors = {};

    if (
      formData.contractDate &&
      formData.contractStartDate &&
      formData.contractDate.isAfter(formData.contractStartDate)
    ) {
      newErrors.contractDate = "계약일은 시작일보다 이전이어야 합니다.";
    }

    if (
      formData.contractStartDate &&
      formData.contractEndDate &&
      !formData.contractStartDate.isBefore(formData.contractEndDate)
    ) {
      newErrors.contractStartDate = "시작일은 종료일보다 이전이어야 합니다.";
    }

    if (!formData.lessorUids.length)
      newErrors.lessorUid = "임대/매도자를 선택해 주세요.";
    if (
      formData.lessorUids.length > 1 &&
      formData.lesseeUids.length > 1 &&
      formData.lessorUids.some((id) => formData.lesseeUids.includes(id))
    ) {
      newErrors.lesseeUid = "임대자와 임차자는 같을 수 없습니다.";
    }

    if (!formData.propertyUid) newErrors.propertyUid = "매물을 선택해 주세요.";
    if (!formData.status) newErrors.status = "계약 상태를 선택해 주세요.";

    if (formData.deposit && !isValidInteger(formData.deposit)) {
      newErrors.deposit = "유효한 값을 입력해 주세요.";
    } else if (formData.deposit && Number(formData.deposit) < 0) {
      newErrors.deposit = "보증금은 0 이상의 숫자여야 합니다.";
    }

    if (formData.monthlyRent && !isValidInteger(formData.monthlyRent)) {
      newErrors.monthlyRent = "유효한 값을 입력해 주세요.";
    } else if (formData.monthlyRent && Number(formData.monthlyRent) < 0) {
      newErrors.monthlyRent = "월세는 0 이상의 숫자여야 합니다.";
    }

    if (formData.price && !isValidInteger(formData.price)) {
      newErrors.price = "유효한 값을 입력해 주세요.";
    } else if (formData.price && Number(formData.price) < 0) {
      newErrors.price = "매매가는 0 이상의 숫자여야 합니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    const requestPayload: ContractRequest = {
      category: formData.category,
      contractDate: formData.contractDate?.format("YYYY-MM-DD") ?? null,
      contractStartDate:
        formData.contractStartDate?.format("YYYY-MM-DD") ?? null,
      contractEndDate: formData.contractEndDate?.format("YYYY-MM-DD") ?? null,
      expectedContractEndDate:
        formData.expectedContractEndDate?.format("YYYY-MM-DD") ?? null,
      deposit: formData.deposit ? parseInt(formData.deposit, 10) : 0,
      monthlyRent: formData.monthlyRent
        ? parseInt(formData.monthlyRent, 10)
        : 0,
      price: formData.price ? parseInt(formData.price, 10) : 0,
      lessorOrSellerUids: formData.lessorUids,
      lesseeOrBuyerUids: formData.lesseeUids,
      propertyUid: formData.propertyUid,
      status: formData.status as string,
    };

    const docsToKeep = existingDocuments
      .filter((doc) => !doc.deleted)
      .map((doc) => ({
        fileName: doc.documentName,
        fileUrl: doc.documentUrl,
      }));

    const formDataToSend = new FormData();
    formDataToSend.append(
      "existingDocuments",
      new Blob([JSON.stringify(docsToKeep)], { type: "application/json" })
    );
    formDataToSend.append(
      "contractRequestDTO",
      new Blob([JSON.stringify(requestPayload)], { type: "application/json" })
    );
    newFiles.forEach((file) => formDataToSend.append("files", file));

    try {
      await updateContract(contractUid, formDataToSend);
      showToast({
        message: "계약을 수정했습니다.",
        type: "success",
      });
      fetchContractData();
      handleClose();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "계약 수정에 실패했습니다.";
      showToast({
        message: errorMessage,
        type: "error",
      });
    }
  };

  return (
    <ContractEditModalView
      open={open}
      onClose={handleClose}
      formData={formData}
      onUpdateFormData={updateFormData}
      errors={errors}
      customerOptions={customerOptions}
      propertyOptions={propertyOptions}
      newFiles={newFiles}
      existingDocuments={existingDocuments}
      onFileChange={handleFileChange}
      onRemoveExistingDoc={removeExistingDoc}
      onRemoveNewFile={removeNewFile}
      onSubmit={handleSubmit}
    />
  );
};

export default ContractEditModal;
