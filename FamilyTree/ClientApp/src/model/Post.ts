import { Comment } from "./Comment";

export interface Post {
  postId: number;
  userId: number;
  user: {
    name: string;
    surname: string;
    pictureUrl: string;
  };

  creationTime: string;
  title: string;
  text: string;
  pictureUrl: string;
  comments: Comment[];
}
