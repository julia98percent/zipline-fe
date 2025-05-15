import { useState } from "react";
import Button from "@components/Button";
import CustomerAddModal from "./CustomerAddModal";
import CustomerBulkUploadModal from "./CustomerBulkUploadModal";
import AddIcon from "@mui/icons-material/Add";
import { Button as MuiButton } from "@mui/material";

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
        <MuiButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{
            backgroundColor: "#164F9E",
            boxShadow: "none",
            "&:hover": { backgroundColor: "#0D3B7A", boxShadow: "none" },
            height: "36px",
            fontSize: "13px",
            padding: "0 16px",
          }}
        >
          고객 등록
        </MuiButton>

        <Button
          text="고객 데이터 일괄 등록(.csv)"
          variant="outlined"
          onClick={handleOpenBulkUpload}
          sx={{
            color: "#164F9E",
            minHeight: "32px",
            borderColor: "#164F9E",
            marginLeft: "12px",
            "&:hover": {
              borderColor: "#0D3B7A",
              color: "#0D3B7A",
            },
          }}
        />
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
