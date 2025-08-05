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
      <div className="hidden sm:flex sm:justify-end gap-2">
        <Button
          variant="contained"
          className="whitespace-nowrap"
          onClick={handleOpen}
        >
          <AddIcon fontSize="small" className="flex md:hidden lg:flex" />
          고객 등록
        </Button>

        <Button
          variant="outlined"
          onClick={handleOpenBulkUpload}
          className="whitespace-nowrap"
        >
          고객 데이터 일괄 등록(.csv)
        </Button>
      </div>

      {/* Mobile view - below 768px */}
      <div className="flex sm:hidden flex-col gap-3 w-full">
        <Button
          variant="contained"
          onClick={handleOpen}
          className="w-full py-4 text-base font-medium"
        >
          <AddIcon fontSize="small" className="mr-2" />
          고객 등록
        </Button>

        <Button
          variant="outlined"
          onClick={handleOpenBulkUpload}
          className="w-full py-4 text-base font-medium"
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
