import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@apis/apiClient";
import ContractTable from "./ContractTable";
import ContractFilterModal from "./ContractFilterModal/ContractFilterModal";
import PageHeader from "@components/PageHeader/PageHeader";
import useUserStore from "@stores/useUserStore";
import styles from "./styles/ContractListPage.module.css";
import Select from "react-select";
import "./styles/reactSelect.css";
import ContractAddModal from "./ContractAddButtonList/ContractAddModal/ContractAddModal";

export interface ContractItem {
  uid: number;
  lessorOrSellerName: string;
  lesseeOrBuyerName: string | null;
  category: "SALE" | "DEPOSIT" | "MONTHLY" | null;
  contractDate: string | null;
  contractStartDate: string | null;
  contractEndDate: string | null;
  status:
    | "LISTED"
    | "NEGOTIATING"
    | "INTENT_SIGNED"
    | "CANCELLED"
    | "CONTRACTED"
    | "IN_PROGRESS"
    | "PAID_COMPLETE"
    | "REGISTERED"
    | "MOVED_IN"
    | "TERMINATED";
  address: string;
}

function ContractListPage() {
  const statusOptions = [
    { value: "", label: "전체" },
    { value: "LISTED", label: "매물 등록" },
    { value: "NEGOTIATING", label: "협상 중" },
    { value: "INTENT_SIGNED", label: "가계약" },
    { value: "CANCELLED", label: "계약 취소" },
    { value: "CONTRACTED", label: "계약 체결" },
    { value: "IN_PROGRESS", label: "계약 진행 중" },
    { value: "PAID_COMPLETE", label: "잔금 지급 완료" },
    { value: "REGISTERED", label: "등기 완료" },
    { value: "MOVED_IN", label: "입주 완료" },
    { value: "TERMINATED", label: "계약 종료" },
  ];

  const periodMapping: Record<string, string> = {
    "6개월 이내 만료 예정": "6개월 이내",
    "3개월 이내 만료 예정": "3개월 이내",
    "1개월 이내 만료 예정": "1개월 이내",
  };

  const categoryKeywordMap: Record<string, string> = {
    매매: "SALE",
    전세: "DEPOSIT",
    월세: "MONTHLY",
  };

  const sortOptions = [
    { value: "LATEST", label: "최신순" },
    { value: "OLDEST", label: "오래된순" },
    { value: "EXPIRING", label: "만료임박순" },
  ];

  const [contractList, setContractList] = useState<ContractItem[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [, setLoading] = useState<boolean>(true);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [selectedSort, setSelectedSort] = useState<string>("LATEST");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  const mappedCategory = categoryKeywordMap[searchKeyword] || "";

  const { user } = useUserStore();
  const navigate = useNavigate();

  const fetchContractData = useCallback(() => {
    setLoading(true);
    apiClient
      .get("/contracts", {
        params: {
          category: mappedCategory,
          customerName: searchKeyword,
          address: searchKeyword,
          period: selectedPeriod || "",
          status: selectedStatus,
          sort: selectedSort,
          page: page+1,
          size: rowsPerPage,
        },
      })
      .then((res) => {
        const contractData = res?.data?.data?.contracts;
        const pageInfo = res?.data?.data;
        setContractList(contractData || []);
        setTotalElements(pageInfo?.totalElements || 0);
      })
      .catch((error) => {
        console.error("Failed to fetch contracts:", error);
        setContractList([]);
      })
      .finally(() => {
        setLoading(false);
        setFilterModalOpen(false);
      });
  }, [searchKeyword, selectedPeriod, selectedStatus, selectedSort, page, rowsPerPage]);

  useEffect(() => {
    fetchContractData();
  }, [fetchContractData]);

  const handlePeriodClick = (label: string) => {
    const backendValue = periodMapping[label];
    setSelectedPeriod((prev) => (prev === backendValue ? null : backendValue));
  };

  return (
    <div className={styles.container}>
      <PageHeader title="계약 목록" userName={user?.name || ""} />

      <div className={styles.contents}>
        <div className={styles.controlsContainer}>
          <div className={styles.searchBarRow}>
            <Select
              options={sortOptions}
              value={sortOptions.find((opt) => opt.value === selectedSort)}
              onChange={(selected) => setSelectedSort(selected?.value || "")}
              placeholder="정렬 기준"
              classNamePrefix="custom-select"
              menuShouldScrollIntoView={false}
              styles={{ control: (base, state) => ({ ...base, width: 140, borderRadius: 14, border: state.isFocused ? "1.5px solid #1976d2" : "1.5px solid #ccc", fontSize: 13, minHeight: 36, paddingLeft: 8, boxShadow: "none", "&:hover": { borderColor: "#1976d2" } }), menu: (base) => ({ ...base, borderRadius: 8, zIndex: 9999, maxHeight: "none" }) }}
            />

            <div className={styles.searchInputWrapper}>
              <input
                className={styles.searchInput}
                placeholder="검색어를 입력해주세요"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") fetchContractData();
                }}
              />
            </div>
          </div>

          <div className={styles.topFilterRow}>
            <div className={styles.filterGroup}>
              <Select
                options={statusOptions}
                value={statusOptions.find((opt) => opt.value === selectedStatus)}
                onChange={(selected) => setSelectedStatus(selected?.value ?? "")}
                placeholder="상태 선택"
                classNamePrefix="custom-select"
                menuShouldScrollIntoView={false}
                styles={{ control: (base, state) => ({ ...base, borderRadius: 14, border: state.isFocused ? "1.5px solid #1976d2" : "1.5px solid #ccc", fontSize: 13, minHeight: 36, paddingLeft: 8, boxShadow: "none", "&:hover": { borderColor: "#1976d2" } }), menu: (base) => ({ ...base, borderRadius: 8, zIndex: 9999, maxHeight: "none" }) }}
              />

              <div className={styles.filterButtons}>
                {Object.keys(periodMapping).map((label) => (
                  <button
                    key={label}
                    className={periodMapping[label] === selectedPeriod ? `${styles.filterButton} ${styles.filterButtonActive}` : styles.filterButton}
                    onClick={() => handlePeriodClick(label)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <button className={styles.outlinedButton} onClick={() => setIsAddModalOpen(true)}>
              + 계약 등록
            </button>
          </div>
        </div>

        <ContractTable
          contractList={contractList}
          totalElements={totalElements}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          onRowClick={(contract) => navigate(`/contracts/${contract.uid}`)}
        />

        <ContractFilterModal
          open={filterModalOpen}
          onClose={() => setFilterModalOpen(false)}
          initialFilter={{ period: selectedPeriod || "", status: selectedStatus }}
          onApply={({ period, status }) => {
            setSelectedPeriod(period || null);
            setSelectedStatus(status);
          }}
        />

        <ContractAddModal
          open={isAddModalOpen}
          handleClose={() => setIsAddModalOpen(false)}
          fetchContractData={fetchContractData}
        />
      </div>
    </div>
  );
}

export default ContractListPage;