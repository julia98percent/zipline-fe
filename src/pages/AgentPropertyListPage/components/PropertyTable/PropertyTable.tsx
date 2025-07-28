import { useState } from "react";
import { Box, FormControlLabel, Chip } from "@mui/material";
import IOSSwitch from "@components/Switch";
import Table, { ColumnConfig, RowData } from "@components/Table";
import { Property, PropertyCategory, PropertyType } from "@ts/property";
import { ContractCategory } from "@ts/contract";

interface Props {
  propertyList: Property[];
  onRowClick?: (property: Property) => void;
  totalElements: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface PropertyRowData extends RowData {
  id: string;
  realCategory: Property["realCategory"];
  type: string;
  address: string;
  netArea: number;
  details: string;
}

const categoryColors: Record<
  Property["realCategory"],
  "primary" | "secondary" | "default" | "success" | "error" | "warning" | "info"
> = {
  ONE_ROOM: "primary",
  TWO_ROOM: "primary",
  APARTMENT: "success",
  VILLA: "info",
  HOUSE: "warning",
  OFFICETEL: "secondary",
  COMMERCIAL: "error",
};

// 연한 파스텔톤 색상 매핑
const colorMap: Record<string, string> = {
  SALE: "#e8f5e9", // 연한 초록
  DEPOSIT: "#e3f2fd", // 연한 파랑
  MONTHLY: "#fff3e0", // 연한 주황
};
const textColorMap: Record<string, string> = {
  SALE: "#388e3c", // 진한 초록
  DEPOSIT: "#1976d2", // 진한 파랑
  MONTHLY: "#f57c00", // 진한 주황
};
const translateType = (type: keyof typeof ContractCategory): string => {
  return ContractCategory[type] ?? "-";
};

const translateRealCategory = (
  category: keyof typeof PropertyCategory
): string => {
  return PropertyCategory[category] ?? "-";
};

const PropertyTable = ({
  propertyList,
  onRowClick,
  totalElements,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: Props) => {
  const [useMetric, setUseMetric] = useState(true);

  const handleToggleUnitChange = () => {
    setUseMetric(!useMetric);
  };

  const convertToKoreanPyeong = (squareMeters: number) => {
    return (squareMeters / 3.3).toFixed(1);
  };

  const formatArea = (netArea: number) => {
    if (!netArea) return "-";
    return useMetric ? `${netArea}㎡` : `${convertToKoreanPyeong(netArea)}평`;
  };

  const columns: ColumnConfig<PropertyRowData>[] = [
    {
      key: "realCategory",
      label: "매물 유형",
      align: "center",
      render: (value) => (
        <Chip
          label={translateRealCategory(value as Property["realCategory"])}
          color={categoryColors[value as Property["realCategory"]] || "default"}
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      key: "type",
      label: "매물 타입",
      align: "center",
      render: (value) => (
        <Chip
          label={translateType(value as PropertyType)}
          className="font-medium text-sm"
          sx={{
            backgroundColor: colorMap[value as PropertyType] || "#e0e0e0",
            color: textColorMap[value as PropertyType] || "#222",
          }}
          size="small"
        />
      ),
    },
    {
      key: "address",
      label: "주소",
      align: "center",
    },
    {
      key: "netArea",
      label: "면적(전용)",
      align: "center",
      render: (value) => formatArea(value as number),
    },
    {
      key: "details",
      label: "기타",
      align: "center",
      render: (value) => {
        const details = value as string;
        if (!details) return "-";
        return details.length > 20 ? details.slice(0, 20) + "..." : details;
      },
    },
  ];

  const rows: PropertyRowData[] = propertyList.map((property) => ({
    id: property.uid.toString(),
    realCategory: property.realCategory,
    type: property.type,
    address:
      `${property.address ?? ""}${
        property.detailAddress ? ` ${property.detailAddress}` : ""
      }`.trim() || "-",
    netArea: property.netArea,
    details: property.details || "",
  }));

  const handleRowClick = (_rowData: PropertyRowData, index: number) => {
    const originalProperty = propertyList[index];
    onRowClick?.(originalProperty);
  };

  return (
    <Box className="w-full mt-7">
      <FormControlLabel
        control={
          <IOSSwitch
            checked={useMetric}
            onChange={handleToggleUnitChange}
            color="primary"
            size="small"
          />
        }
        label={useMetric ? "제곱미터(m²)" : "평(py)"}
        className="mb-4 ml-0"
        sx={{
          "& .MuiFormControlLabel-label": {
            fontSize: "14px",
            marginLeft: "4px",
            fontWeight: 500,
          },
        }}
      />
      <Table<PropertyRowData>
        columns={columns}
        bodyList={rows}
        handleRowClick={handleRowClick}
        totalElements={totalElements}
        page={page}
        handleChangePage={onPageChange}
        rowsPerPage={rowsPerPage}
        handleChangeRowsPerPage={onRowsPerPageChange}
        noDataMessage="매물 데이터가 없습니다"
        className="min-w-[650px] border-none shadow-sm"
      />
    </Box>
  );
};

export default PropertyTable;
