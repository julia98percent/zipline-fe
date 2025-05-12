import { useState } from "react";
import Button from "@components/Button";
import PropertyAddModal from "./PropertyAddModal";
import AddIcon from "@mui/icons-material/Add";
import { Button as MuiButton } from "@mui/material";

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
              매물 등록
            </MuiButton>

        <Button
          text="매물 데이터 일괄 등록(.csv)"
          disabled
          sx={{
            color: "white",
            minHeight: "32px",
            backgroundColor: "#164F9E",
            marginLeft: "12px",
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
