import Table, { ColumnConfig, RowData } from "@/components/Table/Table";
import { Property, PropertyCategory } from "@/types/property";
import { formatDate } from "@/utils/dateUtil";
import { Typography, Chip } from "@mui/material";
import MobilePagination from "@/components/MobilePagination";
import PropertyCard from "./PropertyCard";
import {
  getPropertyTypeColors,
  getPropertyCategoryColors,
} from "@/constants/property";
import { formatKoreanPrice } from "@/utils/numberUtil";

type PropertyRowData = RowData & Property;

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

  const getPriceText = (property: Property) => {
    if (property.type === "SALE") {
      return property.price ? formatKoreanPrice(property.price) : "-";
    } else if (property.type === "DEPOSIT") {
      return property.deposit ? formatKoreanPrice(property.deposit) : "-";
    } else {
      const deposit = property.deposit
        ? formatKoreanPrice(property.deposit)
        : "-";
      const monthly = property.monthlyRent
        ? formatKoreanPrice(property.monthlyRent)
        : "-";
      return `${deposit}/${monthly}`;
    }
  };

  const getCategoryChipColor = (category: string) => {
    return getPropertyCategoryColors(category).text;
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
          variant="outlined"
          className="text-xs h-6"
          style={{
            borderColor: getCategoryChipColor(row.realCategory),
            color: getCategoryChipColor(row.realCategory),
          }}
          sx={{
            "& .MuiChip-label": {
              padding: "0 8px",
            },
          }}
        />
      ),
    },
    {
      key: "type",
      label: "거래 유형",
      width: "120px",
      render: (_, row) => {
        const colors = getPropertyTypeColors(row.type);
        return (
          <Chip
            label={getPropertyTypeText(row.type)}
            sx={{
              backgroundColor: colors.background,
              color: colors.text,
            }}
            size="small"
            className="text-sm"
          />
        );
      },
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
          {getPriceText(row)}
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
              입주 가능일: {formatDate(row.moveInDate)}
            </Typography>
          )}
          {row.details ? (
            <Typography variant="body2" className="mt-1">
              {row.details.length > 20
                ? row.details.slice(0, 20) + "..."
                : row.details}
            </Typography>
          ) : (
            <Typography variant="body2" className="mt-1" color="text.secondary">
              -
            </Typography>
          )}
        </div>
      ),
    },
  ];

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
    <>
      {/* 모바일 카드 UI (md 미만) */}
      <div className="lg:hidden">
        {propertyList.length > 0 ? (
          <>
            {propertyList.map((property) => (
              <PropertyCard
                key={property.uid}
                property={property}
                onRowClick={onRowClick}
              />
            ))}
            <MobilePagination
              page={page}
              totalElements={totalElements}
              rowsPerPage={rowsPerPage}
              onPageChange={(_, newPage) => onPageChange(newPage)}
            />
          </>
        ) : (
          <div className="text-center py-8 text-gray-500 text-base">
            매물이 없습니다.
          </div>
        )}
      </div>

      {/* 데스크톱 테이블 UI (md 이상) */}
      <div className="hidden lg:block">
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
          hidePaginationControls={true}
        />
      </div>
    </>
  );
};

export default AgentPropertyTable;
