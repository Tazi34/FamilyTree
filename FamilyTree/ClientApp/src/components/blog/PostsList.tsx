import { List, makeStyles, Paper } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { Post } from "../../model/Post";
import PostCard from "./PostCard";

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  postCard: {
    margin: "5px auto",
  },
}));
type PostsListProps = {
  posts: Post[];
  onPostAdd: Function;
  onPostDelete: Function;
};
const PostsList = ({ posts, onPostAdd, onPostDelete }: PostsListProps) => {
  const classes = useStyles();

  return (
    <List component={"div"} className={classes.root}>
      {posts.map((p: Post) => (
        <div className={classes.postCard}>
          <PostCard onPostDelete={onPostDelete} post={p} />
        </div>
      ))}
    </List>
  );
};

export default PostsList;
