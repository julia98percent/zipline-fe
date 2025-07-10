import { Box } from "@mui/material";
import { PublicPropertyItem } from "@ts/property";
import Table, { ColumnConfig, RowData } from "@components/Table";
import { PropertyCellRenderer, SortableHeader } from "./components";

interface Props {
  propertyList: PublicPropertyItem[];
  totalElements: number;
  totalPages: number;
  page: number;
  rowsPerPage: number;
  onSort: (field: string) => void;
  sortFields: { [key: string]: string };
  useMetric: boolean;
  pageInput: string;
  onPageInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPageInputSubmit: () => void;
  onPageChange: (_: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PublicPropertyTableView = ({
  propertyList,
  totalElements,
  totalPages,
  page,
  rowsPerPage,
  onSort,
  sortFields,
  useMetric,
  pageInput,
  onPageInputChange,
  onPageInputSubmit,
  onPageChange,
  onRowsPerPageChange,
}: Props) => {
  // 컬럼 설정
  const columns: ColumnConfig<PublicPropertyItem>[] = [
    {
      key: "platform",
      label: "플랫폼",
      align: "center",
      render: (_, property) => (
        <PropertyCellRenderer.Platform platform={property.platform} />
      ),
    },
    {
      key: "category",
      label: "매물 유형",
      align: "center",
      render: (_, property) => (
        <PropertyCellRenderer.Category category={property.category} />
      ),
    },
    {
      key: "buildingInfo",
      label: "건물 정보",
      align: "center",
      render: (_, property) => (
        <PropertyCellRenderer.BuildingInfo property={property} />
      ),
    },
    {
      key: "address",
      label: "주소",
      align: "center",
      render: (_, property) => (
        <PropertyCellRenderer.Address address={property.address} />
      ),
    },
    {
      key: "description",
      label: "설명",
      align: "center",
      render: (_, property) => (
        <PropertyCellRenderer.Description description={property.description} />
      ),
    },
    {
      key: "price",
      label: (
        <SortableHeader
          field="price"
          label="매매 가격"
          sortFields={sortFields}
          onSort={onSort}
        />
      ),
      align: "center",
      render: (_, property) => (
        <PropertyCellRenderer.Price price={property.price} />
      ),
    },
    {
      key: "deposit",
      label: (
        <SortableHeader
          field="deposit"
          label="보증금"
          sortFields={sortFields}
          onSort={onSort}
        />
      ),
      align: "center",
      render: (_, property) => (
        <PropertyCellRenderer.Price price={property.deposit} />
      ),
    },
    {
      key: "monthlyRent",
      label: (
        <SortableHeader
          field="monthlyRent"
          label="월세"
          sortFields={sortFields}
          onSort={onSort}
        />
      ),
      align: "center",
      render: (_, property) => (
        <PropertyCellRenderer.MonthlyRent monthlyRent={property.monthlyRent} />
      ),
    },
    {
      key: "netArea",
      label: (
        <SortableHeader
          field="netArea"
          label="전용면적"
          unit={useMetric ? "(m²)" : "(평)"}
          sortFields={sortFields}
          onSort={onSort}
        />
      ),
      align: "center",
      render: (_, property) => (
        <PropertyCellRenderer.Area
          area={property.netArea}
          useMetric={useMetric}
        />
      ),
    },
    {
      key: "totalArea",
      label: (
        <SortableHeader
          field="totalArea"
          label="공급면적"
          unit={useMetric ? "(m²)" : "(평)"}
          sortFields={sortFields}
          onSort={onSort}
        />
      ),
      align: "center",
      render: (_, property) => (
        <PropertyCellRenderer.Area
          area={property.totalArea ?? 0}
          useMetric={useMetric}
        />
      ),
    },
  ];

  // 테이블 데이터 변환
  const tableData = propertyList.map((property) => property);

  return (
    <Box sx={{ width: "100%", mt: "0px" }}>
      <Table
        columns={columns as ColumnConfig[]}
        bodyList={tableData as unknown as RowData[]}
        pagination={false}
        noDataMessage="매물 데이터가 없습니다"
        sx={{
          minWidth: 650,
          "& .MuiTableCell-root": {
            maxWidth: "300px",
            whiteSpace: "normal",
            padding: "12px 16px",
          },
          "& .MuiTableCell-head": {
            fontWeight: 600,
          },
        }}
      />
      <CustomPagination
        pageInput={pageInput}
        totalPages={totalPages}
        totalElements={totalElements}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageInputChange={onPageInputChange}
        onPageInputSubmit={onPageInputSubmit}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </Box>
  );
};

export default PublicPropertyTableView;
