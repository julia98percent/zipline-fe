import { Dayjs } from "dayjs";

interface ScheduleValidationParams {
  customerId?: number | null;
  title?: string;
  startDateTime?: Dayjs | null;
  endDateTime?: Dayjs | null;
}

export const getValidationErrors = ({
  customerId,
  title,
  startDateTime,
  endDateTime,
}: ScheduleValidationParams) => {
  const errors: string[] = [];

  if (!customerId) {
    errors.push("고객을 선택해주세요.");
  }

  if (!title?.trim()) {
    errors.push("일정 제목을 입력해주세요.");
  }
  if (!startDateTime) {
    errors.push("시작 일시를 선택해주세요.");
  }

  if (startDateTime && endDateTime && startDateTime > endDateTime) {
    errors.push("시작 일시는 종료 일시보다 늦을 수 없습니다.");
  }

  return errors;
};
