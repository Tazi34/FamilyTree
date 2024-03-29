import { makeStyles } from "@material-ui/core";
import * as React from "react";
import { useSelector } from "react-redux";
import { Redirect, useHistory, withRouter } from "react-router";
import { compose } from "recompose";
import { useThunkDispatch } from "../..";
import {
  EDIT_POST_FORM_PAGE_URI,
  HOME_PAGE_URI,
} from "../../applicationRouting";
import { ADMIN_ROLE } from "../../helpers/roles";
import useAlert from "../alerts/useAlert";
import { withAlertMessage } from "../alerts/withAlert";
import {
  deletePost,
  fetchPost,
  selectCurrentPost,
  selectPostStatus,
} from "../blog/redux/postsReducer";
import { getUser } from "../loginPage/authenticationReducer";
import BlogPost from "./BlogPost";

const useStyles = makeStyles(() => ({}));

type Props = {
  computedMatch: any;
} & any;
const BlogPostPage = (props: Props) => {
  const user = useSelector(getUser);

  const alert = useAlert();
  const history = useHistory();
  const postId = props.computedMatch.params.postId;
  const dispatch = useThunkDispatch();
  const post = useSelector(selectCurrentPost);

  const handleEditPost = (postId: number) => {
    history.push(`${EDIT_POST_FORM_PAGE_URI}/${postId}`);
  };
  const handleDeletePost = (id: number) => {
    dispatch(deletePost(id)).then((response: any) => {
      if (!response.error) {
        alert.success("Post deleted");
      } else {
        alert.error("Couldn't delete post. Try again later");
      }
    });
  };
  React.useEffect(() => {
    dispatch(fetchPost({ postId })).then((resp: any) => {
      if (resp.error) {
        history.push(HOME_PAGE_URI);
      }
    });
  }, [postId]);
  if (!postId) {
    return <Redirect to={HOME_PAGE_URI} />;
  }
  const isAdmin = Boolean(user?.role === ADMIN_ROLE);
  const isOwner = Boolean(user) && user!.id === post?.userId;
  return (
    <BlogPost
      post={post}
      canDelete={isAdmin || isOwner}
      canEdit={isOwner}
      onDeletePost={handleDeletePost}
      onEditPost={handleEditPost}
    />
  );
};

export default compose(withAlertMessage, withRouter)(BlogPostPage);
