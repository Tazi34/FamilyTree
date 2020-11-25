export interface Post {
  id: number;
  publicationDate: Date;
  title: string;
  text: string;
  author: {
    id: number;
    name: string;
    surname: string;
  };
}
