import { useState } from "react";
import Button from "@components/Button";
import CustomerAddModal from "./CustomerAddModal/CustomerAddModal";
import AddIcon from "@mui/icons-material/Add";
import { Button as MuiButton } from "@mui/material";

function CustomerAddButtonList({ fetchCustomerList }: any) {
  const [open, setOpen] = useState(false); // 모달 열림 상태 관리

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <div className="flex w-full justify-end gap-2">
      <MuiButton
              variant="contained"
              startIcon={<AddIcon />}
              onClick= {handleOpen}
              sx={{
                backgroundColor: "#164F9E",
                "&:hover": { backgroundColor: "#0D3B7A" },
                height: "36px",
                fontSize: "13px",
                padding: "0 16px",
              }}
            >
              고객 등록
            </MuiButton>

        <Button
          text="고객 데이터 일괄 등록(.csv)"
          disabled
          sx={{
            color: "white",
            minHeight: "40px",
            backgroundColor: "#164F9E",
            "&:hover": {
              backgroundColor: "#0D3B7A",
            },
            "&:disabled": {
              backgroundColor: "lightgray",
              color: "white",
            },
          }}
        />
      </div>
      <CustomerAddModal
        open={open}
        handleClose={handleClose}
        fetchCustomerList={fetchCustomerList}
      />
    </>
  );
}

export default CustomerAddButtonList;
