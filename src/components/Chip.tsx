import { Chip as MuiChip } from "@mui/material";

interface Props {
  text: string;
  color?: "default" | "primary" | "secondary" | "error" | "info" | "success";
  onClick?: () => void;
}

const Chip = ({ text, color = "default", onClick }: Props) => {
  return (
    <MuiChip
      label={text}
      color={color}
      onClick={onClick ? onClick : undefined}
      clickable={!!onClick}
    />
  );
};

export default Chip;
