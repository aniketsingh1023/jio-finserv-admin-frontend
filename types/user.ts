export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  gender: string | null;
  dob: string | null;
  address: string | null;
  city: string | null;
  pincode: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllUsersResponse {
  message: string;
  users: User[];
  count: number;
}

export interface SingleUserResponse {
  message: string;
  user: User;
}