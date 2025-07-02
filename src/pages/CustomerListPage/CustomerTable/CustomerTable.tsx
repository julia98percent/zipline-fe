import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DeleteConfirmModal from "@components/DeleteConfirm/DeleteConfirmModal";
import Table, { ColumnConfig } from "@components/Table/Table";
import { showToast } from "@components/Toast/Toast";
import { Customer, Label } from "@ts/customer";
import { deleteCustomer } from "@apis/customerService";
import { CUSTOMER_TABLE_COLUMNS } from "./constants";
import {
  renderNameColumn,
  renderPhoneColumn,
  renderRolesColumn,
  renderLabelsColumn,
  renderActionsColumn,
} from "./columnRenderers";

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

  // 라벨 목록 가져오기
  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const labels = await fetchLabels();
        setAvailableLabels(labels);
      } catch (error) {
        console.error("Failed to fetch labels:", error);
      }
    };
    fetchLabels();
  }, []);

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
      // 현재 페이지의 데이터가 1개이고 첫 페이지가 아닌 경우, 이전 페이지로 이동
      if (customerList.length === 1 && page > 0) {
        setPage(page - 1);
      } else {
        // 현재 페이지 새로고침
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
              handleEditChange
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
    <Box sx={{ width: "100%", mt: "28px" }}>
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
        handleChangeRowsPerPage={(e) => setRowsPerPage(Number(e.target.value))}
        noDataMessage="고객 데이터가 없습니다"
        rowsPerPageOptions={[10, 25, 50, 100]}
      />
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
