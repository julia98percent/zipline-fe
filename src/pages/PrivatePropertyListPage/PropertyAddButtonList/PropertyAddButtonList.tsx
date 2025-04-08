import { useState } from "react";
import Button from "@components/Button";
import PropertyAddModal from "./PropertyAddModal";

function PropertyAddButtonList({ fetchPropertyData }) {
  console.log(fetchPropertyData);
  const [open, setOpen] = useState(false); // 모달 열림 상태 관리

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <div className="flex w-full justify-end gap-2">
        <Button
          text="매물 등록"
          onClick={handleOpen}
          sx={{
            marginTop: "16px",
            color: "white",
            minHeight: "32px",
            backgroundColor: "#2E5D9F",
          }}
        />

        <Button
          text="매물 데이터 일괄 등록(.csv)"
          sx={{
            marginTop: "16px",
            color: "white",
            minHeight: "32px",
            backgroundColor: "#2E5D9F",
            "&.disabled": {
              backgroundColor: "lightgray !important",
            },
          }}
        />
      </div>
      <PropertyAddModal
        open={open}
        handleClose={handleClose}
        fetchPropertyData={fetchPropertyData}
      />
    </>
  );
}

export default PropertyAddButtonList;
