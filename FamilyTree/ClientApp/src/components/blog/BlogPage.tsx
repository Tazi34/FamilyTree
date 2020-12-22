import { CircularProgress, makeStyles, Paper } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router";
import { useThunkDispatch } from "../..";
import {
  CREATE_POST_FORM_PAGE_URI,
  HOME_PAGE_URI,
  PROFILE_PAGE_URI,
} from "../../applicationRouting";
import { ApplicationState } from "../../helpers";
import { StatusState } from "../../helpers/helpers";
import { BlogProfile } from "../../model/BlogProfile";
import { Post } from "../../model/Post";
import { withAlertMessage } from "../alerts/withAlert";
import { tryOpenChat } from "../chat/chatReducer";
import { getUser } from "../loginPage/authenticationReducer";
import BlogProfileSection from "./BlogProfileSection";
import BlogOwnerSection from "./BlogOwnerSection";
import PostsList from "./PostsList";
import { deletePost, getBlog, postsSelectors } from "./redux/postsReducer";

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

  const user = useSelector(getUser);
  const fetchStatus = useSelector<ApplicationState, StatusState>((state) => {
    return state.posts.status;
  });
  const posts = useSelector<ApplicationState, Post[]>((state) => {
    return postsSelectors.selectAll(state);
  });
  const profile = useSelector<ApplicationState, BlogProfile | null>((state) => {
    return state.posts.profile;
  });

  useEffect(() => {
    dispatch(getBlog(parseFloat(blogId)));
  }, []);

  const redirectToPostForm = () => {
    history.push(CREATE_POST_FORM_PAGE_URI);
  };
  const redirectToProfileEdit = () => {
    history.push(PROFILE_PAGE_URI);
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
    return <Redirect to={HOME_PAGE_URI} />;
  }
  if (fetchStatus.loading || !profile) {
    return <CircularProgress />;
  }

  const isUserOwnerOfBlog = profile.userId === user?.id;
  return (
    <Paper className={classes.root}>
      {isUserOwnerOfBlog ? (
        <BlogOwnerSection
          onEditProfile={redirectToProfileEdit}
          redirectToPostForm={redirectToPostForm}
        ></BlogOwnerSection>
      ) : (
        <BlogProfileSection onContact={handleContact} profile={profile} />
      )}

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
