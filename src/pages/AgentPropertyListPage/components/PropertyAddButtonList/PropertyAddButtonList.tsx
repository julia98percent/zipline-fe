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
      <div className="flex gap-2">
        <Button
          variant="contained"
          onClick={handleOpen}
          startIcon={<AddIcon />}
        >
          매물 등록
        </Button>

        <Button variant="outlined" onClick={handleOpenBulkUpload}>
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
