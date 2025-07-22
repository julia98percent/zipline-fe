import { useState, useEffect, useRef } from "react";

interface CalendarConfig {
  contentHeight: number | "auto";
  dayMaxEvents: number;
  eventMinHeight: number;
}

export const useResponsiveCalendar = () => {
  const calendarRef = useRef<any>(null);
  const [calendarConfig, setCalendarConfig] = useState<CalendarConfig>({
    contentHeight: "auto",
    dayMaxEvents: 3,
    eventMinHeight: 20,
  });

  useEffect(() => {
    const updateCalendarHeight = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      let config: CalendarConfig;

      if (width < 640) {
        // 모바일: 화면 높이의 60% 사용
        config = {
          contentHeight: Math.min(height * 0.6, 400),
          dayMaxEvents: 2,
          eventMinHeight: 16,
        };
      } else if (width < 1024) {
        // 태블릿: 화면 높이의 70% 사용
        config = {
          contentHeight: Math.min(height * 0.7, 600),
          dayMaxEvents: 3,
          eventMinHeight: 18,
        };
      } else {
        // 데스크톱: 고정 높이 또는 auto
        config = {
          contentHeight: 650,
          dayMaxEvents: 4,
          eventMinHeight: 20,
        };
      }

      setCalendarConfig(config);

      // 기존 캘린더 인스턴스가 있으면 동적으로 높이 업데이트
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.setOption("contentHeight", config.contentHeight);
        calendarApi.setOption("dayMaxEvents", config.dayMaxEvents);
      }
    };

    updateCalendarHeight();
    window.addEventListener("resize", updateCalendarHeight);
    return () => window.removeEventListener("resize", updateCalendarHeight);
  }, []);

  return { calendarConfig, calendarRef };
};
