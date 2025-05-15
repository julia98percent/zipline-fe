import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  Autocomplete,
  TablePagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import apiClient from "@apis/apiClient";
import DeleteConfirmModal from "@components/DeleteConfirm/DeleteConfirmModal";
import { showToast } from "@components/Toast/Toast";

interface Label {
  uid: number;
  name: string;
}

interface Customer {
  uid: number;
  name: string;
  phoneNo: string;
  trafficSource: string;
  labels: Label[];
  tenant: boolean;
  landlord: boolean;
  buyer: boolean;
  seller: boolean;
}

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
        const response = await apiClient.get("/labels");
        if (response.data?.data?.labels) {
          setAvailableLabels(response.data.data.labels);
        }
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
      const response = await apiClient.delete(
        `/customers/${customerToDelete.uid}`
      );
      if (response.status === 200) {
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
      }
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
        alert("전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)");
        return;
      }

      // 이름 검증
      if (!editedCustomer.name.trim()) {
        alert("이름을 입력해주세요.");
        return;
      }

      const updatedCustomer = {
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

  const renderEditableRow = (customer: Customer) => {
    const editingCustomer = editingCustomers[customer.uid];

    return (
      <TableRow
        key={customer.uid}
        onClick={() =>
          !editingCustomers[customer.uid] && handleRowClick(customer)
        }
        sx={{
          cursor: "pointer",
          "&:hover": { backgroundColor: "#f0f0f0" },
        }}
      >
        <TableCell align="left" sx={{ width: "130px" }}>
          {editingCustomer?.isEditing ? (
            <TextField
              size="small"
              value={editingCustomer.name}
              onChange={(e) =>
                handleEditChange(customer.uid, "name", e.target.value)
              }
              fullWidth
            />
          ) : (
            customer.name
          )}
        </TableCell>
        <TableCell align="left" sx={{ width: "160px" }}>
          {editingCustomer?.isEditing ? (
            <TextField
              size="small"
              value={editingCustomer.phoneNo}
              onChange={(e) =>
                handleEditChange(customer.uid, "phoneNo", e.target.value)
              }
              fullWidth
            />
          ) : (
            customer.phoneNo
          )}
        </TableCell>
        <TableCell sx={{ width: "200px" }}>
          {editingCustomer?.isEditing ? (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Chip
                label="임차인"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditChange(
                    customer.uid,
                    "tenant",
                    !editingCustomer.tenant
                  );
                }}
                sx={{
                  backgroundColor: editingCustomer.tenant
                    ? "#FCE8D4"
                    : "#F5F5F5",
                  color: editingCustomer.tenant ? "#E67E00" : "#757575",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: editingCustomer.tenant
                      ? "#FCE8D4"
                      : "#E0E0E0",
                  },
                }}
              />
              <Chip
                label="임대인"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditChange(
                    customer.uid,
                    "landlord",
                    !editingCustomer.landlord
                  );
                }}
                sx={{
                  backgroundColor: editingCustomer.landlord
                    ? "#FCDADA"
                    : "#F5F5F5",
                  color: editingCustomer.landlord ? "#D63939" : "#757575",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: editingCustomer.landlord
                      ? "#FCDADA"
                      : "#E0E0E0",
                  },
                }}
              />
              <Chip
                label="매수자"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditChange(
                    customer.uid,
                    "buyer",
                    !editingCustomer.buyer
                  );
                }}
                sx={{
                  backgroundColor: editingCustomer.buyer
                    ? "#D4EDDC"
                    : "#F5F5F5",
                  color: editingCustomer.buyer ? "#0E8A3E" : "#757575",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: editingCustomer.buyer
                      ? "#D4EDDC"
                      : "#E0E0E0",
                  },
                }}
              />
              <Chip
                label="매도자"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditChange(
                    customer.uid,
                    "seller",
                    !editingCustomer.seller
                  );
                }}
                sx={{
                  backgroundColor: editingCustomer.seller
                    ? "#D6E6F9"
                    : "#F5F5F5",
                  color: editingCustomer.seller ? "#1B64C2" : "#757575",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: editingCustomer.seller
                      ? "#D6E6F9"
                      : "#E0E0E0",
                  },
                }}
              />
            </Box>
          ) : (
            <Box sx={{ display: "flex", gap: 1 }}>
              {customer.tenant && (
                <Chip
                  label="임차인"
                  size="small"
                  sx={{
                    backgroundColor: "#FEF5EB",
                    color: "#F2994A",
                  }}
                />
              )}
              {customer.landlord && (
                <Chip
                  label="임대인"
                  size="small"
                  sx={{
                    backgroundColor: "#FDEEEE",
                    color: "#EB5757",
                  }}
                />
              )}
              {customer.buyer && (
                <Chip
                  label="매수자"
                  size="small"
                  sx={{
                    backgroundColor: "#E9F7EF",
                    color: "#219653",
                  }}
                />
              )}
              {customer.seller && (
                <Chip
                  label="매도자"
                  size="small"
                  sx={{
                    backgroundColor: "#EBF2FC",
                    color: "#2F80ED",
                  }}
                />
              )}
              {!customer.tenant &&
                !customer.landlord &&
                !customer.buyer &&
                !customer.seller && (
                  <Chip
                    label="없음"
                    size="small"
                    sx={{
                      backgroundColor: "#F5F5F5",
                      color: "#757575",
                    }}
                  />
                )}
            </Box>
          )}
        </TableCell>
        <TableCell sx={{ width: "300px" }}>
          {editingCustomer?.isEditing ? (
            <Autocomplete
              multiple
              size="small"
              options={availableLabels}
              getOptionLabel={(option) => option.name}
              value={editingCustomer.labels || []}
              onChange={(_, newValue) => {
                handleEditChange(customer.uid, "labels", newValue);
              }}
              renderInput={(params) => (
                <TextField {...params} placeholder="라벨 선택" />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option.uid}
                    label={option.name}
                    size="small"
                    variant="outlined"
                  />
                ))
              }
              isOptionEqualToValue={(option, value) => option.uid === value.uid}
            />
          ) : (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {customer.labels && customer.labels.length > 0 ? (
                customer.labels.map((label) => (
                  <Chip
                    key={label.uid}
                    label={label.name}
                    size="small"
                    variant="outlined"
                  />
                ))
              ) : (
                <Chip
                  label="없음"
                  size="small"
                  sx={{
                    backgroundColor: "#F5F5F5",
                    color: "#757575",
                  }}
                />
              )}
            </Box>
          )}
        </TableCell>
        <TableCell align="center" sx={{ width: "100px" }}>
          <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
            {editingCustomer?.isEditing ? (
              <>
                <IconButton
                  onClick={() => handleEditSave(customer.uid)}
                  size="small"
                  sx={{ zIndex: 10 }}
                >
                  <DoneIcon sx={{ color: "#219653" }} />
                </IconButton>
                <IconButton
                  onClick={() => handleEditCancel(customer.uid)}
                  size="small"
                  sx={{ zIndex: 10 }}
                >
                  <CloseIcon sx={{ color: "#EB5757" }} />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditStart(customer);
                  }}
                  size="small"
                  sx={{ zIndex: 100 }}
                >
                  <EditIcon sx={{ color: "#164F9E" }} />
                </IconButton>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(customer);
                  }}
                  size="small"
                  sx={{ zIndex: 100 }}
                >
                  <DeleteIcon sx={{ color: "#E53535" }} />
                </IconButton>
              </>
            )}
          </Box>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Box sx={{ width: "100%", mt: "28px" }}>
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
        }}
        elevation={0}
      >
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="customer table">
            <TableHead>
              <TableRow>
                <TableCell
                  align="left"
                  sx={{ fontWeight: 600, width: "130px" }}
                >
                  이름
                </TableCell>
                <TableCell
                  align="left"
                  sx={{ fontWeight: 600, width: "160px" }}
                >
                  전화번호
                </TableCell>
                <TableCell
                  align="left"
                  sx={{ fontWeight: 600, width: "200px" }}
                >
                  역할
                </TableCell>
                <TableCell
                  align="left"
                  sx={{ fontWeight: 600, width: "300px" }}
                >
                  라벨
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 600, width: "100px" }}
                />
              </TableRow>
            </TableHead>
            <TableBody>
              {customerList.length > 0 ? (
                customerList.map((customer) => renderEditableRow(customer))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    고객 데이터가 없습니다
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => setRowsPerPage(Number(e.target.value))}
          rowsPerPageOptions={[10, 25, 50, 100]}
          labelRowsPerPage="페이지당 행 수"
          labelDisplayedRows={({ from, to, count }) =>
            `${count}명 중 ${from}-${to}명`
          }
        />
      </Paper>
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
