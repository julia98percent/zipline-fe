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
  Autocomplete,
  Chip,
} from "@mui/material";
import { ContractDetail } from "@ts/contract";
import {
  updateContract,
  ContractRequest,
  fetchCustomers,
  CustomerResponse,
} from "@apis/contractService";
import { showToast } from "@components/Toast";

interface ContractPartyEditModalProps {
  open: boolean;
  onClose: () => void;
  contract: ContractDetail;
  onSuccess: () => void;
}

const ContractPartyEditModal = ({
  open,
  onClose,
  contract,
  onSuccess,
}: ContractPartyEditModalProps) => {
  const [selectedLessors, setSelectedLessors] = useState<CustomerResponse[]>(
    []
  );
  const [selectedLessees, setSelectedLessees] = useState<CustomerResponse[]>(
    []
  );
  const [customerOptions, setCustomerOptions] = useState<CustomerResponse[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCustomerOptions = async () => {
      try {
        const customers = await fetchCustomers();
        setCustomerOptions(customers);

        if (contract?.lessorOrSellerInfo) {
          const matchedLessors = contract.lessorOrSellerInfo
            .map((party) => customers.find((c) => c.uid === party.uid))
            .filter(
              (customer): customer is CustomerResponse => customer !== undefined
            );
          setSelectedLessors(matchedLessors);
        }

        if (contract?.lesseeOrBuyerInfo) {
          const matchedLessees = contract.lesseeOrBuyerInfo
            .map((party) => customers.find((c) => c.uid === party.uid))
            .filter(
              (customer): customer is CustomerResponse => customer !== undefined
            );
          setSelectedLessees(matchedLessees);
        }
      } catch (error) {
        console.error("고객 목록 로드 실패:", error);
      }
    };

    if (open) {
      loadCustomerOptions();
    }
  }, [open, contract]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const lessorUids = selectedLessors.map((customer) => customer.uid);
      const lesseeUids = selectedLessees.map((customer) => customer.uid);
      console.log(contract);
      const requestPayload: ContractRequest = {
        category: contract.category,
        contractDate: contract.contractDate,
        contractStartDate: contract.contractStartDate,
        contractEndDate: contract.contractEndDate,
        expectedContractEndDate: contract.expectedContractEndDate,
        deposit: contract.deposit || 0,
        monthlyRent: contract.monthlyRent || 0,
        price: contract.price || 0,
        lessorOrSellerUids: lessorUids,
        lesseeOrBuyerUids: lesseeUids,
        propertyUid: contract.propertyUid,
        status: contract.status,
        other: contract.other || null,
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
      console.error("계약 당사자 정보 수정 실패:", error);
      showToast({
        message: "당사자 정보 수정 중 오류가 발생했습니다.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const getCustomerDisplayName = (customer: CustomerResponse): string => {
    if (customer.phoneNo) {
      const phoneNo = customer.phoneNo.replace(/[^0-9]/g, "");
      const last4Digits = phoneNo.slice(-4);
      return `${customer.name}(${last4Digits})`;
    }
    return `${customer.name}(ID: ${customer.uid})`;
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          계약 당사자 정보 수정
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
          <Autocomplete
            multiple
            options={customerOptions}
            getOptionLabel={getCustomerDisplayName}
            value={selectedLessors}
            onChange={(_, newValue) => {
              setSelectedLessors(newValue);
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={getCustomerDisplayName(option)}
                  {...getTagProps({ index })}
                  key={option.uid}
                />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} label="임대/매도인 선택" />
            )}
          />

          <Autocomplete
            multiple
            options={customerOptions}
            getOptionLabel={getCustomerDisplayName}
            value={selectedLessees}
            onChange={(_, newValue) => {
              setSelectedLessees(newValue);
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={getCustomerDisplayName(option)}
                  {...getTagProps({ index })}
                  key={option.uid}
                />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} label="임차/매수인 선택" />
            )}
          />
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
          disabled={
            selectedLessors.length === 0 ||
            selectedLessees.length === 0 ||
            isLoading
          }
        >
          {isLoading ? "저장 중..." : "저장"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContractPartyEditModal;
