"use client";
import { useState } from "react";
import {
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Cancel,
  MoreVert,
  CancelOutlined,
  RemoveCircleOutline,
} from "@mui/icons-material";
import { CONTRACT_STATUS_OPTION_LIST } from "@/constants/contract";
import ContractStatusStepperDesktop from "./ContractStatusStepperDesktop";
import ContractStatusStepperMobile from "./ContractStatusStepperMobile";

interface ContractStatusStepperProps {
  currentStatus: string;
  contractHistory?: Array<{
    currentStatus: string;
    changedAt: string;
  }>;
  onStatusChange?: (newStatus: "CANCELLED" | "TERMINATED") => void;
  onQuickStatusChange?: (newStatus: string) => void;
}

const ContractStatusStepper = ({
  currentStatus,
  contractHistory = [],
  onStatusChange,
  onQuickStatusChange,
}: ContractStatusStepperProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = (newStatus: "CANCELLED" | "TERMINATED") => {
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
    handleMenuClose();
  };

  const handleQuickStatusChange = (newStatus: string) => {
    if (onQuickStatusChange) {
      onQuickStatusChange(newStatus);
    }
  };

  const normalFlow = [
    "LISTED",
    "NEGOTIATING",
    "INTENT_SIGNED",
    "CONTRACTED",
    "IN_PROGRESS",
    "PAID_COMPLETE",
    "REGISTERED",
    "MOVED_IN",
    "CLOSED",
  ];

  const canAdvanceToStep = (targetStatus: string) => {
    const currentIndex = normalFlow.indexOf(currentStatus);
    const targetIndex = normalFlow.indexOf(targetStatus);
    return targetIndex === currentIndex + 1;
  };

  const isClickableStep = (targetStatus: string) => {
    return canAdvanceToStep(targetStatus);
  };

  const handleStepClick = (targetStatus: string) => {
    if (canAdvanceToStep(targetStatus)) {
      handleQuickStatusChange(targetStatus);
    }
  };

  const getStatusLabel = (status: string) => {
    const statusOption = CONTRACT_STATUS_OPTION_LIST.find(
      (option) => option.value === status
    );
    return statusOption?.label || status;
  };

  const getStatusDate = (status: string) => {
    const historyItem = contractHistory.find(
      (item) => item.currentStatus === status
    );
    return historyItem?.changedAt || null;
  };

  const getCurrentStepIndex = () => {
    const currentIndex = normalFlow.indexOf(currentStatus);
    return currentIndex >= 0 ? currentIndex : normalFlow.length;
  };

  const activeStep = getCurrentStepIndex();
  const isTerminated =
    currentStatus === "CANCELLED" || currentStatus === "TERMINATED";

  return (
    <div className="p-5 card">
      <div className="flex justify-between items-center mb-4">
        <h6 className="text-lg font-semibold text-primary mb-2">
          계약 진행 상태
        </h6>
        {!isTerminated && onStatusChange && (
          <>
            <IconButton
              onClick={handleMenuClick}
              size="small"
              className="bg-gray-100 hover:bg-gray-300"
              title="계약 상태 변경"
            >
              <MoreVert fontSize="small" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem onClick={() => handleStatusChange("CANCELLED")}>
                <ListItemIcon>
                  <CancelOutlined fontSize="small" color="warning" />
                </ListItemIcon>
                <ListItemText>계약 취소</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleStatusChange("TERMINATED")}>
                <ListItemIcon>
                  <RemoveCircleOutline fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText>계약 해지</ListItemText>
              </MenuItem>
            </Menu>
          </>
        )}
      </div>

      {isTerminated ? (
        <div className="flex items-center justify-center py-4">
          <Cancel className="text-red-700 mr-2 text-3xl" />
          <Typography variant="h6" className="text-red-700 font-bold">
            계약 {currentStatus === "CANCELLED" ? "취소됨" : "해지됨"}
          </Typography>
          {getStatusDate(currentStatus) && (
            <Typography variant="body2" className="text-gray-500 ml-4">
              (
              {new Date(getStatusDate(currentStatus)!).toLocaleDateString(
                "ko-KR"
              )}
              )
            </Typography>
          )}
        </div>
      ) : (
        <>
          <ContractStatusStepperDesktop
            normalFlow={normalFlow}
            activeStep={activeStep}
            getStatusLabel={getStatusLabel}
            getStatusDate={getStatusDate}
            isClickableStep={isClickableStep}
            handleStepClick={handleStepClick}
            isTerminated={isTerminated}
          />

          <ContractStatusStepperMobile
            normalFlow={normalFlow}
            activeStep={activeStep}
            getStatusLabel={getStatusLabel}
            getStatusDate={getStatusDate}
            canAdvanceToStep={canAdvanceToStep}
            handleQuickStatusChange={handleQuickStatusChange}
            handleStepClick={handleStepClick}
          />
        </>
      )}
    </div>
  );
};

export default ContractStatusStepper;
