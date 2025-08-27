import { MobileStepper } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface ContractStatusStepperMobileProps {
  normalFlow: string[];
  activeStep: number;
  getStatusLabel: (status: string) => string;
  getStatusDate: (status: string) => string | null;
  canAdvanceToStep: (status: string) => boolean;
  handleQuickStatusChange: (status: string) => void;
  handleStepClick: (status: string) => void;
}

const ContractStatusStepperMobile = ({
  normalFlow,
  activeStep,
  getStatusLabel,
  getStatusDate,
  canAdvanceToStep,
  handleQuickStatusChange,
  handleStepClick,
}: ContractStatusStepperMobileProps) => {
  return (
    <div className="block sm:hidden space-y-4">
      <div className="grid grid-cols-[1fr_auto_1fr] gap-4 text-xs">
        <div className="flex items-center justify-start">
          {activeStep > 0 && (
            <div className="flex items-center">
              <ChevronLeftIcon className="text-[#4caf50]" />
              <span
                className="font-medium break-keep text-[#4caf50] cursor-pointer"
                onClick={() =>
                  handleQuickStatusChange(normalFlow[activeStep - 1])
                }
              >
                {getStatusLabel(normalFlow[activeStep - 1])}
              </span>
            </div>
          )}
        </div>
        <div className="text-center">
          <h6 className="text-sm font-semibold">
            {getStatusLabel(normalFlow[activeStep])}
          </h6>
          {getStatusDate(normalFlow[activeStep]) && (
            <p className="text-gray-500">
              {new Date(
                getStatusDate(normalFlow[activeStep])!
              ).toLocaleDateString("ko-KR")}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end">
          {activeStep < normalFlow.length - 1 && (
            <div className="flex items-center">
              <span
                className={`font-medium break-keep ${
                  canAdvanceToStep(normalFlow[activeStep + 1])
                    ? "text-primary cursor-pointer"
                    : "text-gray-400"
                }`}
                onClick={() => {
                  if (canAdvanceToStep(normalFlow[activeStep + 1])) {
                    handleStepClick(normalFlow[activeStep + 1]);
                  }
                }}
              >
                {getStatusLabel(normalFlow[activeStep + 1])}
              </span>
              <ChevronRightIcon className="text-primary" />
            </div>
          )}
        </div>
      </div>
      <MobileStepper
        className="justify-center"
        variant="dots"
        steps={normalFlow.length}
        position="static"
        activeStep={activeStep}
        sx={{
          maxWidth: 400,
          flexGrow: 1,
          backgroundColor: "transparent",
          "& .MuiMobileStepper-dot": {
            backgroundColor: "#e0e0e0",
          },
          "& .MuiMobileStepper-dotActive": {
            backgroundColor: "#2196f3",
          },

          ...Array.from({ length: activeStep }, (_, i) => ({
            [`& .MuiMobileStepper-dots > div:nth-of-type(${i + 1})`]: {
              backgroundColor: i < activeStep ? "#4caf50" : "#e0e0e0",
            },
          })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
        }}
        nextButton={null}
        backButton={null}
      />
    </div>
  );
};

export default ContractStatusStepperMobile;
