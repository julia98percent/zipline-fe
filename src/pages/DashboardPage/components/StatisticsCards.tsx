import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
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
      title: "신규 고객 (7일)",
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
    <Box className="flex flex-wrap gap-3 mb-4 mt-4">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <Box
            key={index}
            className="h-21 flex-[1_1_100%] md:flex-[1_1_calc(50%-12px)] lg:flex-[1_1_calc(25%-12px)]"
          >
            <Card className="h-full flex flex-col shadow-sm rounded-md bg-white transition-colors duration-200 hover:bg-gray-50">
              <CardContent
                className="h-full p-4 flex items-center gap-4"
                style={{
                  cursor: card.clickable ? "pointer" : "default",
                }}
                sx={{
                  "&:last-child": { pb: 2 },
                }}
                onClick={card.clickable ? card.onClick : undefined}
              >
                <Box
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: card.backgroundColor,
                  }}
                >
                  <IconComponent
                    className="text-2xl"
                    style={{ color: card.color }}
                  />
                </Box>
                <Box className="flex-1">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className="text-xs mb-1"
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant="h5"
                    className="font-semibold text-2xl leading-none"
                  >
                    {isLoading ? <CircularProgress size={20} /> : card.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        );
      })}
    </Box>
  );
};

export default StatisticsCards;
