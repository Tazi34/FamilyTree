import { CircularProgress, makeStyles, Paper } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useThunkDispatch } from "../..";
import { CREATE_POST_FORM_PAGE_URI } from "../../applicationRouting";
import { ApplicationState } from "../../helpers";
import { Post } from "../../model/Post";
import { withAlertMessage } from "../alerts/withAlert";
import { tryOpenChat } from "../chat/chatReducer";
import PostCreator from "./PostCreator";
import PostsList from "./PostsList";
import {
  deletePost,
  getPostsByBlogId,
  postsSelectors,
} from "./redux/postsReducer";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    margin: "50px auto",
    padding: 30,
  },
}));
interface ParamTypes {
  blogId: string | undefined;
}
const BlogPage = (props: any) => {
  const classes = useStyles();
  const dispatch = useThunkDispatch();
  const blogId = props.computedMatch.params.blogId;
  const history = useHistory();

  const posts = useSelector((state: ApplicationState): Post[] => {
    return postsSelectors.selectAll(state);
  });

  useEffect(() => {
    dispatch(getPostsByBlogId(parseFloat(blogId)));
  }, [blogId]);

  const redirectToPostForm = () => {
    history.push(CREATE_POST_FORM_PAGE_URI);
  };

  const handlePostDelete = (id: number) => {
    dispatch(deletePost(id)).then((response: any) => {
      if (!response.error) {
        props.alertSuccess("Post deleted");
      } else {
        props.alertError("Couldn't delete post. Try again later");
      }
    });
  };
  const handleContact = () => {
    dispatch(tryOpenChat(blogId));
  };

  if (!blogId) {
    return null;
  }

  return (
    <Paper className={classes.root}>
      <PostCreator redirectToPostForm={redirectToPostForm}></PostCreator>
      <div>
        {!Boolean(posts) ? (
          <CircularProgress />
        ) : (
          <PostsList posts={posts} onPostDelete={handlePostDelete} />
        )}
      </div>
    </Paper>
  );
};

export default withAlertMessage(BlogPage);
