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
  question: string;
  answer: string;
}

export interface PreCounselListData {
  surveyResponses: PreCounsel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

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
