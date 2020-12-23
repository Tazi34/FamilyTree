import { Sex } from "./Sex";

export type FullUserInformation = {
  userId: number;
  name: string;
  surname: string;
  email: string;
  password: string;
  previousSurnames: string[];
  token: string;
  role: string;
  sex: Sex;
};
