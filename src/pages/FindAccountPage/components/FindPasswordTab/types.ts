export type ContactMethod = "phone" | "email";

export interface PasswordForm {
  userId: string;
  name: string;
  phoneNo: string;
  email: string;
  contactMethod: ContactMethod;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

export type PasswordResetStep = "verify" | "code" | "reset";

export interface StepProps {
  passwordForm: PasswordForm;
  setPasswordForm: React.Dispatch<React.SetStateAction<PasswordForm>>;
  isLoading: boolean;
  onNext: () => void;
}
