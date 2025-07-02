import { Box, Tabs, Tab, CircularProgress } from "@mui/material";
import CustomerInfoTabPanel from "./components/CustomerInfoTabPanel";
import { TabType, TabState } from "./CustomerInfo";
import { Counsel } from "@ts/counsel";
import { Contract } from "@ts/contract";
import { Property } from "@ts/property";

interface CustomerInfoViewProps {
  currentTab: TabType;
  loading: boolean;
  consultationData: Counsel[];
  propertyData: Property[];
  contractData: Contract[];
  consultationState: TabState;
  propertyState: TabState;
  contractState: TabState;
  onTabChange: (tab: TabType) => void;
  onConsultationPageChange: (page: number) => void;
  onConsultationRowsPerPageChange: (rowsPerPage: number) => void;
  onPropertyPageChange: (page: number) => void;
  onPropertyRowsPerPageChange: (rowsPerPage: number) => void;
  onContractPageChange: (page: number) => void;
  onContractRowsPerPageChange: (rowsPerPage: number) => void;
}

const CustomerInfoView = ({
  currentTab,
  loading,
  consultationData,
  propertyData,
  contractData,
  consultationState,
  propertyState,
  contractState,
  onTabChange,
  onConsultationPageChange,
  onConsultationRowsPerPageChange,
  onPropertyPageChange,
  onPropertyRowsPerPageChange,
  onContractPageChange,
  onContractRowsPerPageChange,
}: CustomerInfoViewProps) => {
  const handleTabChange = (_: React.ChangeEvent<object>, newValue: number) => {
    onTabChange(newValue as TabType);
  };

  return (
    <Box sx={{ mt: 0 }}>
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="primary"
        centered
      >
        <Tab label="상담 내역" />
        <Tab label="매물" />
        <Tab label="계약" />
      </Tabs>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <CustomerInfoTabPanel
          tabType={currentTab}
          consultationData={consultationData}
          propertyData={propertyData}
          contractData={contractData}
          consultationState={consultationState}
          propertyState={propertyState}
          contractState={contractState}
          onConsultationPageChange={onConsultationPageChange}
          onConsultationRowsPerPageChange={onConsultationRowsPerPageChange}
          onPropertyPageChange={onPropertyPageChange}
          onPropertyRowsPerPageChange={onPropertyRowsPerPageChange}
          onContractPageChange={onContractPageChange}
          onContractRowsPerPageChange={onContractRowsPerPageChange}
        />
      )}
    </Box>
  );
};

export default CustomerInfoView;
