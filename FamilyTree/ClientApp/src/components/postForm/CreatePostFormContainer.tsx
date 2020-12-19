import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { useDispatch } from "react-redux";
import { Post } from "../../model/Post";
import { CreatePostRequestData } from "../blog/API/createPost";
import { createPost } from "../blog/redux/postsReducer";
import PostForm from "./PostForm";

const useStyles = makeStyles((theme: Theme) => ({}));

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

  return <PostForm onSubmit={handleCreatePost} />;
};

export default CreatePostFormContainer;
