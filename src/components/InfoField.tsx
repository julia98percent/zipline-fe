interface InfoFieldProps {
  label?: string;
  value: string | React.ReactNode;
}

const InfoField = ({ label, value }: InfoFieldProps) => (
  <div className="flex flex-col py-1 gap-1">
    {label && <span className="text-sm text-neutral-600">{label}</span>}
    <span className="font-medium break-all">{value}</span>
  </div>
);

export default InfoField;
