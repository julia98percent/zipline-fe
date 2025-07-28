import { useState } from "react";
import Button from "@components/Button";
import CustomerAddModal from "./CustomerAddModal";
import CustomerBulkUploadModal from "./CustomerBulkUploadModal";
import AddIcon from "@mui/icons-material/Add";

interface Props {
  fetchCustomerData: () => void;
}

function CustomerAddButtonList({ fetchCustomerData }: Props) {
  const [open, setOpen] = useState(false);
  const [openBulkUpload, setOpenBulkUpload] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenBulkUpload = () => setOpenBulkUpload(true);
  const handleCloseBulkUpload = () => setOpenBulkUpload(false);

  return (
    <>
      <div className="hidden lg:flex gap-2">
        <Button variant="contained" onClick={handleOpen}>
          <AddIcon fontSize="small" />
          고객 등록
        </Button>

        <Button variant="outlined" onClick={handleOpenBulkUpload}>
          고객 데이터 일괄 등록(.csv)
        </Button>
      </div>

      {/* Mobile view - below 768px */}
      <div className="flex lg:hidden flex-col gap-3 w-full">
        <Button
          variant="contained"
          onClick={handleOpen}
          className="w-full py-4 text-base font-medium min-h-[48px]"
        >
          <AddIcon fontSize="small" className="mr-2" />
          고객 등록
        </Button>

        <Button
          variant="outlined"
          onClick={handleOpenBulkUpload}
          className="w-full py-4 text-base font-medium min-h-[48px]"
        >
          고객 데이터 일괄 등록(.csv)
        </Button>
      </div>

      <CustomerAddModal
        open={open}
        handleClose={handleClose}
        fetchCustomerList={fetchCustomerData}
      />
      <CustomerBulkUploadModal
        open={openBulkUpload}
        handleClose={handleCloseBulkUpload}
        fetchCustomerData={fetchCustomerData}
      />
    </>
  );
}

export default CustomerAddButtonList;
