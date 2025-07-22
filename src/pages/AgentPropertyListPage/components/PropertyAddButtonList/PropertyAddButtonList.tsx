import { useState } from "react";
import Button from "@components/Button";
import PropertyAddModal from "./PropertyAddModal";
import BulkUploadModal from "./BulkUploadModal";
import AddIcon from "@mui/icons-material/Add";

interface Props {
  fetchPropertyData: () => void;
}

function PropertyAddButtonList({ fetchPropertyData }: Props) {
  const [open, setOpen] = useState(false);
  const [openBulkUpload, setOpenBulkUpload] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenBulkUpload = () => setOpenBulkUpload(true);
  const handleCloseBulkUpload = () => setOpenBulkUpload(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
        <Button
          variant="contained"
          onClick={handleOpen}
          className="w-full sm:w-auto"
        >
          <AddIcon fontSize="small" />
          매물 등록
        </Button>

        <Button
          variant="outlined"
          onClick={handleOpenBulkUpload}
          className="text-[#164F9E] min-h-[32px] border-[#164F9E] sm:ml-3 hover:border-[#0D3B7A] hover:text-[#0D3B7A] hover:bg-[rgba(22,79,158,0.08)] w-full sm:w-auto"
        >
          매물 데이터 일괄 등록(.csv)
        </Button>
      </div>
      <PropertyAddModal
        open={open}
        handleClose={handleClose}
        fetchPropertyData={fetchPropertyData}
      />
      <BulkUploadModal
        open={openBulkUpload}
        handleClose={handleCloseBulkUpload}
        fetchPropertyData={fetchPropertyData}
      />
    </>
  );
}

export default PropertyAddButtonList;
