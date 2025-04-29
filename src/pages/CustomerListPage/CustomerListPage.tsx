import { useState, useEffect } from "react";
import apiClient from "@apis/apiClient";
import CustomerAddButtonList from "./CustomerAddButtonList";
import CustomerTable from "./CustomerTable/CustomerTable";
import CustomerFilterModal from "./CustomerFilterModal/CustomerFilterModal";
import {
  Box,
  CircularProgress,
  TextField,
  IconButton,
  Pagination,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import useDebounce from "@hooks/useDebounce";
import PageHeader from "@components/PageHeader/PageHeader";
import useUserStore from "@stores/useUserStore";

const CustomerListPage = () => {
  const [loading, setLoading] = useState(true);
  const [customerList, setCustomerList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  type Filters = {
    tenant: boolean;
    landlord: boolean;
    buyer: boolean;
    seller: boolean;
    noRole: boolean;
    minPrice: string;
    maxPrice: string;
    minDeposit: string;
    maxDeposit: string;
    minRent: string;
    maxRent: string;
  };

  const [filters, setFilters] = useState<Filters>({
    tenant: false,
    landlord: false,
    buyer: false,
    seller: false,
    noRole: false,
    minPrice: "",
    maxPrice: "",
    minDeposit: "",
    maxDeposit: "",
    minRent: "",
    maxRent: "",
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { user } = useUserStore();

  const fetchCustomerList = () => {
    setLoading(true);

    const queryParams = new URLSearchParams({
      page: (page + 1).toString(),
      size: rowsPerPage.toString(),
    });

    if (debouncedSearchTerm) {
      queryParams.append("search", debouncedSearchTerm);
    }

    // 필터 값을 QueryString에 포함
    Object.entries(filters).forEach(([key, value]) => {
      // 역할 관련 키 처리
      if (["tenant", "landlord", "buyer", "seller", "noRole"].includes(key)) {
        // noRole이 true일 때는 noRole만 전송
        if (filters.noRole) {
          if (key === "noRole") {
            queryParams.append(key, value.toString());
          }
          return;
        }
        // noRole이 아닌 경우, true인 역할만 전송
        if (value === true) {
          queryParams.append(key, value.toString());
        }
        return;
      }

      // 나머지 필터 값 처리
      if (value !== undefined && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    apiClient
      .get(`/customers?${queryParams.toString()}`)
      .then((res) => {
        const customerData = res?.data?.data?.customers;
        const total = res?.data?.data?.totalElements || 1;

        if (res.status === 200 && customerData) {
          setCustomerList(customerData);
          setTotalCount(total);
        }
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCustomerList();
  }, [page, rowsPerPage, debouncedSearchTerm, filters]);

  const handleFilterApply = (newFilters: Filters) => {
    setFilters(newFilters);
    setPage(0);
  };

  if (loading) {
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
        maxWidth: { xs: "100%", md: "calc(100vw - 240px)" },
        boxSizing: "border-box",
      }}
    >
      <PageHeader title="고객 목록" userName={user?.name || ""} />

      <Box sx={{ p: { xs: 2, md: 3 }, pt: 0, maxWidth: 1400, mx: "auto" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            mb: 2,
          }}
        >
          <CustomerAddButtonList fetchCustomerList={fetchCustomerList} />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            mb: 3,
            gap: 1,
          }}
        >
          <TextField
            placeholder="전화번호 또는 고객이름 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{
              width: 250,
              "& .MuiOutlinedInput-root": {
                borderRadius: "4px",
                backgroundColor: "#F5F5F5",
              },
            }}
          />
          <IconButton
            onClick={() => setFilterModalOpen(true)}
            sx={{
              backgroundColor: "#F5F5F5",
              borderRadius: "4px",
              "&:hover": { backgroundColor: "#E0E0E0" },
            }}
          >
            <FilterListIcon />
          </IconButton>
        </Box>

        <CustomerTable
          customerList={customerList}
          totalCount={totalCount}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
          page={page}
          rowsPerPage={rowsPerPage}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Pagination
            count={Math.ceil(totalCount / rowsPerPage)}
            page={page + 1}
            onChange={(_, v) => setPage(v - 1)}
          />
        </Box>

        <CustomerFilterModal
          open={filterModalOpen}
          onClose={() => setFilterModalOpen(false)}
          filters={filters}
          setFilters={setFilters}
          onApply={handleFilterApply}
        />
      </Box>
    </Box>
  );
};

export default CustomerListPage;
