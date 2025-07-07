import React from "react";
import { Box, Card, Typography, IconButton, Button } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import dayjs from "dayjs";
import { Schedule } from "@ts/schedule";
import { WEEKLY_SCHEDULE_MAX_ITEMS_PER_DAY } from "@constants/schedule";

interface WeeklyScheduleCalendarProps {
  schedules: Schedule[];
  handlePrevWeek: () => void;
  handleNextWeek: () => void;
  currentWeekRange: () => string;
  getWeekDates: () => dayjs.Dayjs[];
  getDayName: (date: dayjs.Dayjs) => string;
  getScheduleColor: (customerUid: number | null) => string;
  handleScheduleClick: (schedule: Schedule) => void;
  handleMoreClick: (daySchedules: Schedule[], dayStr: string) => void;
  onViewAllSchedules: () => void;
}

const WeeklyScheduleCalendar: React.FC<WeeklyScheduleCalendarProps> = ({
  schedules,
  handlePrevWeek,
  handleNextWeek,
  currentWeekRange,
  getWeekDates,
  getDayName,
  getScheduleColor,
  handleScheduleClick,
  handleMoreClick,
  onViewAllSchedules,
}) => {
  return (
    <Card
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
        borderRadius: "6px",
        backgroundColor: "#fff",
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            주간 일정
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={onViewAllSchedules}
            sx={{
              fontSize: "12px",
              padding: "4px 12px",
              minWidth: "auto",
            }}
          >
            전체 일정 보기
          </Button>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton size="small" onClick={handlePrevWeek}>
            <ChevronLeftIcon />
          </IconButton>
          <Typography
            variant="body2"
            sx={{ minWidth: "200px", textAlign: "center" }}
          >
            {currentWeekRange()}
          </Typography>
          <IconButton size="small" onClick={handleNextWeek}>
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>
      <Box sx={{ flex: 1, p: 2 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 1,
            height: "100%",
          }}
        >
          {getWeekDates().map((date, index) => {
            const daySchedules = schedules.filter((schedule) =>
              dayjs(schedule.startDate).isSame(date, "day")
            );

            return (
              <Box
                key={index}
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "4px",
                  p: 1,
                  height: "100%",
                  minHeight: "250px", // 최대 일정 개수를 표시하기 위해 높이 증가
                  backgroundColor: dayjs().isSame(date, "day")
                    ? "#f0f8ff"
                    : "#fff",
                }}
              >
                <Box sx={{ mb: 1, textAlign: "center" }}>
                  <Typography variant="caption" color="text.secondary">
                    {getDayName(date)}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {date.format("DD")}
                  </Typography>
                </Box>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                >
                  {daySchedules
                    .slice(0, WEEKLY_SCHEDULE_MAX_ITEMS_PER_DAY)
                    .map((schedule) => (
                      <Box
                        key={schedule.uid}
                        onClick={() => handleScheduleClick(schedule)}
                        sx={{
                          p: 0.5,
                          fontSize: "11px",
                          borderRadius: "2px",
                          backgroundColor: getScheduleColor(
                            schedule.customerUid
                          ),
                          cursor: "pointer",
                          border: "1px solid rgba(0, 0, 0, 0.1)",
                          "&:hover": {
                            opacity: 0.8,
                          },
                        }}
                      >
                        <Typography variant="caption" sx={{ fontSize: "10px" }}>
                          {dayjs(schedule.startDate).format("HH:mm")}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: "10px",
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {schedule.title}
                        </Typography>
                      </Box>
                    ))}
                  {daySchedules.length > WEEKLY_SCHEDULE_MAX_ITEMS_PER_DAY && (
                    <Button
                      size="small"
                      variant="text"
                      onClick={() =>
                        handleMoreClick(daySchedules, date.format("YYYY-MM-DD"))
                      }
                      sx={{
                        fontSize: "10px",
                        minHeight: "20px",
                        p: 0.5,
                      }}
                    >
                      +{daySchedules.length - WEEKLY_SCHEDULE_MAX_ITEMS_PER_DAY}
                      개 더보기
                    </Button>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Card>
  );
};

export default WeeklyScheduleCalendar;
