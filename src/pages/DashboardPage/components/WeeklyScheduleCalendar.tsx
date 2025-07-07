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
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#164f9e" }}>
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
              display: { xs: "none", md: "inline-flex" },
            }}
          >
            전체 일정 보기
          </Button>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
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
      <Box sx={{ flex: 1, p: 2, display: "flex" }}>
        <Box
          sx={{
            display: { xs: "none", md: "grid" },
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 1,
            height: "100%",
            flex: 1,
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
                  border: dayjs().isSame(date, "day")
                    ? "2px solid #164F9E"
                    : "1px solid #e0e0e0",
                  borderRadius: "4px",
                  p: 1,
                  height: "100%",
                  minHeight: "250px",
                  backgroundColor:
                    daySchedules.length === 0
                      ? "#f8f9fa"
                      : dayjs().isSame(date, "day")
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
                          p: 1,
                          minHeight: "36px",
                          fontSize: "11px",
                          borderRadius: "3px",
                          backgroundColor: getScheduleColor(
                            schedule.customerUid
                          ),
                          cursor: "pointer",
                          border: "1px solid rgba(0, 0, 0, 0.1)",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          "&:hover": {
                            opacity: 0.8,
                          },
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ fontSize: "10px", lineHeight: 1.2 }}
                        >
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
                            lineHeight: 1.2,
                            mt: 0.25,
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

        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            flex: 1,
            overflowX: "auto",
            pb: 1,
            "&::-webkit-scrollbar": {
              height: 6,
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f1f1f1",
              borderRadius: 3,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#c1c1c1",
              borderRadius: 3,
              "&:hover": {
                backgroundColor: "#a8a8a8",
              },
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              minWidth: "fit-content",
              pb: 1,
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
                    border: dayjs().isSame(date, "day")
                      ? "2px solid #164F9E"
                      : "1px solid #e0e0e0",
                    borderRadius: "8px",
                    p: 2,
                    width: "calc(33.333vw - 20px)",
                    minWidth: "200px",
                    flexShrink: 0,
                    backgroundColor:
                      daySchedules.length === 0
                        ? "#f8f9fa"
                        : dayjs().isSame(date, "day")
                        ? "#f0f8ff"
                        : "#fff",
                  }}
                >
                  <Box sx={{ mb: 2, textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      {getDayName(date)}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {date.format("DD")}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      maxHeight: "200px",
                      overflowY: "auto",
                    }}
                  >
                    {daySchedules.length === 0 ? (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ textAlign: "center", py: 2 }}
                      >
                        일정이 없습니다
                      </Typography>
                    ) : (
                      <>
                        {daySchedules
                          .slice(0, WEEKLY_SCHEDULE_MAX_ITEMS_PER_DAY)
                          .map((schedule) => (
                            <Box
                              key={schedule.uid}
                              onClick={() => handleScheduleClick(schedule)}
                              sx={{
                                p: 1.5,
                                minHeight: "48px",
                                fontSize: "12px",
                                borderRadius: "6px",
                                backgroundColor: getScheduleColor(
                                  schedule.customerUid
                                ),
                                cursor: "pointer",
                                border: "1px solid rgba(0, 0, 0, 0.1)",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                "&:hover": {
                                  opacity: 0.8,
                                },
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  lineHeight: 1.3,
                                }}
                              >
                                {dayjs(schedule.startDate).format("HH:mm")}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  fontSize: "11px",
                                  display: "block",
                                  mt: 0.5,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  lineHeight: 1.3,
                                }}
                              >
                                {schedule.title}
                              </Typography>
                            </Box>
                          ))}
                        {daySchedules.length >
                          WEEKLY_SCHEDULE_MAX_ITEMS_PER_DAY && (
                          <Button
                            size="small"
                            variant="text"
                            onClick={() =>
                              handleMoreClick(
                                daySchedules,
                                date.format("YYYY-MM-DD")
                              )
                            }
                            sx={{
                              fontSize: "11px",
                              minHeight: "24px",
                              p: 0.5,
                            }}
                          >
                            +
                            {daySchedules.length -
                              WEEKLY_SCHEDULE_MAX_ITEMS_PER_DAY}
                            개 더보기
                          </Button>
                        )}
                      </>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default WeeklyScheduleCalendar;
