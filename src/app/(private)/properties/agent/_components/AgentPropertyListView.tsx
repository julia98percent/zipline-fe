import dynamic from "next/dynamic";
import { SelectChangeEvent } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useRouter } from "next/navigation";
import Select, { MenuItem } from "@/components/Select";
import AgentPropertyTable from "./AgentPropertyTable";
import { Property } from "@/types/property";
import { AgentPropertySearchParams } from "@/apis/propertyService";
import Button from "@/components/Button";
import CircularProgress from "@/components/CircularProgress";

const AgentPropertyFilterModal = dynamic(
  () => import("./AgentPropertyFilterModal"),
  {
    ssr: false,
  }
);

const PropertyAddButtonList = dynamic(() => import("./PropertyAddButtonList"), {
  ssr: false,
  loading: () => <div className="w-32 h-9 bg-gray-200 animate-pulse rounded" />,
});

interface CategoryOption {
  value: string;
  label: string;
}

interface TypeOption {
  value: string;
  label: string;
}

interface AgentPropertyListViewProps {
  loading: boolean;
  agentPropertyList: Property[];
  totalElements: number;
  searchParams: AgentPropertySearchParams;
  showFilterModal: boolean;
  categoryOptions: CategoryOption[];
  typeOptions: TypeOption[];
  onCategoryChange: (event: SelectChangeEvent<unknown>) => void;
  onFilterApply: (newFilters: Partial<AgentPropertySearchParams>) => void;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newSize: number) => void;
  onFilterModalToggle: () => void;
  onFilterModalClose: () => void;
  onReset: () => void;
  onSaveProperty: () => void;
}

const AgentPropertyListView = ({
  loading,
  agentPropertyList,
  totalElements,
  searchParams,
  showFilterModal,
  categoryOptions,
  typeOptions,
  onCategoryChange,
  onFilterApply,
  onPageChange,
  onRowsPerPageChange,
  onFilterModalToggle,
  onFilterModalClose,
  onReset,
  onSaveProperty,
}: AgentPropertyListViewProps) => {
  const router = useRouter();

  const handleRowClick = (property: Property) => {
    router.push(`/properties/agent/${property.uid}`);
  };

  if (loading) {
    return (
      <div className="flex-grow bg-neutral-50 min-h-screen">
        <div className="flex items-center justify-center h-[calc(100vh-72px)]">
          <CircularProgress />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-neutral-50 min-h-screen">
      <div className="pt-0 p-6">
        <div className="flex flex-col gap-4 card p-3 mb-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
              <Select
                label="매물 카테고리"
                value={searchParams.category || ""}
                onChange={onCategoryChange}
                showEmptyOption={false}
                aria-label="매물 카테고리"
                className="min-w-36 w-full sm:w-auto"
              >
                {categoryOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value || ""}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outlined"
                  onClick={onFilterModalToggle}
                  startIcon={<FilterListIcon />}
                  className="flex-1 sm:flex-none"
                >
                  상세 필터
                </Button>
                <Button variant="text" onClick={onReset} className="flex-1 sm:flex-none">
                  필터 초기화
                </Button>
              </div>
            </div>
            <PropertyAddButtonList fetchPropertyData={onSaveProperty} />
          </div>
        </div>

        {/* 매물 개수 표시 */}
        <div className="px-2 mb-5 text-sm text-gray-700 font-medium">
          총 {totalElements.toLocaleString()}개
        </div>

        {/* 테이블 */}
        <AgentPropertyTable
          propertyList={agentPropertyList}
          totalElements={totalElements}
          totalPages={Math.ceil(totalElements / searchParams.size)}
          page={searchParams.page}
          rowsPerPage={searchParams.size}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          onRowClick={handleRowClick}
        />

        {/* 상세 필터 모달 */}
        <AgentPropertyFilterModal
          open={showFilterModal}
          onClose={onFilterModalClose}
          onApply={onFilterApply}
          filters={searchParams}
          typeOptions={typeOptions}
        />
      </div>
    </div>
  );
};

export default AgentPropertyListView;
