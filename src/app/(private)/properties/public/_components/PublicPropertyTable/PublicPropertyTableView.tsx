import { PublicPropertyItem } from "@/types/property";
import Table, { ColumnConfig, RowData } from "@/components/Table";
import { PropertyCellRenderer, SortableHeader } from "./components";

interface Props {
  propertyList: PublicPropertyItem[];
  onSort: (field: string) => void;
  sortField?: string;
  isAscending?: boolean;
  useMetric: boolean;
}

const PublicPropertyTableView = ({
  propertyList,
  onSort,
  sortField,
  isAscending,
  useMetric,
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
      minWidth: 90,
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
          sortField={sortField}
          isAscending={isAscending}
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
          sortField={sortField}
          isAscending={isAscending}
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
          sortField={sortField}
          isAscending={isAscending}
          onSort={onSort}
        />
      ),
      align: "center",
      render: (_, property) => (
        <PropertyCellRenderer.Price price={property.monthlyRent} />
      ),
    },
    {
      key: "netArea",
      label: (
        <SortableHeader
          field="netArea"
          label="전용면적"
          unit={useMetric ? "(m²)" : "(평)"}
          sortField={sortField}
          isAscending={isAscending}
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
          sortField={sortField}
          isAscending={isAscending}
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

  const tableData = propertyList.map((property) => property);

  return (
    <div className="w-full mt-0 card">
      <Table
        columns={columns as ColumnConfig[]}
        bodyList={tableData as unknown as RowData[]}
        pagination={false}
        noDataMessage="매물 데이터가 없습니다"
        className="min-w-[650px]  rounded-lg shadow-sm"
        sx={{
          "& .MuiTableCell-root": {
            maxWidth: "300px",
            whiteSpace: "normal",
            padding: "12px 16px",
          },
          "& .MuiTableCell-head": {
            fontWeight: 600,
            position: "sticky",
            top: 0,
            background: "#fff",
            zIndex: 2,
          },
          "& .MuiTableContainer-root": {
            borderRadius: "8px",
          },
        }}
      />
    </div>
  );
};

export default PublicPropertyTableView;
