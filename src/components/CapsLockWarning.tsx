interface CapsLockWarningProps {
  show: boolean;
}

const CapsLockWarning = ({ show }: CapsLockWarningProps) => {
  if (!show) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "-30px",
        left: 0,
        backgroundColor: "#ff9800",
        color: "white",
        padding: "4px 8px",
        borderRadius: "4px",
        fontSize: "12px",
        zIndex: 1000,
        whiteSpace: "nowrap",
      }}
    >
      ⚠️ Caps Lock이 켜져 있습니다
    </div>
  );
};

export default CapsLockWarning;