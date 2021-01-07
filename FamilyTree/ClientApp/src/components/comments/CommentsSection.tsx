import { Divider, makeStyles, Typography } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { useSelector } from "react-redux";
import { Comment } from "../../model/Comment";
import { getUser } from "../loginPage/authenticationReducer";
import CommentEntry from "./CommentEntry";
import CreatePostArea from "./CreatePostArea";

const useStyles = makeStyles((theme: Theme) => ({
  sectionTitle: {
    marginLeft: 20,
    fontSize: 20,
    marginBottom: 10,
    marginTop: 10,
  },
}));
type Props = {
  comments: Comment[];
  onEdit: (comment: Comment) => void;
  onDelete: (id: number) => void;
  onCreate: (text: string) => any;
};

const CommentsSection = ({ comments, onEdit, onDelete, onCreate }: Props) => {
  const classes = useStyles();
  const user = useSelector(getUser);

  return (
    <div>
      <Typography className={classes.sectionTitle}>Comments section</Typography>
      {user && (
        <div>
          <CreatePostArea user={user} onSubmit={onCreate} />
          <Divider
            variant="inset"
            component="div"
            style={{ marginRight: 16 }}
          />
        </div>
      )}

      {comments.map((comment) => (
        <div>
          <CommentEntry
            key={comment.commentId}
            comment={comment}
            onEdit={onEdit}
            onDelete={onDelete}
            canEdit={Boolean(user) && comment.user.userId === user?.id}
          />
          <Divider
            variant="inset"
            component="div"
            style={{ marginRight: 16 }}
          />
        </div>
      ))}
    </div>
  );
};

export default CommentsSection;
