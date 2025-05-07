import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import PageHeader from "@components/PageHeader/PageHeader";
import useUserStore from "@stores/useUserStore";
import { useEffect, useState } from "react";
import apiClient from "@apis/apiClient";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import CounselModal from "./CounselModal";
import styles from "./styles/CounselListPage.module.css";

interface Counsel {
  counselUid: number;
  title: string;
  type: string;
  counselDate: string;
  dueDate: string;
  completed: boolean;
}

interface CounselListResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    counsels: Counsel[];
  };
}

function CounselListPage() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [counsels, setCounsels] = useState<Counsel[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedCompleted, setSelectedCompleted] = useState<boolean | null>(null);

  const COUNSEL_TYPES = [
    { value: "PURCHASE", label: "매수" },
    { value: "SALE", label: "매도" },
    { value: "LEASE", label: "임대" },
    { value: "RENT", label: "임차" },
    { value: "OTHER", label: "기타" },
  ];

  const fetchCounsels = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<CounselListResponse>("/counsels", {
        params: {
          page: page + 1,
          size: rowsPerPage,
          search: search || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          type: selectedType || undefined,
          completed: selectedCompleted,
        },
      });

      if (response.data.success) {
        setCounsels(response.data.data.counsels);
        setTotalElements(response.data.data.totalElements);
      }
    } catch (error) {
      console.error("Failed to fetch counsels:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCounsels();
  }, [page, rowsPerPage, selectedType, selectedCompleted]);

  const handleSearchClick = () => {
    if (startDate && endDate && startDate > endDate) {
      alert("시작일은 종료일보다 빠르거나 같아야 합니다.");
      return;
    }

    setPage(0);
    fetchCounsels();
  };

  const handleResetClick = () => {
    setSearch("");
    setStartDate(null);
    setEndDate(null);
    setSelectedType(null);
    setSelectedCompleted(null);
    setPage(0);
    fetchCounsels();
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (counselUid: number) => {
    navigate(`/counsels/${counselUid}`);
  };

  return (
    <Box className={styles.container}>
      <PageHeader title="상담 내역" userName={user?.name || "-"} />

      <Box className={styles.contents}>
        <div className={styles.controlsContainer}>
          <div className={styles.searchBarRow}>
            <div className={styles.searchInputWrapper}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="이름 또는 전화번호로 검색"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className={styles.searchButton} onClick={handleSearchClick}>
              검색
            </button>
            <button className={styles.resetButton} onClick={handleResetClick}>
              초기화
            </button>
          </div>

          <div className={styles.dateFilterRow}>
            <input
              type="date"
              className={styles.dateInput}
              value={startDate ?? ""}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span>~</span>
            <input
              type="date"
              className={styles.dateInput}
              value={endDate ?? ""}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className={styles.filterButtons}>
            {COUNSEL_TYPES.map((type) => (
              <button
                key={type.value}
                className={`${styles.filterButton} ${
                  selectedType === type.value ? styles.filterButtonActive : ""
                }`}
                onClick={() => {
                  setSelectedType(
                    selectedType === type.value ? null : type.value
                  );
                  setPage(0);
                }}
              >
                {type.label}
              </button>
            ))}
          </div>

          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterButton} ${
                selectedCompleted === false ? styles.filterButtonActive : ""
              }`}
              onClick={() => {
                setSelectedCompleted(
                  selectedCompleted === false ? null : false
                );
                setPage(0);
              }}
            >
              의뢰 진행중
            </button>
            <button
              className={`${styles.filterButton} ${
                selectedCompleted === true ? styles.filterButtonActive : ""
              }`}
              onClick={() => {
                setSelectedCompleted(
                  selectedCompleted === true ? null : true
                );
                setPage(0);
              }}
            >
              의뢰 마감
            </button>
          </div>
        </div>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsModalOpen(true)}
            sx={{
              backgroundColor: "#164F9E",
              "&:hover": { backgroundColor: "#0D3B7A" },
            }}
          >
            상담 등록
          </Button>
        </Box>

        <Paper
          sx={{
            width: "100%",
            borderRadius: "12px",
            boxShadow: "none",
            border: "1px solid #E0E0E0",
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>제목</TableCell>
                  <TableCell>상담 유형</TableCell>
                  <TableCell>상담일</TableCell>
                  <TableCell>희망 의뢰 마감일</TableCell>
                  <TableCell>의뢰 상태</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ) : counsels.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      상담 내역이 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  counsels.map((counsel) => (
                    <TableRow
                      key={counsel.counselUid}
                      hover
                      onClick={() => handleRowClick(counsel.counselUid)}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell>{counsel.title}</TableCell>
                      <TableCell>{counsel.type}</TableCell>
                      <TableCell>
                        {dayjs(counsel.counselDate).format("YYYY-MM-DD")}
                      </TableCell>
                      <TableCell>
                        {counsel.dueDate
                          ? dayjs(counsel.dueDate).format("YYYY-MM-DD")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            color: (!counsel.dueDate || counsel.completed) ? "#219653" : "#F2994A",
                            backgroundColor: (!counsel.dueDate || counsel.completed) ? "#E9F7EF" : "#FEF5EB",
                            py: 0.5,
                            px: 1,
                            borderRadius: 1,
                            display: "inline-block",
                          }}
                        >
                          {(!counsel.dueDate || counsel.completed) ? "의뢰 마감" : "의뢰 진행중"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={totalElements}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50]}
            labelRowsPerPage="페이지당 행 수"
            labelDisplayedRows={({ from, to, count }) =>
              `${count}개 중 ${from}-${to}개`
            }
          />
        </Paper>
      </Box>

      <CounselModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCounsels}
      />
    </Box>
  );
}

export default CounselListPage;