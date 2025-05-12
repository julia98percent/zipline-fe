import { Box, Button, Select } from "@mui/material";
import { styled } from "@mui/material/styles";

export const PageContainer = styled(Box)({
  flexGrow: 1,
  backgroundColor: "#f5f5f5",
  minHeight: "100vh",
});

export const ContentContainer = styled(Box)({
  padding: "20px 20px 20px 20px",
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
    marginLeft: "auto",
  });
  

export const FilterButtonCard = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  padding: "20px 24px",
  marginBottom: "28px",
  gap: "20px",
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
  border: "1px solid #1976d2",
  color: "#1976d2",
  backgroundColor: "transparent",
  padding: "4px 31px",
  borderRadius: "20px",
  fontWeight: 400,
  fontSize: "14px",
  minWidth: "100px",
  boxShadow: "none",
  transition: "background-color 0.2s ease",
  '&:hover': {
    backgroundColor: "rgba(25, 118, 210, 0.05)",
    boxShadow: "none",
    border: "1px solid #1976d2",
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
  flexDirection: "column",
  gap: "18px",
  background: "#fff",
  borderRadius: "8px",
  padding: "12px 16px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  marginBottom: "20px",
});

export const FilterContainer = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
});

export const LeftButtonGroup = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "16px",
});

export const RightButtonGroup = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginLeft: "auto",
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
  border: "1.5px solid #E0E0E0",
  borderRadius: "20px",
  minHeight: "32px",
  fontSize: "13px",
  fontWeight: 400,
  fontFamily: "'Pretendard', sans-serif",
  background: "#fff",
  '& .MuiSelect-select': {
    padding: "8px 28px 8px 12px",
    minHeight: "32px",
    display: "flex",
    alignItems: "center",
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: "none",
  },
  '& .MuiSvgIcon-root': {
    right: '8px',
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    right: '32px',
    top: '50%',
    transform: 'translateY(-50%)',
    height: '16px',
    width: '1px',
    backgroundColor: '#E0E0E0',
  },
  '& .MuiSelect-icon': {
    color: '#666666',
  },
  '&:hover': {
    border: "1.5px solid #1976d2",
  },
  '&.Mui-focused': {
    border: "1.5px solid #1976d2",
  },
});

// MenuItem 스타일을 위한 공통 스타일 객체
export const menuItemStyles = {
  fontSize: "14px",
  fontWeight: 400,
  fontFamily: "'Pretendard', sans-serif",
  padding: "8px 16px",
  '&:hover': {
    backgroundColor: 'rgba(25, 118, 210, 0.08)',
  },
  '&.Mui-selected': {
    backgroundColor: 'rgba(25, 118, 210, 0.12)',
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.16)',
    },
  },
};

// Select 메뉴 스타일을 위한 공통 스타일 객체
export const selectMenuProps = {
  PaperProps: {
    sx: {
      marginTop: '4px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      '& .MuiList-root': {
        padding: '4px 0',
      },
    },
  },
}; 