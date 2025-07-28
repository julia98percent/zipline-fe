import { Typography } from "@mui/material";

const Header = () => {
  return (
    <div className="text-center mb-4">
      <Typography
        variant="h5"
        component="h1"
        className="font-bold text-primary"
      >
        회원가입
      </Typography>
    </div>
  );
};

export default Header;
