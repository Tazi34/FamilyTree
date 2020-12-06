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
  previousSurnames: string[];
};
