import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  ContractDetail,
  ContractCategory,
  ContractCategoryType,
} from "@ts/contract";
import { CONTRACT_STATUS_OPTION_LIST } from "@constants/contract";
import {
  ContractRequest,
  updateContract,
  fetchProperties,
  fetchCustomers,
  AgentPropertyResponse,
  CustomerResponse,
} from "@apis/contractService";
import { showToast } from "@components/Toast";

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
  const [category, setCategory] = useState<ContractCategoryType | null>(null);
  const [status, setStatus] = useState<string>("");
  const [contractStartDate, setContractStartDate] = useState<string>("");
  const [contractDate, setContractDate] = useState<string | null>(null);
  const [contractEndDate, setContractEndDate] = useState<string>("");
  const [expectedContractEndDate, setExpectedContractEndDate] =
    useState<string>("");
  const [propertyAddress, setPropertyAddress] = useState<string>("");
  const [deposit, setDeposit] = useState<string>("");
  const [monthlyRent, setMonthlyRent] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [propertyOptions, setPropertyOptions] = useState<
    AgentPropertyResponse[]
  >([]);
  const [customerOptions, setCustomerOptions] = useState<CustomerResponse[]>(
    []
  );
  const [selectedPropertyUid, setSelectedPropertyUid] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && contract) {
      setCategory(contract.category || null);
      setStatus(contract.status || "");
      setContractStartDate(contract.contractStartDate || "");
      setContractEndDate(contract.contractEndDate || "");
      setExpectedContractEndDate(contract.expectedContractEndDate || "");
      setPropertyAddress(contract.propertyAddress || "");
      setDeposit(contract.deposit?.toString() || "");
      setMonthlyRent(contract.monthlyRent?.toString() || "");
      setPrice(contract.price?.toString() || "");
    }
  }, [open, contract]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [properties, customers] = await Promise.all([
          fetchProperties(),
          fetchCustomers(),
        ]);

        setPropertyOptions(properties);
        setCustomerOptions(customers);

        if (contract?.propertyAddress) {
          const normalize = (str?: string) =>
            str?.trim().replace(/\s+/g, "") ?? "";
          const matchedProperty = properties.find(
            (p) => normalize(p.address) === normalize(contract.propertyAddress)
          );
          setSelectedPropertyUid(matchedProperty?.uid.toString() || "");
        }
      } catch (error) {
        console.error("옵션 데이터 로드 실패:", error);
      }
    };

    if (open) {
      loadOptions();
    }
  }, [open, contract?.propertyAddress]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const finalLessorUids =
        contract.lessorOrSellerInfo?.map((party) => party.uid) || [];

      const finalLesseeUids =
        contract.lesseeOrBuyerInfo?.map((party) => party.uid) || [];

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
      console.error("계약 기본 정보 수정 실패:", error);
      showToast({
        message: "계약 정보 수정 중 오류가 발생했습니다.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const formatPrice = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          계약 기본 정보 수정
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>카테고리</InputLabel>
              <Select
                value={category || ""}
                onChange={(e) =>
                  setCategory(e.target.value as ContractCategoryType)
                }
                label="카테고리"
              >
                {Object.entries(ContractCategory).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>상태</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                label="상태"
              >
                {CONTRACT_STATUS_OPTION_LIST.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="계약일"
              type="date"
              value={contractDate}
              onChange={(e) => setContractDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <TextField
              label="계약 시작일"
              type="date"
              value={contractStartDate}
              onChange={(e) => setContractStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <TextField
              label="계약 종료일"
              type="date"
              value={contractEndDate}
              onChange={(e) => setContractEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>

          {status === "CANCELLED" && (
            <TextField
              label="계약 예상 종료일"
              type="date"
              value={expectedContractEndDate}
              onChange={(e) => setExpectedContractEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          )}

          <FormControl fullWidth>
            <InputLabel>매물 선택</InputLabel>
            <Select
              value={selectedPropertyUid}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedPropertyUid(value);
                // 선택된 매물의 주소로 propertyAddress 업데이트
                const selectedProperty = propertyOptions.find(
                  (p) => p.uid.toString() === value
                );
                setPropertyAddress(selectedProperty?.address || "");
              }}
              label="매물 선택"
            >
              {propertyOptions.map((property) => (
                <MenuItem key={property.uid} value={property.uid.toString()}>
                  {property.address}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="보증금 (원)"
              value={formatPrice(deposit)}
              onChange={(e) => setDeposit(e.target.value.replace(/,/g, ""))}
              fullWidth
              placeholder="0"
            />

            <TextField
              label="월세 (원)"
              value={formatPrice(monthlyRent)}
              onChange={(e) => setMonthlyRent(e.target.value.replace(/,/g, ""))}
              fullWidth
              placeholder="0"
            />

            <TextField
              label="매매가 (원)"
              value={formatPrice(price)}
              onChange={(e) => setPrice(e.target.value.replace(/,/g, ""))}
              fullWidth
              placeholder="0"
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit" disabled={isLoading}>
          취소
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!category || !status || !selectedPropertyUid || isLoading}
        >
          {isLoading ? "저장 중..." : "저장"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContractBasicInfoEditModal;
