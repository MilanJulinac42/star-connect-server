import { User } from "./user.entity";

export interface RegisterUserInput {
  email: string;
  password: string;
  username: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UpdateUserInput {
  email?: string;
  password?: string;
  username?: string;
  profilePicture?: string;
  biography?: string;
}

export interface UserAuthResponse {
  user: User;
  token: string;
}
