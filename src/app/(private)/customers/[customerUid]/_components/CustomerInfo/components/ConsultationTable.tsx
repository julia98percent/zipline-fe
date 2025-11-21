import { Chip } from "@mui/material";
import { useRouter } from "next/navigation";
import Table, { ColumnConfig } from "@/components/Table";
import { Counsel } from "@/types/counsel";
import { ConsultationRowData } from "./CustomerInfoTabPanel";
import { SUCCESS, WARNING } from "@/constants/colors";

interface ConsultationTableProps {
  counselList: Counsel[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  loading?: boolean;
}

function ConsultationTable({
  counselList = [],
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  loading = false,
}: ConsultationTableProps) {
  const router = useRouter();

  const handleRowClick = (rowData: ConsultationRowData) => {
    router.push(`/counsels/general/${rowData.counselUid}`);
  };

  const columns: ColumnConfig<ConsultationRowData>[] = [
    {
      key: "title",
      label: "제목",
    },
    {
      key: "type",
      label: "유형",
    },
    {
      key: "counselDate",
      label: "상담일",
      render: (value) => new Date(value as string).toLocaleDateString(),
    },
    {
      key: "dueDate",
      label: "예정일",
      render: (value) => new Date(value as string).toLocaleDateString(),
    },
    {
      key: "completed",
      label: "상태",
      render: (value) => (
        <Chip
          label={value ? "완료" : "진행 중"}
          size="small"
          sx={{
            backgroundColor: value ? SUCCESS.altLight : WARNING.light,
            color: value ? SUCCESS.alt : WARNING.dark,
            height: "24px",
            "& .MuiChip-label": {
              px: 1,
              fontSize: "12px",
            },
          }}
        />
      ),
    },
  ];

  const bodyList: ConsultationRowData[] = counselList.map((consultation) => ({
    id: consultation.counselUid,
    title: consultation.title,
    type: consultation.type,
    counselDate: consultation.counselDate,
    dueDate: consultation.dueDate,
    completed: consultation.completed,
    counselUid: consultation.counselUid,
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
      noDataMessage="등록된 상담 내역이 없습니다."
      pagination={true}
      sx={{
        "& .MuiTableCell-root": {
          borderBottom: "1px solid #E0E0E0",
        },
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

export default ConsultationTable;
