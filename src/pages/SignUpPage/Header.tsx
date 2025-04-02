import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Header = () => {
  return (
    <Box sx={{ marginBottom: "24px" }}>
      <Typography
        sx={{
          fontSize: "24px",
          fontWeight: "extrabold",
          lineHeight: "normal",
          letterSpacing: "0.08px",
        }}
      >
        회원 가입
      </Typography>
    </Box>
  );
};

export default Header;
