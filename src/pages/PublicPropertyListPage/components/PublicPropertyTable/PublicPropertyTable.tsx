import { useEffect, useState } from "react";
import { PublicPropertyItem } from "@ts/property";
import PublicPropertyTableView from "./PublicPropertyTableView";

interface Props {
  propertyList: PublicPropertyItem[];
  totalElements: number;
  totalPages: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newSize: number) => void;
  onSort: (field: string) => void;
  sortFields: { [key: string]: string };
  useMetric: boolean;
}

const PublicPropertyTable = ({
  propertyList,
  totalElements,
  totalPages,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onSort,
  sortFields,
  useMetric,
}: Props) => {
  const [pageInput, setPageInput] = useState<string>("");

  const handleChangePage = (_: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
  };

  const handlePageInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPageInput(event.target.value);
  };

  const handlePageInputSubmit = () => {
    const newPage = parseInt(pageInput) - 1;
    if (!isNaN(newPage) && newPage >= 0 && newPage < totalPages) {
      onPageChange(newPage);
    }
  };

  // Update input value when page changes
  useEffect(() => {
    setPageInput((page + 1).toString());
  }, [page]);

  return (
    <PublicPropertyTableView
      propertyList={propertyList}
      totalElements={totalElements}
      totalPages={totalPages}
      page={page}
      rowsPerPage={rowsPerPage}
      onSort={onSort}
      sortFields={sortFields}
      useMetric={useMetric}
      pageInput={pageInput}
      onPageInputChange={handlePageInputChange}
      onPageInputSubmit={handlePageInputSubmit}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  );
};

export default PublicPropertyTable;
