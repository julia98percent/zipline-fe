import { useState, useEffect } from "react";
import apiClient from "@apis/apiClient";
import CustomerAddButtonList from "./CustomerAddButtonList";
import CustomerFilterModal from "./CustomerFilterModal/CustomerFilterModal";
import { Box, CircularProgress, TextField, Button } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import useDebounce from "@hooks/useDebounce";
import PageHeader from "@components/PageHeader/PageHeader";
import CustomerTable from "./CustomerTable/CustomerTable";
import { InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Customer } from "@ts/customer";

const CustomerListPage = () => {
  const [loading, setLoading] = useState(true);
  const [customerList, setCustomerList] = useState<Customer[]>([]);
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

  const fetchCustomerList = (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }

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
    if (debouncedSearchTerm) {
      fetchCustomerList(false); // 검색어 변경 시 로딩 표시 안 함
    } else if (page || filters) {
      fetchCustomerList(true); // 페이지나 필터 변경 시 로딩 표시
    } else {
      fetchCustomerList(false); // rowsPerPage 변경 시 로딩 표시 안 함
    }
  }, [debouncedSearchTerm, rowsPerPage, page, filters]);

  const handleFilterApply = (newFilters: Filters) => {
    setFilters(newFilters);
    setPage(0);
  };

  const handleCustomerUpdate = async (customer: {
    uid: number;
    name: string;
    phoneNo: string;
    tenant: boolean;
    landlord: boolean;
    buyer: boolean;
    seller: boolean;
    labels: { uid: number; name: string }[];
  }) => {
    try {
      const existingCustomer = customerList.find((c) => c.uid === customer.uid);
      if (!existingCustomer) return;

      const dataToSend = {
        name: customer.name,
        phoneNo: customer.phoneNo,
        labelUids: Array.isArray(customer.labels)
          ? customer.labels.map((label) => label.uid)
          : [],
        telProvider: existingCustomer.telProvider,
        legalDistrictCode: existingCustomer.legalDistrictCode,
        minRent: existingCustomer.minRent,
        maxRent: existingCustomer.maxRent,
        trafficSource: existingCustomer.trafficSource,
        landlord: customer.landlord,
        tenant: customer.tenant,
        buyer: customer.buyer,
        seller: customer.seller,
        maxPrice: existingCustomer.maxPrice,
        minPrice: existingCustomer.minPrice,
        minDeposit: existingCustomer.minDeposit,
        maxDeposit: existingCustomer.maxDeposit,
        birthday: existingCustomer.birthday,
      };

      const response = await apiClient.put(
        `/customers/${customer.uid}`,
        dataToSend
      );

      if (response.status === 200) {
        fetchCustomerList(false);
      }
    } catch (error) {
      console.error("Failed to update customer:", error);
    }
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
      <PageHeader title="고객 목록" />

      <Box
        sx={{
          p: "20px",
          maxWidth: "100%",
          mx: "auto",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
            padding: "18px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 1,
            }}
          >
            <TextField
              placeholder="전화번호 또는 고객이름으로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                minWidth: 300,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(0, 0, 0, 0.25)",
                  },
                },
              }}
            />
            <Button
              startIcon={<FilterListIcon />}
              onClick={() => setFilterModalOpen(true)}
              sx={{
                height: "40px",
                ml: 1,
                minWidth: "120px",
                border: "1px solid #164F9E",
                color: "#164F9E",
                borderRadius: "20px",
                "&:hover": {
                  border: "1px solid #164F9E",
                },
              }}
            >
              상세 필터
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <CustomerAddButtonList fetchCustomerData={fetchCustomerList} />
          </Box>
        </div>
        <CustomerTable
          customerList={customerList}
          totalCount={totalCount}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
          page={page}
          rowsPerPage={rowsPerPage}
          onCustomerUpdate={handleCustomerUpdate}
          onRefresh={() => fetchCustomerList(false)}
        />

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
