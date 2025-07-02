import { styled } from "@mui/material/styles";
import { Box, Typography, Paper } from "@mui/material";

export const PageContainer = styled(Box)({
  flexGrow: 1,
  backgroundColor: "#f5f5f5",
  minHeight: "100vh",
});

export const DetailPageContainer = styled(Box)(() => ({
  padding: "20px 20px",
  maxWidth: "100%",
  margin: "0 auto",
  backgroundColor: "#f5f5f5",
  minHeight: "100vh",
}));

export const DetailHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(3),
}));

export const HeaderTitle = styled(Typography)({
  fontSize: "1.4rem",
  fontWeight: "bold",
  color: "#333",
});

export const HeaderButtons = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
}));

export const MapContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "400px",
  backgroundColor: "#fff",
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
}));

export const InfoGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

export const InfoCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: "100%",
  borderRadius: theme.spacing(1),
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

export const InfoItem = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.5),
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
}));

export const InfoLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.875rem",
  fontWeight: 600,
  fontFamily: "Pretendard, sans-serif",
}));

export const InfoValue = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "1rem",
  fontWeight: 500,
  fontFamily: "Pretendard, sans-serif",
}));

export const HistorySection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

export const HistoryTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.25rem",
  fontWeight: "bold",
  marginBottom: theme.spacing(2),
}));

export const HistoryList = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
}));
