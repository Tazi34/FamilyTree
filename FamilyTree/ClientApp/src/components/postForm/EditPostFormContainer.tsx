import axios from "axios";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router";
import { useThunkDispatch } from "../..";
import { HOME_PAGE_URI } from "../../applicationRouting";
import { BLOG_API_URL } from "../../helpers/apiHelpers";
import { Post } from "../../model/Post";
import { withAlertMessage } from "../alerts/withAlert";
import { EditPostRequestData } from "../blog/API/editPost";
import { editPost, postByIdSelector } from "../blog/redux/postsReducer";
import PostForm from "./PostForm";

const EditPostFormContainer = (props: any) => {
  const dispatch = useThunkDispatch();
  const id = props.computedMatch.params.postId;
  const history = useHistory();
  const [post, setPost] = React.useState<Post | undefined>(undefined);
  React.useEffect(() => {
    axios
      .get<Post>(`${BLOG_API_URL}/post/${id}`)
      .then((response) => {
        console.log(post);
        setPost(response.data);
      })
      .catch((err) => history.push(`${HOME_PAGE_URI}`));
  }, []);

  if (!post) {
    return null;
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
        props.alertSuccess("Post edited. ");
        history.goBack();
      } else {
        props.alertError("Couldnt edit this post. Try again later");
      }
    });
  };

  return <PostForm onSubmit={handleEditPost} post={post} />;
};

export default withAlertMessage(EditPostFormContainer);
