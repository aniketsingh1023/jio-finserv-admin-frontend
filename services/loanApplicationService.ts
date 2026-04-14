import { apiFetch } from "@/lib/api";
import type {
  GetAllLoanApplicationsResponse,
  LoanApplicationStatus,
  SingleLoanApplicationResponse,
} from "@/types/loanApplication";

const LOAN_APPLICATIONS_BASE_PATH = "/loan-applications";

export async function getAllLoanApplications() {
  return apiFetch<GetAllLoanApplicationsResponse>(
    `${LOAN_APPLICATIONS_BASE_PATH}/admin/all`
  );
}

export async function updateLoanApplicationStatus(
  id: string,
  status: LoanApplicationStatus
) {
  return apiFetch<SingleLoanApplicationResponse>(
    `${LOAN_APPLICATIONS_BASE_PATH}/${id}/admin`,
    {
      method: "PUT",
      body: JSON.stringify({ status }),
    }
  );
}

export async function deleteLoanApplication(id: string) {
  return apiFetch<SingleLoanApplicationResponse>(
    `${LOAN_APPLICATIONS_BASE_PATH}/${id}/admin`,
    {
      method: "DELETE",
    }
  );
}