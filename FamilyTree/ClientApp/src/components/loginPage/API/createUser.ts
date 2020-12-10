import { UserRegistrationData } from "../../registration/RegistrationForm";

export type CreateUserRequestData = UserRegistrationData;

export type CreateUserSuccessResponse = {
  userId: number;
  name: string;
  surname: string;
  email: string;
  password: string;
  previousSurnames: string[];
  token: string;
  role: string;
};
