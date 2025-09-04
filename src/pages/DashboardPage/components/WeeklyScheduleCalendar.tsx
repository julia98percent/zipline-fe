import React, { useEffect, useRef } from "react";
import { IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight, CalendarMonth } from "@mui/icons-material";
import dayjs from "dayjs";
import { Schedule } from "@ts/schedule";
import {
  WEEKLY_SCHEDULE_MAX_ITEMS_PER_DAY,
  WEEKLY_SCHEDULE_MAX_ITEMS_PER_DAY_MOBILE,
} from "@constants/schedule";
import Button from "@components/Button";

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
  const todayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (todayRef.current) {
      todayRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [getWeekDates]);
  return (
    <div className="flex-1 flex flex-col card">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between">
        <div className="w-full flex flex-row items-center justify-between gap-2 h-full">
          <h6 className="text-lg whitespace-nowrap font-semibold text-primary">
            주간 일정
          </h6>
          <Button
            startIcon={<CalendarMonth />}
            onClick={onViewAllSchedules}
            color="info"
            variant="text"
          >
            월간 보기
          </Button>
        </div>

        <div className="flex items-center">
          <IconButton size="small" onClick={handlePrevWeek}>
            <ChevronLeft className="w-5 h-5" />
          </IconButton>
          {/* 현재 주 범위 표시 */}
          <div className="min-w-[200px] text-center text-sm">
            {currentWeekRange()}
          </div>
          <IconButton size="small" onClick={handleNextWeek}>
            <ChevronRight className="w-5 h-5" />
          </IconButton>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="grid flex-1 p-4 min-h-0">
        {/* Desktop Grid View */}
        <div className="hidden lg:grid grid-cols-7 gap-2 h-full auto-rows-fr">
          {getWeekDates().map((date, index) => {
            const daySchedules = schedules.filter((schedule) =>
              dayjs(schedule.startDate).isSame(date, "day")
            );

            const isToday = dayjs().isSame(date, "day");
            const hasSchedules = daySchedules.length > 0;

            return (
              <div
                key={index}
                className={`
                  border rounded p-2 h-full min-h-0 flex flex-col
                  ${
                    isToday
                      ? "border-2 border-primary bg-blue-50"
                      : "border border-gray-200"
                  }
                  ${!hasSchedules && !isToday ? "bg-gray-50" : "bg-white"}
                `}
              >
                <div className="mb-2 text-center flex-shrink-0">
                  <div className="text-xs text-gray-500">
                    {getDayName(date)}
                  </div>
                  <div className="text-sm font-semibold">
                    {date.format("DD")}
                  </div>
                </div>

                {daySchedules.length === 0 ? (
                  <div className="text-xs text-gray-500 text-center py-4">
                    일정이 없습니다.
                  </div>
                ) : (
                  <div className="flex flex-col gap-1 flex-1 overflow-hidden">
                    {daySchedules
                      .slice(0, WEEKLY_SCHEDULE_MAX_ITEMS_PER_DAY)
                      .map((schedule) => (
                        <div
                          key={schedule.uid}
                          onClick={() => handleScheduleClick(schedule)}
                          className="p-2 min-h-[36px] text-xs rounded border border-black/10 cursor-pointer flex flex-col justify-center hover:opacity-80 transition-opacity"
                          style={{
                            backgroundColor: getScheduleColor(
                              schedule.customerUid
                            ),
                          }}
                        >
                          <div className="text-[10px] leading-tight">
                            {dayjs(schedule.startDate).format("HH:mm")}
                          </div>
                          <div className="text-[10px] leading-tight mt-1 overflow-hidden text-ellipsis whitespace-nowrap">
                            {schedule.title}
                          </div>
                        </div>
                      ))}
                    {daySchedules.length >
                      WEEKLY_SCHEDULE_MAX_ITEMS_PER_DAY && (
                      <Button
                        variant="text"
                        onClick={() =>
                          handleMoreClick(
                            daySchedules,
                            date.format("YYYY-MM-DD")
                          )
                        }
                        className="text-xs"
                      >
                        +
                        {daySchedules.length -
                          WEEKLY_SCHEDULE_MAX_ITEMS_PER_DAY}
                        개 더보기
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex lg:hidden h-full flex-1 overflow-x-auto pb-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500">
          <div className="flex gap-4 min-w-max pb-2">
            {getWeekDates().map((date, index) => {
              const daySchedules = schedules.filter((schedule) =>
                dayjs(schedule.startDate).isSame(date, "day")
              );

              const isToday = dayjs().isSame(date, "day");
              const hasSchedules = daySchedules.length > 0;

              return (
                <div
                  key={index}
                  ref={isToday ? todayRef : null}
                  className={`
                    border rounded-lg p-4 lg:w-[calc(33.333vw-20px)] min-w-[200px] flex-shrink-0 h-full 
                    ${
                      isToday
                        ? "border-2 border-primary-light bg-blue-50"
                        : "border border-gray-200"
                    }
                    ${!hasSchedules && !isToday ? "bg-gray-50" : "bg-white"}
                  `}
                >
                  <div className="mb-4 text-center">
                    <div className="text-sm text-gray-500">
                      {getDayName(date)}
                    </div>
                    <div className="text-lg font-semibold">
                      {date.format("DD")}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
                    {daySchedules.length === 0 ? (
                      <div className="text-xs text-gray-500 text-center py-4">
                        일정이 없습니다.
                      </div>
                    ) : (
                      <>
                        {daySchedules
                          .slice(0, WEEKLY_SCHEDULE_MAX_ITEMS_PER_DAY_MOBILE)
                          .map((schedule) => (
                            <div
                              key={schedule.uid}
                              onClick={() => handleScheduleClick(schedule)}
                              className="p-3 min-h-[48px] text-xs rounded-md border border-black/10 cursor-pointer flex flex-col justify-center hover:opacity-80 transition-opacity"
                              style={{
                                backgroundColor: getScheduleColor(
                                  schedule.customerUid
                                ),
                              }}
                            >
                              <div className="text-xs font-semibold leading-tight">
                                {dayjs(schedule.startDate).format("HH:mm")}
                              </div>
                              <div className="text-[11px] leading-tight mt-1 overflow-hidden text-ellipsis whitespace-nowrap">
                                {schedule.title}
                              </div>
                            </div>
                          ))}
                        {daySchedules.length >
                          WEEKLY_SCHEDULE_MAX_ITEMS_PER_DAY_MOBILE && (
                          <Button
                            variant="text"
                            onClick={() =>
                              handleMoreClick(
                                daySchedules,
                                date.format("YYYY-MM-DD")
                              )
                            }
                            className="text-xs"
                          >
                            +
                            {daySchedules.length -
                              WEEKLY_SCHEDULE_MAX_ITEMS_PER_DAY_MOBILE}
                            개 더보기
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyScheduleCalendar;
