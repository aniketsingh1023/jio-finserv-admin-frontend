export type ContactStatus = "Unread" | "Read";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string | null;
  message: string;
  status: ContactStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllContactsResponse {
  message: string;
  count: number;
  data: ContactMessage[];
}

export interface SingleContactResponse {
  message: string;
  data: ContactMessage;
}