import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DeleteConfirmModal from "@components/DeleteConfirm/DeleteConfirmModal";
import Table, { ColumnConfig } from "@components/Table/Table";
import MobilePagination from "@components/MobilePagination";
import { showToast } from "@components/Toast";
import { Customer, Label } from "@ts/customer";
import { deleteCustomer } from "@apis/customerService";
import { CUSTOMER_TABLE_COLUMNS } from "./constants";
import CustomerCard from "../CustomerCard";
import {
  renderNameColumn,
  renderPhoneColumn,
  renderRolesColumn,
  renderLabelsColumn,
  renderActionsColumn,
} from "./columnRenderers";
import {
  fetchLabels as fetchLabelsApi,
  createLabel,
} from "@apis/customerService";

interface EditingCustomer extends Customer {
  isEditing?: boolean;
}

type EditableFields = string | boolean | Label[];

interface Props {
  customerList: Customer[];
  totalCount: number;
  setPage: (newPage: number) => void;
  setRowsPerPage: (newRowsPerPage: number) => void;
  page: number;
  rowsPerPage: number;
  onCustomerUpdate?: (customer: Customer) => void;
  onRefresh: () => void;
}

const CustomerTable = ({
  customerList,
  totalCount,
  setPage,
  setRowsPerPage,
  page,
  rowsPerPage,
  onCustomerUpdate,
  onRefresh,
}: Props) => {
  const navigate = useNavigate();
  const [editingCustomers, setEditingCustomers] = useState<{
    [key: number]: EditingCustomer;
  }>({});
  const [availableLabels, setAvailableLabels] = useState<Label[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null
  );
  const [labelInputValues, setLabelInputValues] = useState<{
    [key: number]: string;
  }>({});

  const loadLabels = async () => {
    try {
      const labels = await fetchLabelsApi();
      setAvailableLabels(labels);
    } catch (error) {
      console.error("Failed to fetch labels:", error);
    }
  };

  useEffect(() => {
    loadLabels();
  }, []);

  const handleCreateLabel = async (name: string): Promise<Label> => {
    try {
      const newLabel = await createLabel(name);

      setAvailableLabels((prev) => [...prev, newLabel]);

      showToast({
        message: `라벨 "${name}"을 생성했습니다.`,
        type: "success",
      });

      return newLabel;
    } catch (error) {
      console.error("Failed to create label:", error);
      showToast({
        message: "라벨 생성에 실패했습니다.",
        type: "error",
      });
      throw error;
    }
  };

  const handleRowClick = (customer: Customer) => {
    if (editingCustomers[customer.uid]) return;
    navigate(`/customers/${customer.uid}`);
  };

  const handleDelete = (customer: Customer) => {
    setCustomerToDelete(customer);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!customerToDelete) return;

    try {
      await deleteCustomer(customerToDelete.uid);

      if (customerList.length === 1 && page > 0) {
        setPage(page - 1);
      } else {
        const newPage = customerList.length === 1 ? 0 : page;
        setPage(newPage);
      }
      onRefresh();
      showToast({
        message: "고객을 삭제했습니다.",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to delete customer:", error);
      showToast({
        message: "고객 삭제에 실패했습니다.",
        type: "error",
      });
    } finally {
      setDeleteModalOpen(false);
      setCustomerToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setCustomerToDelete(null);
  };

  const handleEditStart = (customer: Customer) => {
    setEditingCustomers({
      ...editingCustomers,
      [customer.uid]: {
        ...customer,
        isEditing: true,
      },
    });
  };

  const handleEditCancel = (uid: number) => {
    const newEditingCustomers = { ...editingCustomers };
    delete newEditingCustomers[uid];
    setEditingCustomers(newEditingCustomers);

    // 라벨 입력값도 초기화
    const newLabelInputValues = { ...labelInputValues };
    delete newLabelInputValues[uid];
    setLabelInputValues(newLabelInputValues);
  };

  const handleEditChange = (
    uid: number,
    field: keyof Customer,
    value: EditableFields
  ) => {
    setEditingCustomers({
      ...editingCustomers,
      [uid]: {
        ...editingCustomers[uid],
        [field]: value,
      },
    });
  };

  const handleEditSave = async (uid: number) => {
    const editedCustomer = editingCustomers[uid];
    if (editedCustomer && onCustomerUpdate) {
      // 전화번호 형식 검증
      const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/;
      if (!phoneRegex.test(editedCustomer.phoneNo)) {
        showToast({
          message: "전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)",
          type: "error",
        });
        return;
      }

      // 이름 검증
      if (!editedCustomer.name.trim()) {
        showToast({
          message: "이름을 입력해주세요.",
          type: "error",
        });
        return;
      }

      try {
        const updatedCustomer = {
          ...editedCustomer,
          uid: editedCustomer.uid,
          name: editedCustomer.name,
          phoneNo: editedCustomer.phoneNo,
          tenant: editedCustomer.tenant,
          landlord: editedCustomer.landlord,
          buyer: editedCustomer.buyer,
          seller: editedCustomer.seller,
          labels: Array.isArray(editedCustomer.labels)
            ? editedCustomer.labels
            : [],
          trafficSource: editedCustomer.trafficSource,
        };

        await onCustomerUpdate(updatedCustomer);
        handleEditCancel(uid);
      } catch (error) {
        console.error("Failed to save customer:", error);
      }
    }
  };

  // 컬럼 설정 with render functions
  const columns: ColumnConfig<Customer>[] = CUSTOMER_TABLE_COLUMNS.map(
    (col) => ({
      ...col,
      render: (_, customer) => {
        switch (col.key) {
          case "name":
            return renderNameColumn(
              customer,
              editingCustomers,
              handleEditChange
            );
          case "phoneNo":
            return renderPhoneColumn(
              customer,
              editingCustomers,
              handleEditChange
            );
          case "roles":
            return renderRolesColumn(
              customer,
              editingCustomers,
              handleEditChange
            );
          case "labels":
            return renderLabelsColumn(
              customer,
              editingCustomers,
              availableLabels,
              handleEditChange,
              handleCreateLabel,
              labelInputValues[customer.uid] || "",
              (value: string) => {
                setLabelInputValues({
                  ...labelInputValues,
                  [customer.uid]: value,
                });
              }
            );
          case "actions":
            return renderActionsColumn(
              customer,
              editingCustomers,
              handleEditStart,
              handleEditCancel,
              handleEditSave,
              handleDelete
            );
          default:
            return customer[col.key as keyof Customer] as React.ReactNode;
        }
      },
    })
  );

  // 편집 중인 행은 클릭 방지
  const handleTableRowClick = (customer: Customer) => {
    if (!editingCustomers[customer.uid]) {
      handleRowClick(customer);
    }
  };


  return (
    <Box className="w-full mt-[28px]">
      <Box className="hidden lg:block">
        <Table
          columns={columns}
          bodyList={customerList.map((customer) => ({
            ...customer,
            id: customer.uid,
          }))}
          handleRowClick={handleTableRowClick}
          totalElements={totalCount}
          page={page}
          handleChangePage={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          handleChangeRowsPerPage={(e) =>
            setRowsPerPage(Number(e.target.value))
          }
          noDataMessage="고객 데이터가 없습니다"
        />
      </Box>

      <Box className="block lg:hidden">
        {customerList.length === 0 ? (
          <Box className="text-center py-8 text-gray-500">
            고객 데이터가 없습니다
          </Box>
        ) : (
          <>
            <Box className="space-y-3">
              {customerList.map((customer) => (
                <CustomerCard
                  key={customer.uid}
                  customer={customer}
                  onRowClick={handleRowClick}
                  onEdit={handleEditStart}
                  onDelete={handleDelete}
                  isEditing={!!editingCustomers[customer.uid]}
                  editingCustomer={editingCustomers[customer.uid]}
                  onEditChange={handleEditChange}
                  onSave={() => handleEditSave(customer.uid)}
                  onCancel={() => handleEditCancel(customer.uid)}
                  availableLabels={availableLabels}
                  onCreateLabel={handleCreateLabel}
                  labelInputValue={labelInputValues[customer.uid] || ""}
                  onLabelInputChange={(value: string) => {
                    setLabelInputValues({
                      ...labelInputValues,
                      [customer.uid]: value,
                    });
                  }}
                />
              ))}
            </Box>

            <MobilePagination
              page={page}
              totalElements={totalCount}
              rowsPerPage={rowsPerPage}
              onPageChange={(_, newPage) => setPage(newPage)}
            />
          </>
        )}
      </Box>

      <DeleteConfirmModal
        open={deleteModalOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        category="고객"
      />
    </Box>
  );
};

export default CustomerTable;
