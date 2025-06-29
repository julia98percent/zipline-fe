export type UserRole = "ROLE_ADMIN" | "ROLE_AGENT";
export interface User {
  email: string;
  id: string;
  name: string;
  noticeMonth: number;
  noticeTime: string;
  phoneNo: string;
  role: UserRole;
  uid: string;
  url: number | null;
  surveyTitle: string;
  surveyCreatedAt: string;
}
