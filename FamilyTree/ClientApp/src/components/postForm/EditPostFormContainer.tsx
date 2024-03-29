import { makeStyles, Theme } from "@material-ui/core";
import axios from "axios";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router";
import { useThunkDispatch } from "../..";
import { HOME_PAGE_URI } from "../../applicationRouting";
import { baseURL, BLOG_API_URL } from "../../helpers/apiHelpers";
import { Post } from "../../model/Post";
import useAlert from "../alerts/useAlert";
import { withAlertMessage } from "../alerts/withAlert";
import { EditPostRequestData } from "../blog/API/editPost";
import { editPost, postByIdSelector } from "../blog/redux/postsReducer";
import PostForm from "./PostForm";
const useStyles = makeStyles((theme: Theme) => ({
  container: {
    minHeight: "100%",
    background: theme.palette.background.paper,
  },
}));

const EditPostFormContainer = (props: any) => {
  const dispatch = useThunkDispatch();
  const classes = useStyles();
  const id = props.computedMatch.params.postId;
  const history = useHistory();
  const alert = useAlert();

  const [post, setPost] = React.useState<Post | undefined>(undefined);
  React.useEffect(() => {
    axios
      .get<Post>(`${BLOG_API_URL}/post/${id}`)
      .then((response) => {
        setPost(response.data);
      })
      .catch((err) => history.push(`${HOME_PAGE_URI}`));
  }, []);

  if (!post) {
    return <div className={classes.container} />;
  }

  const handleEditPost = (content: string, title: string) => {
    const data: EditPostRequestData = {
      text: content,
      pictureUrl: "",
      title,
      postId: parseFloat(id),
    };
    dispatch(editPost(data)).then((response: any) => {
      if (!response.error) {
        alert.success("Post edited. ");
        history.goBack();
      } else {
        alert.error("Couldnt edit this post. Try again later");
      }
    });
  };

  return (
    <div className={classes.container}>
      <PostForm onSubmit={handleEditPost} post={post} />
    </div>
  );
};

export default withAlertMessage(EditPostFormContainer);
