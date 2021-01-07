import { makeStyles, Paper } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useThunkDispatch } from "../..";
import { BLOG_PAGE_URI } from "../../applicationRouting";
import { CreatePostRequestData } from "../blog/API/createPost";
import { createPost } from "../blog/redux/postsReducer";
import { getUser } from "../loginPage/authenticationReducer";
import PostForm from "./PostForm";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "",
  },
}));

const CreatePostFormContainer = (props: any) => {
  const classes = useStyles();
  const dispatch = useThunkDispatch();
  const history = useHistory();
  const user = useSelector(getUser);

  const handleCreatePost = (content: string, title: string) => {
    const data: CreatePostRequestData = {
      text: content,
      pictureUrl: "",
      title,
    };
    dispatch(createPost(data)).then((resp: any) => {
      if (!resp.error) {
        history.push(`${BLOG_PAGE_URI}/${user!.id}`);
      } else {
        //TODO
      }
    });
  };

  return (
    <Paper className={classes.root}>
      <PostForm onSubmit={handleCreatePost} />
    </Paper>
  );
};

export default CreatePostFormContainer;
