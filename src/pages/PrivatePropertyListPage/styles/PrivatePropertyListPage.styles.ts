import { Box, Button, Select } from "@mui/material";
import { styled } from "@mui/material/styles";

export const PageContainer = styled(Box)({
  flexGrow: 1,
  backgroundColor: "#f5f5f5",
  minHeight: "100vh",
});

export const ContentContainer = styled(Box)({
  padding: "0 16px 0 16px",
});

export const FilterGroup = styled(Box)({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
});
export const ButtonGroup = styled(Box)({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginLeft: "auto", // 우측 끝 정렬
  });
  

export const FilterButtonCard = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  padding: "20px 24px",
  marginBottom: "24px",
  gap: "16px",
});

export const FilterButtonWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
});

export const ActionButtonWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  marginLeft: "auto",
  gap: "8px",
});

export const FilterButton = styled(Button)({
  border: "1.5px solid #1976d2",
  color: "#1976d2",
  backgroundColor: "transparent",
  padding: "8px 16px",
  borderRadius: "8px",
  fontWeight: 500,
  fontSize: "14px",
  minWidth: "100px",
  boxShadow: "none",
  transition: "background-color 0.2s ease",
  '&:hover': {
    backgroundColor: "rgba(25, 118, 210, 0.05)",
    boxShadow: "none",
    border: "1.5px solid #1976d2",
  },
});

export const ActionButton = styled(Button)({
  textTransform: "none",
  fontWeight: 500,
  borderRadius: "8px",
  padding: "8px 20px",
});

export const LoadingContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  padding: "24px",
});

export const TopFilterBar = styled(Box)({
    display: "flex",
    justifyContent: "space-between",  // 좌우 정렬
    alignItems: "center",
    flexWrap: "wrap",
    gap: "8px",                        // 최소 간격
    background: "#fff",
    borderRadius: "8px",
    padding: "12px 16px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    marginBottom: "20px",
  });

export const AddressSelectBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  background: "#f5f5f5",
  borderRadius: "8px",
  padding: "8px 12px",
});

export const CategoryButtonGroup = styled(Box)({
  display: "flex",
  gap: "8px",
});

export const TypeButtonGroup = styled(Box)({
  display: "flex",
  gap: "8px",
});

export const StyledSelect = styled(Select)({
  border: "1.5px solid #ccc",
  borderRadius: "18px",
  minHeight: "36px",
  fontSize: "13px",
  paddingLeft: "8px",
  background: "#fff",
  '& .MuiSelect-select': {
    padding: "8px 32px 8px 12px",
    minHeight: "36px",
    display: "flex",
    alignItems: "center",
  },
  '& fieldset': {
    border: "none",
  },
}); 