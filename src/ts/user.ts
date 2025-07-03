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

export interface SignUpInput {
  userId: string;
  password: string;
  passwordCheck: string;
  passwordQuestionUid: number;
  questionAnswer: string;
  name: string;
  phoneNumber: string;
  email: string;
}
