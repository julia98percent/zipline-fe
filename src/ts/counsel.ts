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
  type: string;
}

export interface PreCounselListData {
  surveyResponses: PreCounsel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}
