import { Box, CircularProgress, Paper } from "@mui/material";
import PageHeader from "@components/PageHeader/PageHeader";
import DeleteConfirmModal from "@components/DeleteConfirm/DeleteConfirmModal";
import { Customer, Label } from "@ts/customer";
import CustomerInfo from "./components/CustomerInfo/CustomerInfo";
import {
  CustomerActionButtons,
  CustomerBasicInfo,
  CustomerRoleLabels,
  CustomerPriceInfo,
} from "./components";
import { RegionHierarchy } from "@utils/regionUtil";

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
  onDeleteClick: () => void;
  onDeleteCancel: () => void;
  onDeleteConfirm: () => void;
  onCreateLabel?: (name: string) => Promise<Label>;
  labelInputValue?: string;
  onLabelInputChange?: (value: string) => void;
  onMobileMenuToggle: () => void;
  initialRegionValueList: RegionHierarchy | null;
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
  onDeleteClick,
  onDeleteCancel,
  onDeleteConfirm,
  onCreateLabel,
  labelInputValue,
  onLabelInputChange,
  onMobileMenuToggle,
  initialRegionValueList,
}: CustomerDetailPageViewProps) => {
  if (loading || !customer || !customerId) {
    return (
      <Box className="flex-grow h-[calc(100vh-64px)] overflow-auto w-[calc(100%-240px)] ml-60 flex justify-center items-center">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box className="flex-grow h-screen overflow-auto bg-gray-100 p-0 max-w-screen box-border">
      <PageHeader title="고객 상세" onMobileMenuToggle={onMobileMenuToggle} />

      <Box className="p-6 pt-0">
        <CustomerActionButtons
          isEditing={isEditing}
          onEditClick={onEditClick}
          onCancelEdit={onCancelEdit}
          onSaveEdit={onSaveEdit}
          onDeleteClick={onDeleteClick}
        />

        <Box className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-6 mb-6">
          <CustomerBasicInfo
            customer={customer}
            isEditing={isEditing}
            editedCustomer={editedCustomer}
            onInputChange={onInputChange}
            initialRegionValueList={initialRegionValueList}
          />
          <CustomerRoleLabels
            customer={customer}
            isEditing={isEditing}
            editedCustomer={editedCustomer}
            availableLabels={availableLabels}
            onInputChange={onInputChange}
            onCreateLabel={onCreateLabel}
            labelInputValue={labelInputValue}
            onLabelInputChange={onLabelInputChange}
          />
        </Box>

        <CustomerPriceInfo
          customer={customer}
          isEditing={isEditing}
          editedCustomer={editedCustomer}
          onInputChange={onInputChange}
        />

        {!isEditing && (
          <Paper elevation={0} className="p-6 rounded-lg">
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
