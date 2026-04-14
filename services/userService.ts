import { apiFetch } from "@/lib/api";
import type { GetAllUsersResponse, SingleUserResponse } from "@/types/user";

const USERS_BASE_PATH = "/users";

export async function getAllUsers() {
  return apiFetch<GetAllUsersResponse>(`${USERS_BASE_PATH}/admin/all`);
}

export async function deleteUser(id: string) {
  return apiFetch<SingleUserResponse>(`${USERS_BASE_PATH}/${id}/admin`, {
    method: "DELETE",
  });
}