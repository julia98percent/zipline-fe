import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { CONTRACT_STATUS_OPTION_LIST } from "@constants/contract";

interface ContractStatusStepperProps {
  currentStatus: string;
  contractHistory?: Array<{
    currentStatus: string;
    changedAt: string;
  }>;
}

const ContractStatusStepper = ({
  currentStatus,
  contractHistory = [],
}: ContractStatusStepperProps) => {
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
    <Paper
      elevation={1}
      sx={{
        p: 3,
        borderRadius: 2,
        backgroundColor: "#fafafa",
      }}
    >
      <Typography variant="h6" fontWeight="bold" mb={2}>
        계약 진행 상태
      </Typography>

      {isTerminated ? (
        <Box display="flex" alignItems="center" justifyContent="center" py={2}>
          <Cancel sx={{ color: "#d32f2f", mr: 1, fontSize: 28 }} />
          <Typography variant="h6" color="#d32f2f" fontWeight="bold">
            계약 {currentStatus === "CANCELLED" ? "취소됨" : "해지됨"}
          </Typography>
          {getStatusDate(currentStatus) && (
            <Typography variant="body2" color="#999" ml={2}>
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

            return (
              <Step key={step} completed={isCompleted}>
                <StepLabel
                  StepIconComponent={() => (
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: isCompleted
                          ? "#4caf50"
                          : isActive
                          ? "#2196f3"
                          : "#e0e0e0",
                        color: isCompleted || isActive ? "#fff" : "#666",
                        fontSize: 12,
                        fontWeight: "bold",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {isCompleted ? (
                        <CheckCircle sx={{ fontSize: 20 }} />
                      ) : (
                        index + 1
                      )}
                    </Box>
                  )}
                >
                  <Box textAlign="center" mt={1}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: isCompleted || isActive ? "bold" : "normal",
                        color: isCompleted
                          ? "#4caf50"
                          : isActive
                          ? "#2196f3"
                          : "#666",
                        fontSize: 10,
                        lineHeight: 1.2,
                        display: "block",
                      }}
                    >
                      {getStatusLabel(step)}
                    </Typography>
                    {(isCompleted || isActive) && stepDate && (
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          color: "#999",
                          fontSize: 9,
                          mt: 0.25,
                        }}
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
