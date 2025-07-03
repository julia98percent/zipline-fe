import { Box, CircularProgress, Paper } from "@mui/material";
import PageHeader from "@components/PageHeader/PageHeader";
import DeleteConfirmModal from "@components/DeleteConfirm/DeleteConfirmModal";
import { Customer } from "@ts/customer";
import CustomerInfo from "./components/CustomerInfo/CustomerInfo";
import {
  CustomerActionButtons,
  CustomerBasicInfo,
  CustomerRoleLabels,
  CustomerPriceInfo,
} from "./components";

interface CustomerDetailPageViewProps {
  loading: boolean;
  customer: Customer | null;
  customerId: string | undefined;
  isEditing: boolean;
  editedCustomer: Customer | null;
  availableLabels: { uid: number; name: string }[];
  isDeleteModalOpen: boolean;
  onEditClick: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onInputChange: (
    field: keyof Customer,
    value: string | number | boolean | null | { uid: number; name: string }[]
  ) => void;
  onRegionChange: (value: { code: number | null; name: string }) => void;
  onDeleteClick: () => void;
  onDeleteCancel: () => void;
  onDeleteConfirm: () => void;
}

const CustomerDetailPageView = ({
  loading,
  customer,
  customerId,
  isEditing,
  editedCustomer,
  availableLabels,
  isDeleteModalOpen,
  onEditClick,
  onCancelEdit,
  onSaveEdit,
  onInputChange,
  onRegionChange,
  onDeleteClick,
  onDeleteCancel,
  onDeleteConfirm,
}: CustomerDetailPageViewProps) => {
  if (loading || !customer || !customerId) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          height: "calc(100vh - 64px)",
          overflow: "auto",
          width: "calc(100% - 240px)",
          ml: "240px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
        backgroundColor: "#f5f5f5",
        p: 0,
        maxWidth: { xs: "100%", md: "calc(100vw - 240px)" },
        boxSizing: "border-box",
      }}
    >
      <PageHeader title="고객 상세" />

      <Box sx={{ p: 3, pt: 0 }}>
        <CustomerActionButtons
          isEditing={isEditing}
          onEditClick={onEditClick}
          onCancelEdit={onCancelEdit}
          onSaveEdit={onSaveEdit}
          onDeleteClick={onDeleteClick}
        />

        <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
          <CustomerBasicInfo
            customer={customer}
            isEditing={isEditing}
            editedCustomer={editedCustomer}
            onInputChange={onInputChange}
            onRegionChange={onRegionChange}
          />
          <CustomerRoleLabels
            customer={customer}
            isEditing={isEditing}
            editedCustomer={editedCustomer}
            availableLabels={availableLabels}
            onInputChange={onInputChange}
          />
        </Box>

        <CustomerPriceInfo
          customer={customer}
          isEditing={isEditing}
          editedCustomer={editedCustomer}
          onInputChange={onInputChange}
        />

        {!isEditing && (
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <CustomerInfo customerId={customerId} />
          </Paper>
        )}
      </Box>

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onConfirm={onDeleteConfirm}
        onCancel={onDeleteCancel}
        category="고객"
      />
    </Box>
  );
};

export default CustomerDetailPageView;
