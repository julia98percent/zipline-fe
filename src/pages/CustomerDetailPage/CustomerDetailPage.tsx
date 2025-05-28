import { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Chip,
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Autocomplete,
} from "@mui/material";
import apiClient from "@apis/apiClient";
import { useParams, useNavigate } from "react-router-dom";
import CustomerInfo from "./CustomerInfo";
import PageHeader from "@components/PageHeader/PageHeader";
import { formatPriceWithKorean } from "@utils/numberUtil";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import DeleteConfirmModal from "@components/DeleteConfirm/DeleteConfirmModal";
import RegionSelect from "@components/RegionSelect/RegionSelect";
import { formatPhoneNumber } from "@utils/numberUtil";
import { showToast } from "@components/Toast/Toast";

interface CustomerData {
  uid: number;
  name: string;
  phoneNo: string;
  telProvider: string;
  preferredRegion: string;
  legalDistrictCode: number | null;
  minRent: number | null;
  maxRent: number | null;
  trafficSource: string;
  maxPrice: number | null;
  minPrice: number | null;
  minDeposit: number | null;
  maxDeposit: number | null;
  birthDay: string | null;
  tenant: boolean;
  landlord: boolean;
  buyer: boolean;
  seller: boolean;
  labels: {
    uid: number;
    name: string;
  }[];
}

