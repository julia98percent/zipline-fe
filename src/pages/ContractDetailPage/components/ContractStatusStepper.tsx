import { useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  MoreVert,
  CancelOutlined,
  RemoveCircleOutline,
} from "@mui/icons-material";
import { CONTRACT_STATUS_OPTION_LIST } from "@constants/contract";

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
    <Paper elevation={1} className="p-6 rounded-lg bg-white shadow-sm">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h6" className="font-bold text-primary">
          계약 진행 상태
        </Typography>
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
      </Box>

      {isTerminated ? (
        <Box className="flex items-center justify-center py-4">
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
        </Box>
      ) : (
        <Stepper
          activeStep={activeStep}
          orientation="horizontal"
          sx={{
            "& .MuiStepConnector-root": {
              top: 20,
              left: "calc(-50% + 16px)",
              right: "calc(50% + 16px)",
            },
            "& .MuiStepConnector-line": {
              borderColor: "#e0e0e0",
              borderTopWidth: 2,
            },
            "& .MuiStep-root": {
              px: 0.5,
            },
          }}
        >
          {normalFlow.map((step, index) => {
            const stepDate = getStatusDate(step);
            const isCompleted = index < activeStep;
            const isActive = index === activeStep;
            const isClickable = isClickableStep(step) && !isTerminated;

            return (
              <Step key={step} completed={isCompleted}>
                <StepLabel
                  StepIconComponent={() => (
                    <Box
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                      sx={{
                        backgroundColor: isCompleted
                          ? "#4caf50"
                          : isActive
                          ? "#2196f3"
                          : isClickable
                          ? "#e3f2fd"
                          : "#e0e0e0",
                        color:
                          isCompleted || isActive
                            ? "#fff"
                            : isClickable
                            ? "#1976d2"
                            : "#666",
                        cursor: isClickable ? "pointer" : "default",
                        border: isClickable ? "2px solid #1976d2" : "none",
                        "&:hover": isClickable
                          ? {
                              backgroundColor: "#bbdefb",
                              transform: "scale(1.05)",
                            }
                          : {},
                      }}
                      onClick={() => isClickable && handleStepClick(step)}
                      title={
                        isClickable
                          ? `클릭하여 '${getStatusLabel(step)}'로 진행`
                          : undefined
                      }
                    >
                      {isCompleted ? (
                        <CheckCircle className="text-xl" />
                      ) : (
                        index + 1
                      )}
                    </Box>
                  )}
                >
                  <Box className="text-center mt-2">
                    <Typography
                      variant="caption"
                      className="block text-xs leading-tight"
                      sx={{
                        fontWeight: isCompleted || isActive ? "bold" : "normal",
                        color: isCompleted
                          ? "#4caf50"
                          : isActive
                          ? "#2196f3"
                          : isClickable
                          ? "#1976d2"
                          : "#666",
                      }}
                    >
                      {getStatusLabel(step)}
                    </Typography>
                    {(isCompleted || isActive) && stepDate && (
                      <Typography
                        variant="caption"
                        className="block text-gray-500 text-xs mt-1"
                      >
                        {new Date(stepDate).toLocaleDateString("ko-KR", {
                          month: "short",
                          day: "numeric",
                        })}
                      </Typography>
                    )}
                  </Box>
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      )}
    </Paper>
  );
};

export default ContractStatusStepper;
