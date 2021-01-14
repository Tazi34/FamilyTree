export type LoginUserRequestData = {
  email: string;
  password: string;
};

export type LoginUserResponseSuccessData = {
  userId: number;
  name: string;
  surname: string;
  email: string;
  token: string;
  role: string;
  pictureUrl: string;
  birthday: string;
  previousSurnames: string[];
};
