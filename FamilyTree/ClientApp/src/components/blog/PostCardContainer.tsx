import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { useHistory } from "react-router";
import { EDIT_POST_FORM_PAGE_URI } from "../../applicationRouting";
import { Post } from "../../model/Post";
import PostCard from "./PostCard";

const useStyles = makeStyles((theme: Theme) => ({}));

type Props = {
  post: Post;
  onPostDelete?: (id: number) => void;
};
const PostCardContainer = ({ onPostDelete, post }: Props) => {
  const classes = useStyles();
  const history = useHistory();
  const navigateToEdit = () => {
    history.push(`${EDIT_POST_FORM_PAGE_URI}/${post.postId}`);
  };
  return (
    <PostCard
      post={post}
      onPostDelete={onPostDelete}
      navigateToEdit={navigateToEdit}
    />
  );
};

export default PostCardContainer;
