import {
  Button,
  Card,
  CardActions,
  CardContent,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { convertFromRaw, EditorState } from "draft-js";
import * as React from "react";
import { Editor } from "react-draft-wysiwyg";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Post } from "../../model/Post";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});
type PostCardProps = {
  post: Post;
  onPostDelete: Function;
};

const PostCard = ({ post, onPostDelete }: PostCardProps) => {
  const classes = useStyles();
  let editorState: EditorState;
  try {
    const raw = JSON.parse(post.text);
    console.log(raw);
    const contentState = convertFromRaw(raw as any);

    editorState = EditorState.createWithContent(contentState);
  } catch (err) {
    editorState = EditorState.createEmpty();
  }

  return (
    <Card>
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          {post.title}
        </Typography>
        <Typography variant="h5" component="h2"></Typography>

        <Editor
          editorState={editorState}
          toolbarHidden={true}
          readOnly
          onChange={() => {}}
        />
      </CardContent>
      <CardActions>
        <Button size="small" color="primary">
          Read More
        </Button>
        <Button
          onClick={() => onPostDelete(post.postId)}
          size="small"
          color="secondary"
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default PostCard;
