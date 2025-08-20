interface Props {
  color?: "GRAY" | "GREEN" | "RED";
  text?: string;
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case "GREEN":
      return "bg-green-50 text-green-800";
    case "RED":
      return "bg-red-50 text-red-700";
    case "GRAY":
    default:
      return "bg-orange-50 text-orange-700";
  }
};

function Status({ color = "GRAY", text }: Props) {
  return (
    <span className={`py-1 px-2 rounded inline-block ${getStatusStyle(color)}`}>
      {text}
    </span>
  );
}

export default Status;
