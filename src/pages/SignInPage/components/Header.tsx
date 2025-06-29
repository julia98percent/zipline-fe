import { Typography } from "@mui/material";

const Header = () => {
  return (
    <div className="text-center mb-4">
      <Typography
        variant="h5"
        component="h1"
        sx={{
          color: "#164F9E",
          fontWeight: "bold",
        }}
      >
        로그인
      </Typography>
    </div>
  );
};

export default Header;
