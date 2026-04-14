export type LoanApplicationStatus = "Pending" | "Approved" | "Rejected";

export interface LoanApplicationUser {
  id: string;
  email: string;
  name: string;
}

export interface LoanApplication {
  id: string;
  referenceId?: string | null;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  dob: string | null;
  gender: string | null;
  address: string;
  city: string;
  pincode: string;
  loanType: string;
  loanAmount: number;
  companyName: string | null;
  monthlyIncome: number | null;
  existingEmi: number | null;
  primaryBank: string | null;
  cibilScore: string | null;
  bankStatementPdf: string | null;
  aadharNumber: string;
  panNumber: string;
  aadharFrontImage: string | null;
  aadharBackImage: string | null;
  aadharPdf: string | null;
  panCardImage: string | null;
  panCardPdf: string | null;
  nomineeName: string;
  nomineeRelation: string | null;
  paymentMethod: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  status: LoanApplicationStatus;
  createdAt: string;
  updatedAt: string;
  user?: LoanApplicationUser;
}

export interface GetAllLoanApplicationsResponse {
  message: string;
  applications: LoanApplication[];
  count: number;
}

export interface SingleLoanApplicationResponse {
  message: string;
  application: LoanApplication;
}