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
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1.5,
        mb: 2,
        mt: 2,
      }}
    >
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <Box
            key={index}
            sx={{
              flex: {
                xs: "1 1 100%",
                md: "1 1 calc(50% - 12px)",
                lg: "1 1 calc(25% - 12px)",
              },
              height: "84px",
            }}
          >
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
                borderRadius: "6px",
                backgroundColor: "#fff",
                transition: "background-color 0.2s ease",
                "&:hover": {
                  backgroundColor: "#f8f9fa",
                  cursor: card.clickable ? "pointer" : "default",
                },
              }}
            >
              <CardContent
                sx={{
                  height: "100%",
                  p: 2,
                  "&:last-child": { pb: 2 },
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  cursor: card.clickable ? "pointer" : "default",
                }}
                onClick={card.clickable ? card.onClick : undefined}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    backgroundColor: card.backgroundColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconComponent sx={{ fontSize: 24, color: card.color }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "13px", mb: 0.5 }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 600, fontSize: "24px", lineHeight: 1 }}
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
