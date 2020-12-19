import { makeStyles, Paper } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { POST_FORM_PAGE_URI } from "../../applicationRouting";
import { ApplicationState } from "../../helpers";
import { Post } from "../../model/Post";
import { tryOpenChat } from "../chat/chatReducer";
import PostCreator from "./PostCreator";
import PostsList from "./PostsList";
import { deletePost, getPostsByBlogId } from "./redux/postsReducer";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "80%",
    margin: "50px auto",
    padding: 30,
  },
  textEditorContainer: {
    width: 700,
    height: 400,
    background: "grey",
  },
}));
interface ParamTypes {
  blogId: string | undefined;
}
const BlogPage = (props: any) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const blogId = props.computedMatch.params.blogId;
  const history = useHistory();
  useEffect(() => {
    dispatch(getPostsByBlogId(parseFloat(blogId)));
  }, []);

  const redirectToPostForm = () => {
    history.push(POST_FORM_PAGE_URI);
  };

  const handlePostDelete = (id: number) => {
    dispatch(deletePost(id));
  };
  const handleContact = () => {
    dispatch(tryOpenChat(blogId));
  };
  const posts = useSelector((state: ApplicationState): Post[] => {
    var p = state.posts;
    var r = p.ids.map((i) => p.entities[i]) as Post[];

    return r;
  });
  if (!blogId) {
    return null;
  }

  return (
    <Paper className={classes.root}>
      <PostCreator redirectToPostForm={redirectToPostForm}></PostCreator>
      <div>
        <PostsList
          posts={posts}
          onPostDelete={handlePostDelete}
          onPostAdd={redirectToPostForm}
        />
      </div>
    </Paper>
  );
};

export default BlogPage;
