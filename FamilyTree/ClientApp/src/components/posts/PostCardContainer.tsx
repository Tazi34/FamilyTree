import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import {
  EDIT_POST_FORM_PAGE_URI,
  POST_PAGE_URI,
} from "../../applicationRouting";
import { ADMIN_ROLE } from "../../helpers/roles";
import { Post } from "../../model/Post";
import { getUser } from "../loginPage/authenticationReducer";
import PostCard from "./PostCard";

const useStyles = makeStyles((theme: Theme) => ({}));

type Props = {
  post: Post;
  onPostDelete?: (id: number) => void;
};
const PostCardContainer = ({ onPostDelete, post }: Props) => {
  const classes = useStyles();
  const history = useHistory();
  const user = useSelector(getUser);

  const navigateToEdit = () => {
    history.push(`${EDIT_POST_FORM_PAGE_URI}/${post.postId}`);
  };
  const navigateToPost = () => {
    history.push(`${POST_PAGE_URI}/${post.postId}`);
  };
  return (
    <PostCard
      onReadMore={navigateToPost}
      post={post}
      onPostDelete={onPostDelete}
      navigateToEdit={navigateToEdit}
      isAdmin={Boolean(user?.role === ADMIN_ROLE)}
      isOwner={Boolean(user) && user!.id === post.userId}
    />
  );
};

export default PostCardContainer;
