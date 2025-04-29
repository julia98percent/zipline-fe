import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
  IconButton,
  Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';

interface Customer {
  uid: number;
  name: string;
  phoneNo: string;
  trafficSource: string;
  labels: {
    uid: number;
    name: string;
  }[];
  tenant: boolean;
  landlord: boolean;
  buyer: boolean;
  seller: boolean;
}

interface Props {
  customerList: Customer[];
  totalCount: number;
  setPage: (newPage: number) => void;
  setRowsPerPage: (newRowsPerPage: number) => void;
  page: number;
  rowsPerPage: number;
}

const CustomerTable = ({
  customerList,
  totalCount,
  setPage,
  setRowsPerPage,
  page,
  rowsPerPage,
}: Props) => {
  const navigate = useNavigate();

  const handleRowClick = (uid: number) => {
    navigate(`/customers/${uid}`); // 고객 상세 페이지로 이동
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusChip = (status: string) => {
    const statusStyles: { [key: string]: { color: string, backgroundColor: string } } = {
      매도자: { color: '#2F80ED', backgroundColor: '#EBF2FC' },
      매수자: { color: '#219653', backgroundColor: '#E9F7EF' },
      임차인: { color: '#F2994A', backgroundColor: '#FEF5EB' },
      임대인: { color: '#EB5757', backgroundColor: '#FDEEEE' },
    };

    return (
      <Chip
        label={status}
        size="small"
        sx={{
          ...statusStyles[status],
          borderRadius: '4px',
          height: '24px',
          fontSize: '12px',
          fontWeight: 500,
        }}
      />
    );
  };

  const getTypeChip = (type: string) => {
    const typeStyles: { [key: string]: { color: string, backgroundColor: string } } = {
      VIP: { color: '#9B51E0', backgroundColor: '#F7F0FE' },
      '계약 완료': { color: '#333333', backgroundColor: '#F2F2F2' },
      요주의: { color: '#F2994A', backgroundColor: '#FEF5EB' },
    };

    return type ? (
      <Chip
        label={type}
        size="small"
        sx={{
          ...typeStyles[type],
          borderRadius: '4px',
          height: '24px',
          fontSize: '12px',
          fontWeight: 500,
        }}
      />
    ) : null;
  };

  return (
    <Box sx={{ width: "100%", mt: 4 }}>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="customer table">
            <TableHead>
              <TableRow>
                <TableCell align="left" sx={{ fontWeight: 600 }}>이름</TableCell>
                <TableCell align="left" sx={{ fontWeight: 600 }}>전화번호</TableCell>
                <TableCell align="left" sx={{ fontWeight: 600 }}>역할</TableCell>
                <TableCell align="left" sx={{ fontWeight: 600 }}>라벨</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>관리</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customerList.length > 0 ? (
                customerList.map((customer) => (
                  <TableRow
                    key={customer.uid}
                    onClick={() => handleRowClick(customer.uid)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": { backgroundColor: "#f0f0f0" },
                    }}
                  >
                    <TableCell align="left">{customer.name}</TableCell>
                    <TableCell align="left">{customer.phoneNo}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        {customer.tenant && <Chip label="임차인" size="small" sx={{ backgroundColor: "#FEF5EB", color: "#F2994A" }} />}
                        {customer.landlord && <Chip label="임대인" size="small" sx={{ backgroundColor: "#FDEEEE", color: "#EB5757" }} />}
                        {customer.buyer && <Chip label="매수자" size="small" sx={{ backgroundColor: "#E9F7EF", color: "#219653" }} />}
                        {customer.seller && <Chip label="매도자" size="small" sx={{ backgroundColor: "#EBF2FC", color: "#2F80ED" }} />}
                      </Box>
                    </TableCell>
                    <TableCell>
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
                          <Typography variant="body2" color="textSecondary">없음</Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small">
                        <DeleteIcon sx={{ color: '#E53535' }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
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
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelDisplayedRows={({ from, to, count }) => 
            `페이지 ${page + 1} / ${Math.ceil(count / rowsPerPage)}`
          }
          labelRowsPerPage=""
        />
      </Paper>
    </Box>
  );
};

export default CustomerTable;