function CustomerDetailPage() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState<CustomerData | null>(
    null
  );
  const [availableLabels, setAvailableLabels] = useState<
    { uid: number; name: string }[]
  >([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const MAX_PRICE_LENGTH = 15; // 천조 단위까지 허용 (999조)

  const formatSafePrice = (price: number | null | undefined): string => {
    if (price === undefined || price === null) return "-";
    const priceStr = price.toString();
    if (priceStr.length > MAX_PRICE_LENGTH) {
      return "금액이 너무 큽니다";
    }
    return formatPriceWithKorean(price) || "-";
  };

  const getFormattedPrice = (price: number | null | undefined): string => {
    if (price === undefined || price === null) return "-";
    return formatPriceWithKorean(price) || "-";
  };

  const fetchCustomerData = () => {
    setLoading(true);
    apiClient
      .get(`/customers/${customerId}`)
      .then((res) => {
        const customerData = res?.data?.data;
        if (customerData) {
          setCustomer(customerData);
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  useEffect(() => {
    if (isEditing) {
      apiClient
        .get("/labels")
        .then((res) => {
          if (res.data?.data?.labels) {
            setAvailableLabels(res.data.data.labels);
          }
        })
        .catch(console.error);
    }
  }, [isEditing]);

  const formatBirthDay = (birthDay: string | null) => {
    if (!birthDay) return "-";
    return birthDay.replace(/(\d{4})(\d{2})(\d{2})/, "$1.$2.$3");
  };

  const handleEditClick = () => {
    if (customer) {
      const editedData = {
        ...customer,
        legalDistrictCode: customer.legalDistrictCode,
        preferredRegion: customer.preferredRegion,
        minRent: customer.minRent || null,
        maxRent: customer.maxRent || null,
        minPrice: customer.minPrice || null,
        maxPrice: customer.maxPrice || null,
        minDeposit: customer.minDeposit || null,
        maxDeposit: customer.maxDeposit || null,
        birthDay: customer.birthDay || null,
        labels: [...(customer.labels || [])],
      };

      setEditedCustomer(editedData);
    }
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedCustomer(null);
    setIsEditing(false);
  };

  const handleInputChange = (
    field: keyof CustomerData,
    value: string | number | boolean | null | { uid: number; name: string }[]
  ) => {
    if (!editedCustomer) return;

    // null 값 처리를 명시적으로
    const processedValue = value === "" ? null : value;
    const updated = {
      ...editedCustomer,
      [field]: processedValue,
    };

    setEditedCustomer(updated);
  };

  // RegionSelect 변경 핸들러를 별도 함수로 분리
  const handleRegionChange = (value: { code: number | null; name: string }) => {
    if (!editedCustomer) return;

    const updated = {
      ...editedCustomer,
      legalDistrictCode: value.code,
      preferredRegion: value.name,
    };

    setEditedCustomer(updated);
  };

  const handleSaveEdit = async () => {
    if (!editedCustomer) return;

    try {
      if (!editedCustomer.name) {
        showToast({
          message: "이름을 입력해주세요.",
          type: "error",
        });
        return;
      }
      if (!editedCustomer.phoneNo) {
        showToast({
          message: "전화번호를 입력해주세요.",
          type: "error",
        });
        return;
      }
      if (editedCustomer.birthDay && !/^\d{8}$/.test(editedCustomer.birthDay)) {
        showToast({
          message: "생년월일을 올바르게 입력해주세요. ex)19910501",
          type: "error",
        });
        return;
      }

      const requestData = {
        name: editedCustomer.name,
        phoneNo: formatPhoneNumber(editedCustomer.phoneNo),
        telProvider: editedCustomer.telProvider,
        legalDistrictCode: editedCustomer.legalDistrictCode,
        minRent: editedCustomer.minRent,
        maxRent: editedCustomer.maxRent,
        trafficSource: editedCustomer.trafficSource || null,
        landlord: editedCustomer.landlord,
        tenant: editedCustomer.tenant,
        buyer: editedCustomer.buyer,
        seller: editedCustomer.seller,
        maxPrice: editedCustomer.maxPrice,
        minPrice: editedCustomer.minPrice,
        minDeposit: editedCustomer.minDeposit,
        maxDeposit: editedCustomer.maxDeposit,
        birthday: editedCustomer.birthDay,
        labelUids: editedCustomer.labels.map((label) => label.uid),
      };

      const response = await apiClient.put(
        `/customers/${customerId}`,
        requestData
      );

      if (response.status === 200) {
        showToast({
          message: "고객 정보를 수정했습니다.",
          type: "success",
        });
        setIsEditing(false);
        fetchCustomerData();
      }
    } catch (error: any) {
      console.error("Failed to update customer:", error);
      showToast({
        message:
          error.response?.data?.message || "고객 정보 수정에 실패했습니다.",
        type: "error",
      });
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await apiClient.delete(`/customers/${customerId}`);
      if (response.status === 200) {
        showToast({
          message: "고객을 삭제했습니다.",
          type: "success",
        });
        navigate("/customers");
      }
    } catch (error) {
      console.error("Failed to delete customer:", error);
      toast.error("고객 삭제에 실패했습니다.");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  if (loading || !customer || !customerId) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          height: "calc(100vh - 64px)",
          overflow: "auto",
          width: "calc(100% - 240px)",
          ml: "240px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
        backgroundColor: "#f5f5f5",
        p: 0,
        maxWidth: { xs: "100%", md: "calc(100vw - 240px)" },
        boxSizing: "border-box",
      }}
    >
      <PageHeader title="고객 상세" />

      <Box sx={{ p: 3, pt: 0 }}>
        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          {isEditing ? (
            <div style={{ marginTop: "16px", display: "flex" }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleCancelEdit}
                sx={{
                  mr: 1,
                  backgroundColor: "white",
                  minWidth: "81px",
                  "&:hover": {
                    backgroundColor: "#F5F5F5",
                  },
                }}
              >
                취소
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveEdit}
                sx={{
                  boxShadow: "none",
                  backgroundColor: "#164F9E",
                  minWidth: "81px",
                  "&:hover": {
                    backgroundColor: "#164F9E",
                    opacity: 0.9,
                    boxShadow: "none",
                  },
                }}
              >
                저장
              </Button>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "16px",
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                startIcon={<EditIcon />}
                onClick={handleEditClick}
                sx={{
                  mr: 1,
                  color: "#164F9E",
                  minHeight: "32px",
                  marginLeft: "12px",
                  backgroundColor: "white",
                }}
              >
                수정
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteClick}
                sx={{
                  backgroundColor: "white",
                }}
              >
                삭제
              </Button>
            </div>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
          {/* 기본 정보 카드 */}
          <Paper elevation={0} sx={{ flex: 2, p: 3, borderRadius: 2, mt: 1 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, color: "#164F9E", fontWeight: "bold" }}
            >
              기본 정보
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Box sx={{ flex: "0 0 calc(50% - 8px)" }}>
                <Typography variant="subtitle2" color="textSecondary">
                  이름
                </Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    size="small"
                    value={editedCustomer?.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                ) : (
                  <Typography variant="body1">{customer.name}</Typography>
                )}
              </Box>
              <Box sx={{ flex: "0 0 calc(50% - 8px)" }}>
                <Typography variant="subtitle2" color="textSecondary">
                  전화번호
                </Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    size="small"
                    value={formatPhoneNumber(editedCustomer?.phoneNo ?? "")}
                    onChange={(e) =>
                      handleInputChange("phoneNo", e.target.value)
                    }
                  />
                ) : (
                  <Typography variant="body1">{customer.phoneNo}</Typography>
                )}
              </Box>
              <Box sx={{ flex: "0 0 calc(50% - 8px)" }}>
                <Typography variant="subtitle2" color="textSecondary">
                  통신사
                </Typography>
                {isEditing ? (
                  <FormControl fullWidth size="small">
                    <Select
                      value={editedCustomer?.telProvider || ""}
                      onChange={(e) =>
                        handleInputChange("telProvider", e.target.value)
                      }
                    >
                      <MenuItem value="SKT">SKT</MenuItem>
                      <MenuItem value="KT">KT</MenuItem>
                      <MenuItem value="LGU+">LGU+</MenuItem>
                      <MenuItem value="SKT 알뜰폰">SKT 알뜰폰</MenuItem>
                      <MenuItem value="KT 알뜰폰">KT 알뜰폰</MenuItem>
                      <MenuItem value="LGU+ 알뜰폰">LGU+ 알뜰폰</MenuItem>
                    </Select>
                  </FormControl>
                ) : (
                  <Typography variant="body1">
                    {customer.telProvider || "-"}
                  </Typography>
                )}
              </Box>
              <Box sx={{ flex: "0 0 calc(50% - 8px)" }}>
                <Typography variant="subtitle2" color="textSecondary">
                  희망 지역
                </Typography>
                {isEditing ? (
                  <RegionSelect
                    value={{
                      code: editedCustomer?.legalDistrictCode ?? null,
                      name: editedCustomer?.preferredRegion ?? "",
                    }}
                    onChange={handleRegionChange}
                    disabled={false}
                  />
                ) : (
                  <Typography variant="body1">
                    {customer.preferredRegion || "-"}
                  </Typography>
                )}
              </Box>
              <Box sx={{ flex: "0 0 calc(50% - 8px)" }}>
                <Typography variant="subtitle2" color="textSecondary">
                  생년월일
                </Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    size="small"
                    value={editedCustomer?.birthDay || ""}
                    onChange={(e) =>
                      handleInputChange("birthDay", e.target.value)
                    }
                    placeholder="YYYYMMDD"
                  />
                ) : (
                  <Typography variant="body1">
                    {formatBirthDay(customer.birthDay)}
                  </Typography>
                )}
              </Box>
              <Box sx={{ flex: "0 0 calc(50% - 8px)" }}>
                <Typography variant="subtitle2" color="textSecondary">
                  유입 경로
                </Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    size="small"
                    value={editedCustomer?.trafficSource || ""}
                    onChange={(e) =>
                      handleInputChange("trafficSource", e.target.value)
                    }
                  />
                ) : (
                  <Typography variant="body1">
                    {customer.trafficSource || "-"}
                  </Typography>
                )}
              </Box>
            </Box>
          </Paper>

          {/* 역할 정보 + 라벨 카드 */}
          <Paper elevation={0} sx={{ flex: 1, p: 3, borderRadius: 2, mt: 1 }}>
            {/* 역할 정보 영역 */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{ mb: 2, color: "#164F9E", fontWeight: "bold" }}
              >
                역할
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {isEditing ? (
                  <>
                    <Chip
                      label="임차인"
                      onClick={() =>
                        handleInputChange("tenant", !editedCustomer?.tenant)
                      }
                      sx={{
                        backgroundColor: editedCustomer?.tenant
                          ? "#FEF5EB"
                          : "#F5F5F5",
                        color: editedCustomer?.tenant ? "#F2994A" : "#757575",
                        cursor: "pointer",
                      }}
                    />
                    <Chip
                      label="임대인"
                      onClick={() =>
                        handleInputChange("landlord", !editedCustomer?.landlord)
                      }
                      sx={{
                        backgroundColor: editedCustomer?.landlord
                          ? "#FDEEEE"
                          : "#F5F5F5",
                        color: editedCustomer?.landlord ? "#EB5757" : "#757575",
                        cursor: "pointer",
                      }}
                    />
                    <Chip
                      label="매수인"
                      onClick={() =>
                        handleInputChange("buyer", !editedCustomer?.buyer)
                      }
                      sx={{
                        backgroundColor: editedCustomer?.buyer
                          ? "#E9F7EF"
                          : "#F5F5F5",
                        color: editedCustomer?.buyer ? "#219653" : "#757575",
                        cursor: "pointer",
                      }}
                    />
                    <Chip
                      label="매도인"
                      onClick={() =>
                        handleInputChange("seller", !editedCustomer?.seller)
                      }
                      sx={{
                        backgroundColor: editedCustomer?.seller
                          ? "#EBF2FC"
                          : "#F5F5F5",
                        color: editedCustomer?.seller ? "#2F80ED" : "#757575",
                        cursor: "pointer",
                      }}
                    />
                  </>
                ) : (
                  <>
                    {customer.tenant && (
                      <Chip
                        label="임차인"
                        sx={{ backgroundColor: "#FEF5EB", color: "#F2994A" }}
                      />
                    )}
                    {customer.landlord && (
                      <Chip
                        label="임대인"
                        sx={{ backgroundColor: "#FDEEEE", color: "#EB5757" }}
                      />
                    )}
                    {customer.buyer && (
                      <Chip
                        label="매수인"
                        sx={{ backgroundColor: "#E9F7EF", color: "#219653" }}
                      />
                    )}
                    {customer.seller && (
                      <Chip
                        label="매도인"
                        sx={{ backgroundColor: "#EBF2FC", color: "#2F80ED" }}
                      />
                    )}
                    {!customer.tenant &&
                      !customer.landlord &&
                      !customer.buyer &&
                      !customer.seller && (
                        <Chip
                          label="없음"
                          sx={{
                            backgroundColor: "#F5F5F5",
                            color: "#757575",
                          }}
                        />
                      )}
                  </>
                )}
              </Box>
            </Box>
            {/* 라벨 영역 */}
            <Box>
              <Typography
                variant="h6"
                sx={{ mb: 2, color: "#164F9E", fontWeight: "bold" }}
              >
                라벨
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {isEditing ? (
                  <Autocomplete
                    multiple
                    size="small"
                    options={availableLabels}
                    value={editedCustomer?.labels || []}
                    getOptionLabel={(option) => option.name}
                    onChange={(_, newValue) => {
                      handleInputChange("labels", newValue);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={option.uid}
                          label={option.name}
                          size="small"
                          variant="outlined"
                        />
                      ))
                    }
                    isOptionEqualToValue={(option, value) =>
                      option.uid === value.uid
                    }
                    sx={{ width: "100%" }}
                  />
                ) : (
                  <>
                    {customer.labels && customer.labels.length > 0 ? (
                      customer.labels.map((label) => (
                        <Chip
                          key={label.uid}
                          label={label.name}
                          variant="outlined"
                        />
                      ))
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        -
                      </Typography>
                    )}
                  </>
                )}
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* 가격 정보 카드 */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, color: "#164F9E", fontWeight: "bold" }}
          >
            희망 거래 가격
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ flex: "0 0 calc(50% - 8px)" }}>
              <Typography variant="subtitle2" color="textSecondary">
                최소 매매가
              </Typography>
              {isEditing ? (
                <>
                  <TextField
                    fullWidth
                    size="small"
                    value={editedCustomer?.minPrice || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      if (!value) {
                        handleInputChange("minPrice", null);
                      } else if (value.length <= MAX_PRICE_LENGTH) {
                        handleInputChange("minPrice", Number(value));
                      }
                    }}
                    placeholder="숫자만 입력"
                    inputProps={{ maxLength: MAX_PRICE_LENGTH }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color:
                        editedCustomer?.minPrice &&
                        editedCustomer.minPrice.toString().length >
                          MAX_PRICE_LENGTH
                          ? "error.main"
                          : "text.secondary",
                      mt: 0.5,
                      display: "block",
                    }}
                  >
                    {formatSafePrice(editedCustomer?.minPrice)}
                  </Typography>
                </>
              ) : (
                <Typography variant="body1">
                  {getFormattedPrice(customer.minPrice)}
                </Typography>
              )}
            </Box>
            <Box sx={{ flex: "0 0 calc(50% - 8px)" }}>
              <Typography variant="subtitle2" color="textSecondary">
                최대 매매가
              </Typography>
              {isEditing ? (
                <>
                  <TextField
                    fullWidth
                    size="small"
                    value={editedCustomer?.maxPrice || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      if (value.length <= MAX_PRICE_LENGTH) {
                        handleInputChange(
                          "maxPrice",
                          value ? Number(value) : null
                        );
                      }
                    }}
                    placeholder="숫자만 입력"
                    inputProps={{ maxLength: MAX_PRICE_LENGTH }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", mt: 0.5, display: "block" }}
                  >
                    {formatSafePrice(editedCustomer?.maxPrice)}
                  </Typography>
                </>
              ) : (
                <Typography variant="body1">
                  {formatSafePrice(customer.maxPrice)}
                </Typography>
              )}
            </Box>
            <Box sx={{ flex: "0 0 calc(50% - 8px)" }}>
              <Typography variant="subtitle2" color="textSecondary">
                최소 보증금
              </Typography>
              {isEditing ? (
                <>
                  <TextField
                    fullWidth
                    size="small"
                    value={editedCustomer?.minDeposit || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      handleInputChange(
                        "minDeposit",
                        value ? Number(value) : null
                      );
                    }}
                    placeholder="숫자만 입력"
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", mt: 0.5, display: "block" }}
                  >
                    {formatSafePrice(editedCustomer?.minDeposit)}
                  </Typography>
                </>
              ) : (
                <Typography variant="body1">
                  {formatSafePrice(customer.minDeposit)}
                </Typography>
              )}
            </Box>
            <Box sx={{ flex: "0 0 calc(50% - 8px)" }}>
              <Typography variant="subtitle2" color="textSecondary">
                최대 보증금
              </Typography>
              {isEditing ? (
                <>
                  <TextField
                    fullWidth
                    size="small"
                    value={editedCustomer?.maxDeposit || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      handleInputChange(
                        "maxDeposit",
                        value ? Number(value) : null
                      );
                    }}
                    placeholder="숫자만 입력"
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", mt: 0.5, display: "block" }}
                  >
                    {formatSafePrice(editedCustomer?.maxDeposit)}
                  </Typography>
                </>
              ) : (
                <Typography variant="body1">
                  {formatSafePrice(customer.maxDeposit)}
                </Typography>
              )}
            </Box>
            <Box sx={{ flex: "0 0 calc(50% - 8px)" }}>
              <Typography variant="subtitle2" color="textSecondary">
                최소 임대료
              </Typography>
              {isEditing ? (
                <>
                  <TextField
                    fullWidth
                    size="small"
                    value={editedCustomer?.minRent || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      handleInputChange(
                        "minRent",
                        value ? Number(value) : null
                      );
                    }}
                    placeholder="숫자만 입력"
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", mt: 0.5, display: "block" }}
                  >
                    {formatSafePrice(editedCustomer?.minRent)}
                  </Typography>
                </>
              ) : (
                <Typography variant="body1">
                  {formatSafePrice(customer.minRent)}
                </Typography>
              )}
            </Box>
            <Box sx={{ flex: "0 0 calc(50% - 8px)" }}>
              <Typography variant="subtitle2" color="textSecondary">
                최대 임대료
              </Typography>
              {isEditing ? (
                <>
                  <TextField
                    fullWidth
                    size="small"
                    value={editedCustomer?.maxRent || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      handleInputChange(
                        "maxRent",
                        value ? Number(value) : null
                      );
                    }}
                    placeholder="숫자만 입력"
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", mt: 0.5, display: "block" }}
                  >
                    {formatSafePrice(editedCustomer?.maxRent)}
                  </Typography>
                </>
              ) : (
                <Typography variant="body1">
                  {formatSafePrice(customer.maxRent)}
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>

        {/* 테이블(탭) 카드 */}
        {!isEditing && (
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <CustomerInfo customerId={customerId} />
          </Paper>
        )}
      </Box>

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        category="고객"
      />
    </Box>
  );
}

export default CustomerDetailPage;
