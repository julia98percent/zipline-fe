import {
  ContractDetail,
  ContractHistory,
  ContractPartyInfo,
} from "@/types/contract";
import { CONTRACT_STATUS_OPTION_LIST } from "@/constants/contract";
import ContractDetailContentView from "./ContractDetailContentView";

const CONTRACT_STATUS_COLORS: Record<string, string> = {
  LISTED: "#9e9e9e",
  NEGOTIATING: "#0288d1",
  INTENT_SIGNED: "#f57c00",
  CANCELLED: "#d32f2f",
  CONTRACTED: "#388e3c",
  IN_PROGRESS: "#1976d2",
  PAID_COMPLETE: "#7b1fa2",
  REGISTERED: "#388e3c",
  MOVED_IN: "#388e3c",
  TERMINATED: "#d32f2f",
  CLOSED: "#9e9e9e",
};

interface Props {
  contract: ContractDetail;
  histories: ContractHistory[];
  onEditBasicInfo: () => void;
  onEditDocuments: () => void;
  onStatusChange?: (newStatus: "CANCELLED" | "TERMINATED") => void;
  onQuickStatusChange?: (newStatus: string) => void;
}

const ContractDetailContent = ({
  contract,
  histories,
  onEditBasicInfo,
  onEditDocuments,
  onStatusChange,
  onQuickStatusChange,
}: Props) => {
  const getStatusLabel = (statusValue: string): string => {
    const statusOption = CONTRACT_STATUS_OPTION_LIST.find(
      (option) => option.value === statusValue
    );
    return statusOption ? statusOption.label : statusValue;
  };

  const getStatusColor = (statusValue: string): string => {
    return CONTRACT_STATUS_COLORS[statusValue] || "#9e9e9e";
  };

  const getCustomerNamesDisplay = (contractPartyInfo: ContractPartyInfo[]) => {
    if (!contractPartyInfo || contractPartyInfo.length === 0) return "-";
    return contractPartyInfo.map((item) => item.name).join(", ");
  };

  return (
    <ContractDetailContentView
      contract={contract}
      histories={histories}
      getStatusLabel={getStatusLabel}
      getStatusColor={getStatusColor}
      getCustomerNamesDisplay={getCustomerNamesDisplay}
      onEditBasicInfo={onEditBasicInfo}
      onEditDocuments={onEditDocuments}
      onStatusChange={onStatusChange}
      onQuickStatusChange={onQuickStatusChange}
    />
  );
};

export default ContractDetailContent;
