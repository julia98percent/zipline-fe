import { useState } from "react";
import Button from "@components/Button";
import PropertyAddModal from "./PropertyAddModal";

interface Props {
  fetchPropertyData: () => void;
}

function PropertyAddButtonList({ fetchPropertyData }: Props) {
  const [open, setOpen] = useState(false); // 모달 열림 상태 관리

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <div>
        <Button
          text="매물 등록"
          onClick={handleOpen}
          sx={{
            color: "white",
            minHeight: "32px",
            backgroundColor: "#164F9E",
            marginRight: "12px",
          }}
        />

        <Button
          text="매물 데이터 일괄 등록(.csv)"
          disabled
          sx={{
            color: "white",
            minHeight: "32px",
            backgroundColor: "#164F9E",
            "&:disabled": {
              backgroundColor: "lightgray",
              color: "white",
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
