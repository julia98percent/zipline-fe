import {
  Stepper,
  Step,
  StepLabel,
  Typography,
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { SUCCESS, INFO, MUI_COLORS, NEUTRAL, TEXT, BACKGROUND } from "@/constants/colors";

interface ContractStatusStepperDesktopProps {
  normalFlow: string[];
  activeStep: number;
  getStatusLabel: (status: string) => string;
  getStatusDate: (status: string) => string | null;
  isClickableStep: (status: string) => boolean;
  handleStepClick: (status: string) => void;
  isTerminated: boolean;
}

const ContractStatusStepperDesktop = ({
  normalFlow,
  activeStep,
  getStatusLabel,
  getStatusDate,
  isClickableStep,
  handleStepClick,
  isTerminated,
}: ContractStatusStepperDesktopProps) => {
  const renderStepper = (steps: string[], startIndex: number = 0) => {
    const adjustedActiveStep = startIndex === 0 ? Math.min(activeStep, 4) : Math.max(0, activeStep - 5);
    
    return (
      <Stepper
        activeStep={adjustedActiveStep}
        orientation="horizontal"
        sx={{
          "& .MuiStepConnector-root": {
            top: 20,
            left: "calc(-50% + 16px)",
            right: "calc(50% + 16px)",
          },
          "& .MuiStepConnector-line": {
            borderColor: NEUTRAL[300],
            borderTopWidth: 2,
          },
          "& .MuiStep-root": {
            px: 0.5,
          },
        }}
      >
        {steps.map((step, index) => {
          const actualIndex = index + startIndex;
          const stepDate = getStatusDate(step);
          const isCompleted = actualIndex < activeStep;
          const isActive = actualIndex === activeStep;
          const isClickable = isClickableStep(step) && !isTerminated;

          return (
            <Step key={step} completed={isCompleted}>
              <StepLabel
                StepIconComponent={() => (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                    style={{
                      backgroundColor: isCompleted
                        ? SUCCESS.main
                        : isActive
                        ? INFO.alt
                        : isClickable
                        ? INFO.light
                        : NEUTRAL[300],
                      color:
                        isCompleted || isActive
                          ? BACKGROUND.paper
                          : isClickable
                          ? MUI_COLORS.primary
                          : TEXT.secondary,
                      cursor: isClickable ? "pointer" : "default",
                      border: isClickable ? `2px solid ${MUI_COLORS.primary}` : "none",
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
                      actualIndex + 1
                    )}
                  </div>
                )}
              >
                <div className="text-center">
                  <Typography
                    variant="caption"
                    className="block text-xs leading-tight whitespace-nowrap"
                    sx={{
                      fontWeight: isCompleted || isActive ? "bold" : "normal",
                      color: isCompleted
                        ? SUCCESS.main
                        : isActive
                        ? INFO.alt
                        : isClickable
                        ? MUI_COLORS.primary
                        : TEXT.secondary,
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
                </div>
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    );
  };

  return (
    <div className="hidden sm:block space-y-6">
      {renderStepper(normalFlow.slice(0, 5), 0)}
      {normalFlow.length > 5 && renderStepper(normalFlow.slice(5), 5)}
    </div>
  );
};

export default ContractStatusStepperDesktop;