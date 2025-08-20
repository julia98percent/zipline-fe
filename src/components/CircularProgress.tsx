import { CircularProgress as MuiCircularProgress } from "@mui/material";

const CircularProgress = ({ size = 56 }) => {
  return (
    <>
      <svg width={0} height={0}>
        <defs>
          <linearGradient
            id="loading_gradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#73a8ff" />
            <stop offset="100%" stopColor="#3b70c4" />
          </linearGradient>
        </defs>
      </svg>
      <MuiCircularProgress
        sx={{ "svg circle": { stroke: "url(#loading_gradient)" } }}
        size={size}
      />
    </>
  );
};

export default CircularProgress;
