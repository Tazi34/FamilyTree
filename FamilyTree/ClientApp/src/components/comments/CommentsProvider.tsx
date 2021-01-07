import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { useThunkDispatch } from "../..";
import { CreateCommentRequestData } from "../comments/commentsAPI/createComment/requestCreateComment";
import { DeleteCommentRequestData } from "../comments/commentsAPI/deleteComment/requestDeleteComment";
import { EditCommentRequestData } from "../comments/commentsAPI/editComment/requestEditComment";
import {
  createComment,
  deleteComment,
  editComment,
  getComments,
} from "../blog/redux/comments/commentsActions";
import CommentsSection from "./CommentsSection";
import { Comment } from "../../model/Comment";
import { useSelector } from "react-redux";
import { selectComments } from "../blog/redux/postsReducer";
import { withAlertMessage } from "../alerts/withAlert";

const useStyles = makeStyles((theme: Theme) => ({}));
type Props = {
  postId: number;
  [x: string]: any;
};
const CommentsProvider = ({ postId, alertError, alertSuccess }: Props) => {
  const classes = useStyles();
  const dispatch = useThunkDispatch();
  const comments = useSelector(selectComments);

  React.useEffect(() => {
    dispatch(getComments({ postId }));
  }, [postId]);
  const handleCreateComment = (text: string) => {
    const data: CreateCommentRequestData = {
      postId,
      text,
    };
    return dispatch(createComment(data)).then((resp: any) => {
      if (resp.error) {
        alertError("Error creating comment");
      } else {
        alertSuccess("Comment created");
      }
      return resp;
    });
  };
  const handleDeleteComment = (commentId: number) => {
    dispatch(deleteComment({ commentId })).then(() => {});
  };
  const handleEditComment = (comment: Comment) => {
    const editData: EditCommentRequestData = comment;
    //dispatch(editComment(data)).then(() => {});
  };
  return (
    <CommentsSection
      comments={comments}
      onEdit={handleEditComment}
      onDelete={handleDeleteComment}
      onCreate={handleCreateComment}
    />
  );
};

export default withAlertMessage(CommentsProvider);
