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
  Autocomplete,
  Chip,
  Tab,
  Tabs,
} from "@mui/material";
import {
  ContractDetail,
  ContractCategory,
  ContractCategoryType,
} from "@ts/contract";
import { CONTRACT_STATUS_OPTION_LIST } from "@constants/contract";
import {
  updateContract,
  fetchProperties,
  fetchCustomers,
  AgentPropertyResponse,
  CustomerResponse,
} from "@apis/contractService";
import { showToast } from "@components/Toast";

interface ContractInfoEditModalProps {
  open: boolean;
  onClose: () => void;
  contract: ContractDetail;
  onSuccess: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`contract-tabpanel-${index}`}
      aria-labelledby={`contract-tab-${index}`}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
};

const ContractInfoEditModal = ({
  open,
  onClose,
  contract,
  onSuccess,
}: ContractInfoEditModalProps) => {
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // 기본 정보 상태
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
  const [selectedPropertyUid, setSelectedPropertyUid] = useState<string>("");

  // 당사자 정보 상태
  const [selectedLessors, setSelectedLessors] = useState<CustomerResponse[]>(
    []
  );
  const [selectedLessees, setSelectedLessees] = useState<CustomerResponse[]>(
    []
  );
  const [customerOptions, setCustomerOptions] = useState<CustomerResponse[]>(
    []
  );

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (open && contract) {
      // 기본 정보 초기화
      setCategory(contract.category || null);
      setStatus(contract.status || "");
      setContractStartDate(contract.contractStartDate || "");
      setContractDate(contract.contractDate || null);
      setContractEndDate(contract.contractEndDate || "");
      setExpectedContractEndDate(contract.expectedContractEndDate || "");
      setPropertyAddress(contract.propertyAddress || "");
      setDeposit(contract.deposit?.toString() || "");
      setMonthlyRent(contract.monthlyRent?.toString() || "");
      setPrice(contract.price?.toString() || "");

      // 당사자 정보 초기화
      setSelectedLessors([]);
      setSelectedLessees([]);
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

        // 당사자 정보 매칭
        if (contract) {
          const matchedLessors = customers.filter((customer) =>
            contract.lessorOrSellerInfo.some(
              (info) => info.uid === customer.uid
            )
          );
          const matchedLessees = customers.filter((customer) =>
            contract.lesseeOrBuyerInfo.some((info) => info.uid === customer.uid)
          );

          setSelectedLessors(matchedLessors);
          setSelectedLessees(matchedLessees);
        }
      } catch (error) {
        console.error("옵션 데이터 로드 실패:", error);
      }
    };

    if (open) {
      loadOptions();
    }
  }, [open, contract]);

  const handlePropertyChange = (propertyUid: string) => {
    setSelectedPropertyUid(propertyUid);
    const selectedProperty = propertyOptions.find(
      (p) => p.uid.toString() === propertyUid
    );
    if (selectedProperty) {
      setPropertyAddress(selectedProperty.address);
    }
  };

  const handleSave = async () => {
    if (!contract) return;

    setIsLoading(true);
    try {
      const formData = new FormData();

      if (category) formData.append("category", category);
      formData.append("status", status);
      if (contractStartDate)
        formData.append("contractStartDate", contractStartDate);
      if (contractDate) formData.append("contractDate", contractDate);
      if (contractEndDate) formData.append("contractEndDate", contractEndDate);
      if (expectedContractEndDate)
        formData.append("expectedContractEndDate", expectedContractEndDate);
      formData.append("propertyAddress", propertyAddress);
      if (selectedPropertyUid)
        formData.append("propertyUid", selectedPropertyUid);
      if (deposit) formData.append("deposit", deposit);
      if (monthlyRent) formData.append("monthlyRent", monthlyRent);
      if (price) formData.append("price", price);

      selectedLessors.forEach((lessor) => {
        formData.append("lessorOrSellerUids", lessor.uid.toString());
      });
      selectedLessees.forEach((lessee) => {
        formData.append("lesseeOrBuyerUids", lessee.uid.toString());
      });

      console.log(
        "계약 정보 업데이트 요청 FormData:",
        Object.fromEntries(formData.entries())
      );

      await updateContract(contract.uid, formData);
      showToast({
        message: "계약 정보가 성공적으로 수정되었습니다.",
        type: "success",
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("계약 정보 수정 실패:", error);
      showToast({ message: "계약 정보 수정에 실패했습니다.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTabValue(0);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          계약 정보 수정
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="contract info tabs"
          >
            <Tab label="기본 정보" />
            <Tab label="당사자 정보" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {/* 기본 정보 탭 */}
          <Box display="flex" flexDirection="column" gap={2}>
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

            <TextField
              fullWidth
              label="계약 시작일"
              type="date"
              value={contractStartDate}
              onChange={(e) => setContractStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              label="계약일"
              type="date"
              value={contractDate || ""}
              onChange={(e) => setContractDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              label="계약 종료일"
              type="date"
              value={contractEndDate}
              onChange={(e) => setContractEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />

            {status === "CANCELLED" && (
              <TextField
                fullWidth
                label="계약 예상 종료일"
                type="date"
                value={expectedContractEndDate}
                onChange={(e) => setExpectedContractEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            )}

            <FormControl fullWidth>
              <InputLabel>매물 선택</InputLabel>
              <Select
                value={selectedPropertyUid}
                onChange={(e) => handlePropertyChange(e.target.value)}
                label="매물 선택"
              >
                {propertyOptions.map((property) => (
                  <MenuItem key={property.uid} value={property.uid.toString()}>
                    {property.address}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="보증금"
              type="number"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
              InputProps={{ endAdornment: "원" }}
            />

            <TextField
              fullWidth
              label="월세"
              type="number"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(e.target.value)}
              InputProps={{ endAdornment: "원" }}
            />

            <TextField
              fullWidth
              label="매매가"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              InputProps={{ endAdornment: "원" }}
            />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* 당사자 정보 탭 */}
          <Box display="flex" flexDirection="column" gap={3}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                임대인/매도인
              </Typography>
              <Autocomplete
                multiple
                options={customerOptions}
                getOptionLabel={(option) =>
                  `${option.name} (${option.phoneNo})`
                }
                value={selectedLessors}
                onChange={(_event, newValue) => {
                  setSelectedLessors(newValue);
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={`${option.name} (${option.phoneNo})`}
                      {...getTagProps({ index })}
                      key={option.uid}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="임대인/매도인을 선택해주세요"
                    variant="outlined"
                  />
                )}
              />
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                임차인/매수인
              </Typography>
              <Autocomplete
                multiple
                options={customerOptions}
                getOptionLabel={(option) =>
                  `${option.name} (${option.phoneNo})`
                }
                value={selectedLessees}
                onChange={(_event, newValue) => {
                  setSelectedLessees(newValue);
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={`${option.name} (${option.phoneNo})`}
                      {...getTagProps({ index })}
                      key={option.uid}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="임차인/매수인을 선택해주세요"
                    variant="outlined"
                  />
                )}
              />
            </Box>
          </Box>
        </TabPanel>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          취소
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={isLoading}>
          {isLoading ? "저장 중..." : "저장"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContractInfoEditModal;
