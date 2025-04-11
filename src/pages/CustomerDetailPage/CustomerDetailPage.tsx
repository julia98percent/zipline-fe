import { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Divider,
  Chip,
  Paper,
} from "@mui/material";
import apiClient from "@apis/apiClient";
import { useParams } from "react-router-dom";
import CustomerInfo from "./CustomerInfo";

function CustomerDetailPage() {
  const { customerId } = useParams();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<{
    name: string;
    phoneNo: string;
    trafficSource?: string;
    tenant?: boolean;
    landlord?: boolean;
    buyer?: boolean;
    seller?: boolean;
  } | null>(null);

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

  if (loading || !customer) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 4,
        maxWidth: 800,
        margin: "0 auto",
        backgroundColor: "#f9f9f9",
        borderRadius: 2,
      }}
    >
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            mb: 2,
            fontWeight: "bold",
            textAlign: "center",
            color: "#1565c0",
          }}
        >
          고객 상세 정보
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {/* 고객 정보 */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            이름:{" "}
            <Typography variant="body1" component="span">
              {customer.name}
            </Typography>
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            전화번호:{" "}
            <Typography variant="body1" component="span">
              {customer.phoneNo}
            </Typography>
          </Typography>
          {customer.trafficSource && (
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              유입 경로:{" "}
              <Typography variant="body1" component="span">
                {customer.trafficSource}
              </Typography>
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* 역할 */}
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          역할:
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {customer.tenant && <Chip label="임차인" color="primary" />}
          {customer.landlord && <Chip label="임대인" color="success" />}
          {customer.buyer && <Chip label="구매자" color="info" />}
          {customer.seller && <Chip label="판매자" color="warning" />}
        </Box>
      </Paper>

      <CustomerInfo customerId={customerId} />
    </Box>
  );
}

export default CustomerDetailPage;
