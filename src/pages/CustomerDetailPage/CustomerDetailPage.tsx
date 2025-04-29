import { useState, useEffect } from "react";
import { Box, CircularProgress, Typography, Chip, Paper } from "@mui/material";
import apiClient from "@apis/apiClient";
import { useParams } from "react-router-dom";
import CustomerInfo from "./CustomerInfo";
import PageHeader from "@components/PageHeader/PageHeader";
import useUserStore from "@stores/useUserStore";
import { formatPriceWithKorean } from "@utils/numberUtil";

interface CustomerData {
  uid: number;
  name: string;
  phoneNo: string;
  telProvider: string;
  preferredRegion: string;
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
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const { user } = useUserStore();

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

  const formatBirthDay = (birthDay: string | null) => {
    if (!birthDay) return "-";
    return birthDay.replace(/(\d{4})(\d{2})(\d{2})/, "$1.$2.$3");
  };

  if (loading || !customer) {
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
      <PageHeader title="고객 상세" userName={user?.name || ""} />

      <Box sx={{ p: 3, pt: 0 }}>
        {/* 기본 정보 카드 */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 3, mt: 1 }}>
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
              <Typography variant="body1">{customer.name}</Typography>
            </Box>
            <Box sx={{ flex: "0 0 calc(50% - 8px)" }}>
              <Typography variant="subtitle2" color="textSecondary">
                전화번호
              </Typography>
              <Typography variant="body1">{customer.phoneNo}</Typography>
            </Box>
            <Box sx={{ flex: "0 0 calc(50% - 8px)" }}>
              <Typography variant="subtitle2" color="textSecondary">
                통신사
              </Typography>
              <Typography variant="body1">
                {customer.telProvider || "-"}
              </Typography>
            </Box>
            <Box sx={{ flex: "0 0 calc(50% - 8px)" }}>
              <Typography variant="subtitle2" color="textSecondary">
                희망 지역
              </Typography>
              <Typography variant="body1">
                {customer.preferredRegion || "-"}
              </Typography>
            </Box>
            <Box sx={{ flex: "0 0 calc(50% - 8px)" }}>
              <Typography variant="subtitle2" color="textSecondary">
                생년월일
              </Typography>
              <Typography variant="body1">
                {formatBirthDay(customer.birthDay)}
              </Typography>
            </Box>
            <Box sx={{ flex: "0 0 calc(50% - 8px)" }}>
              <Typography variant="subtitle2" color="textSecondary">
                유입 경로
              </Typography>
              <Typography variant="body1">
                {customer.trafficSource || "-"}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* 역할 정보 + 라벨 카드 */}
        <Paper
          elevation={0}
          sx={{ p: 3, borderRadius: 2, mb: 3, display: "flex", gap: 4 }}
        >
          {/* 역할 정보 영역 */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, color: "#164F9E", fontWeight: "bold" }}
            >
              역할
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
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
            </Box>
          </Box>
          {/* 라벨 영역 */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, color: "#164F9E", fontWeight: "bold" }}
            >
              라벨
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {customer.labels && customer.labels.length > 0 ? (
                customer.labels.map((label) => (
                  <Chip key={label.uid} label={label.name} variant="outlined" />
                ))
              ) : (
                <Typography variant="body1" color="textSecondary">
                  -
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>

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
              <Typography variant="body1">
                {formatPriceWithKorean(customer.minPrice)}
              </Typography>
            </Box>
            <Box sx={{ flex: "0 0 calc(50% - 8px)" }}>
              <Typography variant="subtitle2" color="textSecondary">
                최대 매매가
              </Typography>
              <Typography variant="body1">
                {formatPriceWithKorean(customer.maxPrice)}
              </Typography>
            </Box>
            <Box sx={{ flex: "0 0 calc(50% - 8px)" }}>
              <Typography variant="subtitle2" color="textSecondary">
                최소 보증금
              </Typography>
              <Typography variant="body1">
                {formatPriceWithKorean(customer.minDeposit)}
              </Typography>
            </Box>
            <Box sx={{ flex: "0 0 calc(50% - 8px)" }}>
              <Typography variant="subtitle2" color="textSecondary">
                최대 보증금
              </Typography>
              <Typography variant="body1">
                {formatPriceWithKorean(customer.maxDeposit)}
              </Typography>
            </Box>
            <Box sx={{ flex: "0 0 calc(50% - 8px)" }}>
              <Typography variant="subtitle2" color="textSecondary">
                최소 임대료
              </Typography>
              <Typography variant="body1">
                {formatPriceWithKorean(customer.minRent)}
              </Typography>
            </Box>
            <Box sx={{ flex: "0 0 calc(50% - 8px)" }}>
              <Typography variant="subtitle2" color="textSecondary">
                최대 임대료
              </Typography>
              <Typography variant="body1">
                {formatPriceWithKorean(customer.maxRent)}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* 테이블(탭) 카드 */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
          <CustomerInfo customerId={customerId} />
        </Paper>
      </Box>
    </Box>
  );
}

export default CustomerDetailPage;
