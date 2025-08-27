interface InfoFieldProps {
  label?: string;
  value: string | React.ReactNode;
  className?: string;
}

const InfoField = ({ label, value, className }: InfoFieldProps) => (
  <div className={`flex flex-col py-1 gap-1 ${className}`}>
    {label && <span className="text-sm text-neutral-600">{label}</span>}
    {typeof value === "string" ? (
      <span className="font-medium break-all">{value}</span>
    ) : (
      <div>{value}</div>
    )}
  </div>
);

export default InfoField;
