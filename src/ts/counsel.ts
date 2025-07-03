import { PaginatedResponse } from "./apiResponse";
import { Customer } from "./customer";
import { Property } from "./property";
export interface PreCounsel {
  name: string;
  phoneNumber: string;
  submittedAt: string;
  surveyResponseUid: number;
}

interface PreCounselDetailAnswer {
  questionUid: number;
  questionTitle: string;
  description: string;
  questionType: string;
  answer: string;
  fileName?: string;
  choices: {
    choiceUid: number;
    choiceText: string;
  }[];
  required: boolean;
}

export interface PreCounselDetail {
  surveyResponseUid: number;
  title: string;
  submittedAt: string;
  customerUid: number | null;
  answers: PreCounselDetailAnswer[];
}

export interface Counsel {
  completed: boolean;
  counselDate: Date;
  counselUid: number;
  customer: Omit<
    Customer,
    "trafficSource" | "birthday" | "legalDistrictCode" | "telProvider"
  >;
  property: Property;
  customerName: string;
  dueDate: string;
  propertyUid: number;
  title: string;
  type: CounselCategoryType;
}

export interface CounselDetail extends Counsel {
  counselDetails: CounselDetailItem[];
  property: Property | null;
  customer: Customer;
}

export interface CounselDetailItem {
  counselDetailUid: number;
  content: string;
}

export type PreCounselListData = PaginatedResponse<
  "surveyResponses",
  PreCounsel[]
>;

export const CounselCategory = {
  PURCHASE: "매수",
  SALE: "매도",
  LEASE: "임대",
  RENT: "임차",
  OTHER: "기타",
} as const;

export type CounselCategoryType =
  | "PURCHASE"
  | "SALE"
  | "LEASE"
  | "RENT"
  | "OTHER";

export type ConsultationResponse = PaginatedResponse<"counsels", Counsel[]>;

export type QuestionType =
  | "SUBJECTIVE"
  | "SINGLE_CHOICE"
  | "MULTIPLE_CHOICE"
  | "FILE_UPLOAD";

export interface PreCounselChoice {
  id: number;
  text: string;
}

export interface PreCounselQuestion {
  id: number;
  title: string;
  description: string;
  type: QuestionType;
  choices: PreCounselChoice[] | [];
  required: boolean;
}
