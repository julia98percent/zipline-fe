export interface Schedule {
  uid: number;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  customerUid: number | null;
  customerName: string | null;
}
