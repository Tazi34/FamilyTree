import { Button, makeStyles, Paper } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { Post } from "../../model/Post";
import PostCreator from "./PostCreator";
import PostsList from "./PostsList";
import {
  addPost,
  deletePost,
  getPostsByBlogId,
  postsSelectors,
  PostsState,
} from "./redux/postsReducer";
import React, { useEffect } from "react";
import { ApplicationState } from "../../helpers";
import { useParams } from "react-router";
import { RichTextEditor } from "../richTextEditor/RichTextEditor";
import { tryOpenChat } from "../chat/chatReducer";

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

  useEffect(() => {
    dispatch(getPostsByBlogId(parseFloat(blogId)));
  }, []);

  const handlePostAdd = (post: Post) => {
    dispatch(addPost(post));
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
    console.log(r);
    return r;
  });
  if (!blogId) {
    return null;
  }

  return (
    <Paper className={classes.root}>
      <div className={classes.textEditorContainer}>
        <Button onClick={handleContact}>Contact</Button>
        <RichTextEditor></RichTextEditor>
      </div>

      <PostCreator onAddPost={handlePostAdd}></PostCreator>
      <div>
        <PostsList
          posts={posts}
          onPostDelete={handlePostDelete}
          onPostAdd={handlePostAdd}
        ></PostsList>
      </div>
    </Paper>
  );
};

export default BlogPage;
