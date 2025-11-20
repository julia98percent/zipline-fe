import { Schedule } from "@/types/schedule";
import { Contract } from "@/types/contract";
import { Counsel, PreCounsel } from "@/types/counsel";
import DashboardClient from "./DashboardClient";

interface DashboardContainerProps {
  initialStatistics: {
    recentCustomers: number;
    recentContractsCount: number;
    ongoingContracts: number;
    completedContracts: number;
  };
  initialSchedules: Schedule[];
  initialSurveyResponses: PreCounsel[];
  initialCounselListByDueDate: Counsel[];
  initialCounselListByLatest: Counsel[];
  initialExpiringContracts: Contract[];
  initialRecentContracts: Contract[];
}

const DashboardContainer = (props: DashboardContainerProps) => {
  return (
    <div className="overflow-auto p-0">
      <div className="flex flex-col p-6 pt-0 gap-4">
        <DashboardClient {...props} />
      </div>
    </div>
  );
};

export default DashboardContainer;
