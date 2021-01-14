import { Sex } from "./Sex";

export type Profile = {
  name: string;
  surname: string;
  birthday: string;
  pictureUrl: string;
  sex?: Sex;
};
