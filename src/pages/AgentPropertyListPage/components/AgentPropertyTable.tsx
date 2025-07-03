import Table, { ColumnConfig, RowData } from "@components/Table/Table";
import { Property, PropertyCategory, PropertyCategoryType } from "@ts/property";
import { formatDate } from "@utils/dateUtil";
import { Typography, Chip } from "@mui/material";

// Property를 Table 컴포넌트가 기대하는 RowData 형태로 변환
interface PropertyRowData extends RowData {
  customerName: string;
  address: string;
  detailAddress: string;
  legalDistrictCode: string;
  deposit: number | null;
  monthlyRent: number | null;
  price: number | null;
  type: string;
  longitude: number;
  latitude: number;
  moveInDate: string;
  realCategory: PropertyCategoryType;
  petsAllowed: boolean;
  floor: number;
  hasElevator: boolean;
  constructionYear: string;
  parkingCapacity: number;
  netArea: number;
  totalArea: number;
  details?: string;
  uid: string;
}

interface AgentPropertyTableProps {
  propertyList: Property[];
  totalElements: number;
  totalPages: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newSize: number) => void;
  onRowClick?: (property: Property) => void;
}

const AgentPropertyTable = ({
  propertyList,
  totalElements,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onRowClick,
}: AgentPropertyTableProps) => {
  const getPropertyTypeText = (type: string) => {
    switch (type) {
      case "SALE":
        return "매매";
      case "DEPOSIT":
        return "전세";
      case "MONTHLY":
        return "월세";
      default:
        return type;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR").format(amount) + "원";
  };

  const getPriceText = (property: Property) => {
    if (property.type === "SALE") {
      return property.price ? formatCurrency(property.price) : "-";
    } else if (property.type === "DEPOSIT") {
      return property.deposit ? formatCurrency(property.deposit) : "-";
    } else {
      const deposit = property.deposit ? formatCurrency(property.deposit) : "0";
      const monthly = property.monthlyRent
        ? formatCurrency(property.monthlyRent)
        : "0";
      return `${deposit}/${monthly}`;
    }
  };

  // 컬럼 정의
  const columns: ColumnConfig<PropertyRowData>[] = [
    {
      key: "realCategory",
      label: "매물 유형",
      width: "120px",
      render: (_, row) => (
        <Chip
          label={PropertyCategory[row.realCategory]}
          size="small"
          color="primary"
          variant="outlined"
        />
      ),
    },
    {
      key: "type",
      label: "거래 유형",
      width: "120px",
      render: (_, row) => (
        <Chip
          label={getPropertyTypeText(row.type)}
          size="small"
          color={
            row.type === "SALE"
              ? "error"
              : row.type === "DEPOSIT"
              ? "warning"
              : "success"
          }
        />
      ),
    },
    {
      key: "address",
      label: "주소",
      width: "300px",
      render: (_, row) => (
        <div>
          <Typography variant="body2">{row.address}</Typography>
          {row.detailAddress && (
            <Typography variant="caption" color="text.secondary">
              {row.detailAddress}
            </Typography>
          )}
        </div>
      ),
    },
    {
      key: "netArea",
      label: "전용 면적",
      width: "120px",
      render: (_, row) => `${row.netArea.toFixed(1)}m²`,
    },
    {
      key: "price",
      label: "가격",
      width: "150px",
      render: (_, row) => (
        <Typography variant="body2" fontWeight="bold">
          {getPriceText(row as Property)}
        </Typography>
      ),
    },
    {
      key: "details",
      label: "기타",
      width: "200px",
      render: (_, row) => (
        <div>
          {row.moveInDate && (
            <Typography variant="caption" color="text.secondary">
              입주: {formatDate(row.moveInDate)}
            </Typography>
          )}
          {row.details ? (
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {row.details.length > 20
                ? row.details.slice(0, 20) + "..."
                : row.details}
            </Typography>
          ) : (
            <Typography variant="body2" sx={{ mt: 0.5 }} color="text.secondary">
              -
            </Typography>
          )}
        </div>
      ),
    },
  ];

  // Property 데이터를 RowData 형태로 변환
  const tableData: PropertyRowData[] = propertyList.map((property) => ({
    ...property,
    id: property.uid,
  }));

  const handleChangePage = (_: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
  };

  const handleRowClick = (rowData: PropertyRowData) => {
    onRowClick?.(rowData as Property);
  };

  return (
    <Table
      columns={columns}
      bodyList={tableData}
      totalElements={totalElements}
      page={page}
      rowsPerPage={rowsPerPage}
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleRowClick={onRowClick ? handleRowClick : undefined}
      pagination={true}
      rowsPerPageOptions={[5, 10, 25, 50]}
    />
  );
};

export default AgentPropertyTable;
