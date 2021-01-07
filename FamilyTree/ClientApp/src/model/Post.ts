import { Comment } from "./Comment";

export interface Post {
  postId: number;
  userId: number;
  creationTime: string;
  title: string;
  text: string;
  pictureUrl: string;
  comments: Comment[];
}
