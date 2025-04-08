import { useState } from "react";
import Button from "@components/Button";
import CustomerAddModal from "./CustomerAddModal";

function CustomerAddButtonList({ fetchCustomerList }: any) {
  const [open, setOpen] = useState(false); // 모달 열림 상태 관리

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <div className="flex w-full justify-end gap-2">
        <Button
          text="고객 데이터 등록"
          onClick={handleOpen}
          sx={{
            color: "white",
            minHeight: "32px",
            backgroundColor: "#2E5D9F",
            "&:disabled": {
              backgroundColor: "lightgray",
              color: "white",
            },
          }}
        />

        <Button
          text="고객 데이터 일괄 등록(.csv)"
          disabled
          sx={{
            color: "white",
            minHeight: "32px",
            backgroundColor: "#2E5D9F",
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
