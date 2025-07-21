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
      <div>
        <Button
          variant="contained"
          onClick={handleOpen}
          className="bg-[#164F9E] shadow-none hover:bg-[#0D3B7A] hover:shadow-none h-9 text-xs px-4 flex items-center gap-2"
        >
          <AddIcon fontSize="small" />
          고객 등록
        </Button>

        <Button
          variant="outlined"
          onClick={handleOpenBulkUpload}
          className="text-[#164F9E] min-h-[32px] border-[#164F9E] ml-3 hover:border-[#0D3B7A] hover:text-[#0D3B7A]"
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
