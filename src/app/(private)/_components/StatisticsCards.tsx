import { Card, CardContent } from "@mui/material";
import CircularProgress from "@/components/CircularProgress";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

interface StatisticsCardsProps {
  recentCustomers: number;
  recentContractsCount: number;
  ongoingContracts: number;
  completedContracts: number;
  isLoading: boolean;
  onRecentCustomersClick: () => void;
  onRecentContractsClick: () => void;
  onOngoingContractsClick: () => void;
  onCompletedContractsClick: () => void;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({
  recentCustomers,
  recentContractsCount,
  ongoingContracts,
  completedContracts,
  isLoading,
  onRecentCustomersClick,
  onRecentContractsClick,
  onOngoingContractsClick,
  onCompletedContractsClick,
}) => {
  const cards = [
    {
      title: "신규 고객",
      value: `${recentCustomers}명`,
      icon: PersonAddIcon,
      color: "#1976d2",
      backgroundColor: "#e3f2fd",
      onClick: onRecentCustomersClick,
      clickable: true,
    },
    {
      title: "최근 계약",
      value: `${recentContractsCount}건`,
      icon: AssignmentIcon,
      color: "#2e7d32",
      backgroundColor: "#e8f5e8",
      onClick: onRecentContractsClick,
      clickable: recentContractsCount > 0,
    },
    {
      title: "진행 중인 계약",
      value: `${ongoingContracts}건`,
      icon: DonutLargeIcon,
      color: "#f57c00",
      backgroundColor: "#fff3e0",
      onClick: onOngoingContractsClick,
      clickable: ongoingContracts > 0,
    },
    {
      title: "완료된 계약",
      value: `${completedContracts}건`,
      icon: CheckCircleIcon,
      color: "#7b1fa2",
      backgroundColor: "#f3e5f5",
      onClick: onCompletedContractsClick,
      clickable: completedContracts > 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 flex-wrap gap-3">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <Card
            key={index}
            className="h-full flex flex-col card hover:bg-neutral-100"
          >
            <CardContent
              className="flex flex-col lg:flex-row h-full p-4 flex items-center gap-4"
              style={{
                cursor: card.clickable ? "pointer" : "default",
              }}
              sx={{
                "&:last-child": { pb: 2 },
              }}
              onClick={card.clickable ? card.onClick : undefined}
            >
              <div
                className="w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: card.backgroundColor,
                }}
              >
                <IconComponent
                  className="text-2xl"
                  style={{ color: card.color }}
                />
              </div>
              <div className="flex flex-col items-start gap-1">
                <span className="font-semibold text-2xl leading-none">
                  {isLoading ? <CircularProgress size={20} /> : card.value}
                </span>
                <span color="text.secondary" className="text-xs mb-1">
                  {card.title}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatisticsCards;
