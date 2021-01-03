import { List, makeStyles, Paper } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { Post } from "../../model/Post";
import PostCard from "./PostCard";
import PostCardContainer from "./PostCardContainer";

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  postCard: {
    marginBottom: 80,
  },
}));
type PostsListProps = {
  posts: Post[];

  onPostDelete?: (id: number) => void;
};
const PostsList = ({ posts, onPostDelete }: PostsListProps) => {
  const classes = useStyles();

  return (
    <List component={"div"} className={classes.root}>
      {posts.map((p: Post) => (
        <div key={p.postId} className={classes.postCard}>
          <PostCardContainer onPostDelete={onPostDelete} post={p} />
        </div>
      ))}
    </List>
  );
};

export default PostsList;
