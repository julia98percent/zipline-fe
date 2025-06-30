import { TableContainer, Paper } from "@mui/material";
import ConsultationTable from "./ConsultationTable";
import PropertyTable from "./PropertyTable";
import ContractTable from "./ContractTable";
import { Counsel } from "@ts/counsel";
import { Contract } from "@ts/contract";
import { TabType, TabState } from "../CustomerInfo";
import { RowData } from "@components/Table";
import { Property } from "@ts/property";

interface CustomerInfoTabPanelProps {
  tabType: TabType;
  consultationData?: Counsel[];
  propertyData?: Property[];
  contractData?: Contract[];
  consultationState?: TabState;
  propertyState?: TabState;
  contractState?: TabState;
  onConsultationPageChange?: (page: number) => void;
  onConsultationRowsPerPageChange?: (rowsPerPage: number) => void;
  onPropertyPageChange?: (page: number) => void;
  onPropertyRowsPerPageChange?: (rowsPerPage: number) => void;
  onContractPageChange?: (page: number) => void;
  onContractRowsPerPageChange?: (rowsPerPage: number) => void;
}

export interface PropertyRowData extends RowData {
  address: string;
  detailAddress: string;
  type: "SALE" | "DEPOSIT" | "MONTHLY";
  price: number;
  deposit: number;
  monthlyRent: number;
  moveInDate: string;
  uid: string;
}

export interface ContractRowData extends RowData {
  id: number;
  category: string | null;
  address: string;
  lessorOrSellerNames: string[];
  lesseeOrBuyerNames: string[];
  contractDate: string | null;
  contractStartDate: string | null;
  contractEndDate: string | null;
  status: string;
  uid: number;
}

export type ConsultationRowData = Omit<
  Counsel,
  "propertyUid" | "customerName"
> & {
  id: number;
};

const CustomerInfoTabPanel = ({
  tabType,
  consultationData = [],
  propertyData = [],
  contractData = [],
  consultationState,
  propertyState,
  contractState,
  onConsultationPageChange,
  onConsultationRowsPerPageChange,
  onPropertyPageChange,
  onPropertyRowsPerPageChange,
  onContractPageChange,
  onContractRowsPerPageChange,
}: CustomerInfoTabPanelProps) => {
  console.log(propertyData);
  const renderTabContent = () => {
    switch (tabType) {
      case TabType.CONSULTATION:
        return (
          <ConsultationTable
            counselList={consultationData}
            totalCount={consultationState?.totalCount || 0}
            page={consultationState?.page || 0}
            rowsPerPage={consultationState?.rowsPerPage || 10}
            onPageChange={onConsultationPageChange || (() => {})}
            onRowsPerPageChange={onConsultationRowsPerPageChange || (() => {})}
            loading={consultationState?.loading || false}
          />
        );
      case TabType.PROPERTY:
        return (
          <PropertyTable
            properties={propertyData}
            totalCount={propertyState?.totalCount || 0}
            page={propertyState?.page || 0}
            rowsPerPage={propertyState?.rowsPerPage || 10}
            onPageChange={onPropertyPageChange || (() => {})}
            onRowsPerPageChange={onPropertyRowsPerPageChange || (() => {})}
            loading={propertyState?.loading || false}
          />
        );
      case TabType.CONTRACT:
        return (
          <ContractTable
            contractList={contractData}
            totalCount={contractState?.totalCount || 0}
            page={contractState?.page || 0}
            rowsPerPage={contractState?.rowsPerPage || 10}
            onPageChange={onContractPageChange || (() => {})}
            onRowsPerPageChange={onContractRowsPerPageChange || (() => {})}
            loading={contractState?.loading || false}
          />
        );
      default:
        return null;
    }
  };

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ mt: 2, boxShadow: "none" }}
    >
      {renderTabContent()}
    </TableContainer>
  );
};

export default CustomerInfoTabPanel;
