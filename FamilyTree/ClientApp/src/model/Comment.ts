export type Comment = {
  commentId: number;
  text: string;
  time: string;
  user: {
    userId: number;
    name: string;
    surname: string;
    pictureUrl: string;
  };
};
