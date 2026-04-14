import { apiFetch } from "@/lib/api";
import type {
  ContactStatus,
  GetAllContactsResponse,
  SingleContactResponse,
} from "@/types/contact";

const CONTACTS_BASE_PATH = "/contact";

export async function getAllContacts() {
  return apiFetch<GetAllContactsResponse>(CONTACTS_BASE_PATH);
}

export async function deleteContact(id: string) {
  return apiFetch<SingleContactResponse>(`${CONTACTS_BASE_PATH}/${id}`, {
    method: "DELETE",
  });
}

export async function updateContactStatus(id: string, status: ContactStatus) {
  return apiFetch<SingleContactResponse>(`${CONTACTS_BASE_PATH}/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}