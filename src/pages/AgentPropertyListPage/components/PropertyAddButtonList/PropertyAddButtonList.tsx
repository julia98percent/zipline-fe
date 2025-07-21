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
      <div>
        <Button
          variant="contained"
          onClick={handleOpen}
          className="bg-[#164F9E] shadow-none h-9 text-xs px-4 hover:bg-[#0D3B7A] hover:shadow-none flex items-center gap-2"
        >
          <AddIcon fontSize="small" />
          매물 등록
        </Button>

        <Button
          variant="outlined"
          onClick={handleOpenBulkUpload}
          className="text-[#164F9E] min-h-[32px] border-[#164F9E] ml-3 hover:border-[#0D3B7A] hover:text-[#0D3B7A] hover:bg-[rgba(22,79,158,0.08)]"
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
