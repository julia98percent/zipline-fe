import { Box } from "@mui/material";

interface Props {
  color?: "GRAY" | "GREEN" | "RED";
  text?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "GREEN":
      return {
        bg: "#E8F5E9",
        text: "#2E7D32",
      };
    case "RED":
      return {
        bg: "#FFEBEE",
        text: "#C62828",
      };
    case "GRAY":
    default:
      return {
        bg: "#FFF3E0",
        text: "#E65100",
      };
  }
};

function Status({ color = "GRAY", text }: Props) {
  return (
    <Box
      sx={{
        color: getStatusColor(color).text,
        backgroundColor: getStatusColor(color).bg,
        py: 0.5,
        px: 1,
        borderRadius: 1,
        display: "inline-block",
      }}
    >
      <span>{text}</span>
    </Box>
  );
}
export default Status;
