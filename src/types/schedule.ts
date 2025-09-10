import { Dayjs } from "dayjs";
export interface Schedule {
  uid: number;
  title: string;
  description: string | null;
  startDate: Dayjs;
  endDate: Dayjs;
  customerUid: number | null;
  customerName: string | null;
}
