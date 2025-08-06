import { Box } from "@mui/material";
import Table, { ColumnConfig } from "@components/Table/Table";
import MobilePagination from "@components/MobilePagination";
import dayjs from "dayjs";
import { PreCounsel } from "@ts/counsel";
import PreCounselCard from "./PreCounselCard";

interface Props {
  counsels: PreCounsel[];
  isLoading: boolean;
  page: number;
  rowsPerPage: number;
  totalElements: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRowClick: (surveyResponseUid: number) => void;
}

const PreCounselTable = ({
  counsels,
  isLoading,
  page,
  rowsPerPage,
  totalElements,
  onPageChange,
  onRowsPerPageChange,
  onRowClick,
}: Props) => {
  const columns: ColumnConfig<PreCounsel>[] = [
    {
      key: "name",
      label: "이름",
      render: (value) => value as string,
    },
    {
      key: "phoneNumber",
      label: "전화번호",
      render: (value) => value as string,
    },
    {
      key: "submittedAt",
      label: "상담 요청일",
      render: (value) => dayjs(value as string).format("YYYY-MM-DD HH:mm"),
    },
  ];

  const handleChangePage = (_: unknown, newPage: number) => {
    onPageChange(_, newPage);
  };

  return (
    <Box className="w-full">
      {/* Desktop view - 768px and above */}
      <Box className="hidden lg:block">
        <Table
          isLoading={isLoading}
          columns={columns}
          bodyList={counsels.map((counsel) => ({
            ...counsel,
            id: counsel.surveyResponseUid + counsel.name,
          }))}
          handleRowClick={(rowData) =>
            onRowClick(rowData.surveyResponseUid as number)
          }
          totalElements={totalElements}
          page={page}
          handleChangePage={onPageChange}
          rowsPerPage={rowsPerPage}
          handleChangeRowsPerPage={onRowsPerPageChange}
          noDataMessage="사전 상담 요청이 없습니다."
          pagination={true}
          className="rounded-lg shadow-sm"
        />
      </Box>

      {/* Mobile view - below 768px */}
      <Box className="block lg:hidden">
        {counsels.length === 0 ? (
          <Box className="text-center py-8 text-gray-500">
            사전 상담 요청이 없습니다.
          </Box>
        ) : (
          <>
            <Box className="space-y-4">
              {counsels.map((counsel) => (
                <PreCounselCard
                  key={counsel.surveyResponseUid}
                  counsel={counsel}
                  onRowClick={onRowClick}
                />
              ))}
            </Box>
            <MobilePagination
              page={page}
              totalElements={totalElements}
              rowsPerPage={rowsPerPage}
              onPageChange={onPageChange}
            />
          </>
        )}
      </Box>
    </Box>
  );
};

export default PreCounselTable;
