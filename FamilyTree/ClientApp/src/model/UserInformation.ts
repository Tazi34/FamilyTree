import { Sex } from "./Sex";

export type FullUserInformation = {
  userId: number;
  name: string;
  surname: string;
  email: string;
  password: string;
  maidenName: string;
  token: string;
  role: string;
  birthday: string;
  sex: Sex;
};
