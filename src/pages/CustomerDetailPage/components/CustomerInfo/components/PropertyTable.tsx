import { Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { formatKoreanPrice } from "@utils/numberUtil";
import Table, { ColumnConfig } from "@components/Table";
import { PropertyRowData } from "./CustomerInfoTabPanel";
import { Property } from "@ts/property";

interface PropertyTableProps {
  properties: Property[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  loading: boolean;
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "SALE":
      return {
        backgroundColor: "#E9F7EF",
        color: "#219653",
      };
    case "DEPOSIT":
      return {
        backgroundColor: "#FDEEEE",
        color: "#EB5757",
      };
    case "MONTHLY":
      return {
        backgroundColor: "#FEF5EB",
        color: "#F2994A",
      };
    default:
      return {
        backgroundColor: "#F5F5F5",
        color: "#757575",
      };
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case "SALE":
      return "매매";
    case "DEPOSIT":
      return "전세";
    case "MONTHLY":
      return "월세";
    default:
      return "기타";
  }
};

function PropertyTable({
  properties,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  loading,
}: PropertyTableProps) {
  const navigate = useNavigate();

  const handleRowClick = (rowData: PropertyRowData) => {
    navigate(`/properties/${rowData.uid}`);
  };

  const columns: ColumnConfig<PropertyRowData>[] = [
    {
      key: "address",
      label: "주소",
      width: "28%",
      render: (_: unknown, row: PropertyRowData) =>
        `${row.address ?? ""}${
          row.detailAddress ? " " + row.detailAddress : ""
        }`,
    },
    {
      key: "type",
      label: "유형",
      width: "5%",
      render: (value: unknown) => (
        <Chip
          label={getTypeLabel(value as string)}
          size="small"
          sx={getTypeColor(value as string)}
        />
      ),
    },
    {
      key: "price",
      label: "매매가",
      width: "20%",
      render: (value: unknown) =>
        value ? formatKoreanPrice(value as number) : "-",
    },
    {
      key: "deposit",
      label: "보증금",
      width: "17%",
      render: (value: unknown) =>
        value ? formatKoreanPrice(value as number) : "-",
    },
    {
      key: "monthlyRent",
      label: "월세",
      width: "17%",
      render: (value: unknown) =>
        value ? formatKoreanPrice(value as number) : "-",
    },
    {
      key: "moveInDate",
      label: "입주가능일",
      width: "12%",
      render: (value: unknown) =>
        value ? new Date(value as string).toLocaleDateString() : "-",
    },
  ];

  const bodyList: PropertyRowData[] = properties.map((property) => ({
    id: property.uid,
    address: property.address,
    detailAddress: property.detailAddress,
    type: property.type,
    price: Number(property.price),
    deposit: Number(property.deposit),
    monthlyRent: Number(property.monthlyRent),
    moveInDate: property.moveInDate,
    uid: property.uid,
  }));

  return (
    <Table
      isLoading={loading}
      columns={columns}
      bodyList={bodyList}
      handleRowClick={handleRowClick}
      totalElements={totalCount}
      page={page}
      handleChangePage={(_, newPage) => onPageChange(newPage)}
      rowsPerPage={rowsPerPage}
      handleChangeRowsPerPage={(e) =>
        onRowsPerPageChange(Number(e.target.value))
      }
      noDataMessage="등록된 매물이 없습니다"
      pagination={true}
      sx={{
        "& .MuiTableRow-root": {
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        },
      }}
    />
  );
}

export default PropertyTable;
