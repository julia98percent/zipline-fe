import { useState, useEffect, useCallback } from "react";
import { ContractDetail, ContractCategoryType } from "@ts/contract";
import {
  ContractRequest,
  updateContract,
  fetchProperties,
  fetchCustomers,
  AgentPropertyResponse,
  CustomerResponse,
} from "@apis/contractService";
import { showToast } from "@components/Toast";
import ContractBasicInfoEditModalView from "./ContractBasicInfoEditModalView";

interface ContractBasicInfoEditModalProps {
  open: boolean;
  onClose: () => void;
  contract: ContractDetail;
  onSuccess: () => void;
}

const ContractBasicInfoEditModal = ({
  open,
  onClose,
  contract,
  onSuccess,
}: ContractBasicInfoEditModalProps) => {
  // Form state
  const [category, setCategory] = useState<ContractCategoryType | null>(null);
  const [status, setStatus] = useState<string>("");
  const [contractStartDate, setContractStartDate] = useState<string>("");
  const [contractDate, setContractDate] = useState<string | null>(null);
  const [contractEndDate, setContractEndDate] = useState<string>("");
  const [expectedContractEndDate, setExpectedContractEndDate] =
    useState<string>("");
  const [deposit, setDeposit] = useState<string>("");
  const [monthlyRent, setMonthlyRent] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [other, setOther] = useState<string>("");
  const [selectedLessors, setSelectedLessors] = useState<CustomerResponse[]>(
    []
  );
  const [selectedLessees, setSelectedLessees] = useState<CustomerResponse[]>(
    []
  );
  const [selectedPropertyUid, setSelectedPropertyUid] = useState<string>("");

  // Options state
  const [propertyOptions, setPropertyOptions] = useState<
    AgentPropertyResponse[]
  >([]);
  const [customerOptions, setCustomerOptions] = useState<CustomerResponse[]>(
    []
  );

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form data when contract changes
  useEffect(() => {
    if (open && contract) {
      setCategory(contract.category || null);
      setStatus(contract.status || "");
      setContractStartDate(contract.contractStartDate || "");
      setContractEndDate(contract.contractEndDate || "");
      setExpectedContractEndDate(contract.expectedContractEndDate || "");
      setDeposit(contract.deposit?.toString() || "");
      setMonthlyRent(contract.monthlyRent?.toString() || "");
      setPrice(contract.price?.toString() || "");
      setOther(contract.other || "");
    }
  }, [open, contract]);

  // Load options and initialize selections
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [properties, customers] = await Promise.all([
          fetchProperties(),
          fetchCustomers(),
        ]);

        setPropertyOptions(properties);
        setCustomerOptions(customers);

        // Initialize property selection
        if (contract?.propertyAddress) {
          const normalize = (str?: string) =>
            str?.trim().replace(/\s+/g, "") ?? "";
          const matchedProperty = properties.find(
            (p) => normalize(p.address) === normalize(contract.propertyAddress)
          );
          setSelectedPropertyUid(matchedProperty?.uid.toString() || "");
        }

        // Initialize lessor selection
        if (contract?.lessorOrSellerInfo) {
          const matchedLessors = contract.lessorOrSellerInfo
            .map((party) => customers.find((c) => c.uid === party.uid))
            .filter(
              (customer): customer is CustomerResponse => customer !== undefined
            );
          setSelectedLessors(matchedLessors);
        }

        // Initialize lessee selection
        if (contract?.lesseeOrBuyerInfo) {
          const matchedLessees = contract.lesseeOrBuyerInfo
            .map((party) => customers.find((c) => c.uid === party.uid))
            .filter(
              (customer): customer is CustomerResponse => customer !== undefined
            );
          setSelectedLessees(matchedLessees);
        }
      } catch (error) {
        console.error("옵션 데이터 로드 실패:", error);
      }
    };

    if (open) {
      loadOptions();
    }
  }, [
    open,
    contract?.propertyAddress,
    contract?.lessorOrSellerInfo,
    contract?.lesseeOrBuyerInfo,
  ]);

  // Event handlers
  const handleCategoryChange = useCallback((value: ContractCategoryType) => {
    setCategory(value);
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setStatus(value);
  }, []);

  const handleContractStartDateChange = useCallback((value: string) => {
    setContractStartDate(value);
  }, []);

  const handleContractDateChange = useCallback((value: string) => {
    setContractDate(value);
  }, []);

  const handleContractEndDateChange = useCallback((value: string) => {
    setContractEndDate(value);
  }, []);

  const handleExpectedContractEndDateChange = useCallback((value: string) => {
    setExpectedContractEndDate(value);
  }, []);

  const handleDepositChange = useCallback((value: string) => {
    setDeposit(value);
  }, []);

  const handleMonthlyRentChange = useCallback((value: string) => {
    setMonthlyRent(value);
  }, []);

  const handlePriceChange = useCallback((value: string) => {
    setPrice(value);
  }, []);

  const handleOtherChange = useCallback((value: string) => {
    setOther(value);
  }, []);

  const handleSelectedLessorsChange = useCallback(
    (value: CustomerResponse[]) => {
      setSelectedLessors(value);
    },
    []
  );

  const handleSelectedLesseesChange = useCallback(
    (value: CustomerResponse[]) => {
      setSelectedLessees(value);
    },
    []
  );

  const handleSelectedPropertyUidChange = useCallback((value: string) => {
    setSelectedPropertyUid(value);
  }, []);

  // Submit handler
  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    try {
      const finalLessorUids = selectedLessors.map((customer) => customer.uid);
      const finalLesseeUids = selectedLessees.map((customer) => customer.uid);

      const requestPayload: ContractRequest = {
        category,
        contractDate: contract.contractDate,
        contractStartDate,
        contractEndDate,
        expectedContractEndDate,
        deposit: deposit ? parseInt(deposit.replace(/,/g, "")) : 0,
        monthlyRent: monthlyRent ? parseInt(monthlyRent.replace(/,/g, "")) : 0,
        price: price ? parseInt(price.replace(/,/g, "")) : 0,
        lessorOrSellerUids: finalLessorUids,
        lesseeOrBuyerUids: finalLesseeUids,
        propertyUid: contract.propertyUid,
        status,
        other: other || null,
      };

      const docsToKeep = contract.documents.map((doc) => ({
        fileName: doc.fileName,
        fileUrl: doc.fileUrl,
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

      await updateContract(contract.uid, formDataToSend);

      onSuccess();
      onClose();
    } catch (error) {
      console.error("계약 정보 수정 실패:", error);
      showToast({
        message: "계약 정보 수정 중 오류가 발생했습니다.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedLessors,
    selectedLessees,
    category,
    contract,
    contractStartDate,
    contractEndDate,
    expectedContractEndDate,
    deposit,
    monthlyRent,
    price,
    status,
    other,
    onSuccess,
    onClose,
  ]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Helper functions
  const formatPrice = useCallback((value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }, []);

  const getCustomerDisplayName = useCallback(
    (customer: CustomerResponse): string => {
      if (customer.phoneNo) {
        const phoneNo = customer.phoneNo.replace(/[^0-9]/g, "");
        const last4Digits = phoneNo.slice(-4);
        return `${customer.name}(${last4Digits})`;
      }
      return `${customer.name}(ID: ${customer.uid})`;
    },
    []
  );

  return (
    <ContractBasicInfoEditModalView
      open={open}
      onClose={handleClose}
      isLoading={isLoading}
      category={category}
      status={status}
      contractStartDate={contractStartDate}
      contractDate={contractDate}
      contractEndDate={contractEndDate}
      expectedContractEndDate={expectedContractEndDate}
      deposit={deposit}
      monthlyRent={monthlyRent}
      price={price}
      other={other}
      selectedLessors={selectedLessors}
      selectedLessees={selectedLessees}
      selectedPropertyUid={selectedPropertyUid}
      propertyOptions={propertyOptions}
      customerOptions={customerOptions}
      onCategoryChange={handleCategoryChange}
      onStatusChange={handleStatusChange}
      onContractStartDateChange={handleContractStartDateChange}
      onContractDateChange={handleContractDateChange}
      onContractEndDateChange={handleContractEndDateChange}
      onExpectedContractEndDateChange={handleExpectedContractEndDateChange}
      onDepositChange={handleDepositChange}
      onMonthlyRentChange={handleMonthlyRentChange}
      onPriceChange={handlePriceChange}
      onOtherChange={handleOtherChange}
      onSelectedLessorsChange={handleSelectedLessorsChange}
      onSelectedLesseesChange={handleSelectedLesseesChange}
      onSelectedPropertyUidChange={handleSelectedPropertyUidChange}
      onSubmit={handleSubmit}
      formatPrice={formatPrice}
      getCustomerDisplayName={getCustomerDisplayName}
    />
  );
};

export default ContractBasicInfoEditModal;
