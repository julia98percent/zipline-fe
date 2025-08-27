import PageHeader from "@components/PageHeader/PageHeader";
import DeleteConfirmModal from "@components/DeleteConfirmModal";
import { Customer, Label } from "@ts/customer";
import CustomerInfo from "./components/CustomerInfo/CustomerInfo";
import {
  CustomerActionButtons,
  CustomerBasicInfo,
  CustomerRoleLabels,
  CustomerPriceInfo,
} from "./components";
import { RegionHierarchy } from "@utils/regionUtil";
import CircularProgress from "@components/CircularProgress";

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

  initialRegionValueList,
}: CustomerDetailPageViewProps) => {
  if (loading || !customer || !customerId) {
    return (
      <div className="flex-grow h-screen overflow-auto bg-gray-100 p-0 max-w-screen box-border">
        <PageHeader />

        <div className="flex justify-center items-center h-[calc(100vh-72px)]">
          <CircularProgress />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader />

      <div className="flex flex-col gap-4 p-5 pt-0">
        <CustomerActionButtons
          isEditing={isEditing}
          onEditClick={onEditClick}
          onCancelEdit={onCancelEdit}
          onSaveEdit={onSaveEdit}
          onDeleteClick={onDeleteClick}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
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
        </div>

        <CustomerPriceInfo
          customer={customer}
          isEditing={isEditing}
          editedCustomer={editedCustomer}
          onInputChange={onInputChange}
        />

        {!isEditing && <CustomerInfo customerId={customerId} />}
      </div>

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onConfirm={onDeleteConfirm}
        onCancel={onDeleteCancel}
        category="고객"
      />
    </div>
  );
};

export default CustomerDetailPageView;
