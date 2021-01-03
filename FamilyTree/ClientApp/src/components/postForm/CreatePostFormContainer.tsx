import { makeStyles, Paper } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { useDispatch } from "react-redux";
import { Post } from "../../model/Post";
import { CreatePostRequestData } from "../blog/API/createPost";
import { createPost } from "../blog/redux/postsReducer";
import PostForm from "./PostForm";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "",
  },
}));

const CreatePostFormContainer = (props: any) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleCreatePost = (content: string, title: string) => {
    const data: CreatePostRequestData = {
      text: content,
      pictureUrl: "",
      title,
    };
    dispatch(createPost(data));
  };

  return (
    <Paper className={classes.root}>
      <PostForm onSubmit={handleCreatePost} />
    </Paper>
  );
};

export default CreatePostFormContainer;
