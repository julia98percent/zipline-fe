import { useState, useEffect } from "react";
import apiClient from "@apis/apiClient";
import CustomerAddButtonList from "./CustomerAddButtonList";
import CustomerTable from "./CustomerTable/CustomerTable";
import CustomerFilterModal from "./CustomerFilterModal/CustomerFilterModal";
import { Box, CircularProgress, TextField, IconButton } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import useDebounce from "@hooks/useDebounce";
import PageHeader from "@components/PageHeader/PageHeader";
import useUserStore from "@stores/useUserStore";

interface Customer {
  uid: number;
  name: string;
  phoneNo: string;
  labelUids: number[];
  telProvider: string;
  legalDistrictCode: string;
  minRent: number | null;
  maxRent: number | null;
  trafficSource: string;
  landlord: boolean;
  tenant: boolean;
  buyer: boolean;
  seller: boolean;
  maxPrice: number | null;
  minPrice: number | null;
  minDeposit: number | null;
  maxDeposit: number | null;
  birthday: string | null;
  labels: {
    uid: number;
    name: string;
  }[];
}

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

  const { user } = useUserStore();

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
    fetchCustomerList(false);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm) return;
    fetchCustomerList(false); // rowsPerPage 변경 시에는 로딩 표시 안 함
  }, [rowsPerPage]);

  useEffect(() => {
    if (debouncedSearchTerm) return;
    fetchCustomerList(true); // 페이지나 필터 변경 시에는 로딩 표시
  }, [page, filters]);

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

      // 서버에서 허용하는 필드만 포함하여 전송
      const dataToSend = {
        name: customer.name,
        phoneNo: customer.phoneNo,
        labelUids: customer.labels.map((label) => label.uid),
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

      console.log("Updating customer with data:", dataToSend);

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
      <PageHeader title="고객 목록" userName={user?.name || ""} />

      <Box
        sx={{
          p: { xs: 2, md: 3 },
          pt: 0,
          maxWidth: 1400,
          mx: "auto",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
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
              placeholder="전화번호 또는 고객이름 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{
                width: 250,
              }}
            />
            <IconButton
              onClick={() => setFilterModalOpen(true)}
              sx={{
                borderRadius: "4px",
              }}
            >
              <FilterListIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <CustomerAddButtonList fetchCustomerList={fetchCustomerList} />
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
