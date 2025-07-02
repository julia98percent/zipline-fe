import PropertyFilterModalContainer from "./PropertyFilterModalContainer";
import { AgentPropertyFilterParams } from "@ts/property";

interface Props {
  open: boolean;
  onClose: () => void;
  filter: Partial<AgentPropertyFilterParams>;
  setFilter: (value: Partial<AgentPropertyFilterParams>) => void;
  onApply: () => void;
  onReset: () => void;
}

const PropertyFilterModal = (props: Props) => {
  return <PropertyFilterModalContainer {...props} />;
};

export default PropertyFilterModal;
