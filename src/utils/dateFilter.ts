import { Dayjs } from "dayjs";

interface DateFilterParams {
  criteria: string;
  cond: string;
  value: string;
}

export const buildDateFilterParams = (
  startDate: Dayjs | null,
  endDate: Dayjs | null
): DateFilterParams => {
  const criteriaList: string[] = [];
  const condList: string[] = [];
  const valueList: string[] = [];

  if (startDate) {
    criteriaList.push("dateCreated");
    condList.push("gte");
    valueList.push(startDate.toISOString());
  }
  if (endDate) {
    criteriaList.push("dateCreated");
    condList.push("lt");
    valueList.push(
      endDate.add(1, "day").subtract(1, "millisecond").toISOString()
    );
  }

  return {
    criteria: criteriaList.join(","),
    cond: condList.join(","),
    value: valueList.join(","),
  };
};
