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
