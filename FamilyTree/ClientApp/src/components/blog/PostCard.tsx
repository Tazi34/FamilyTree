import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Typography,
} from "@material-ui/core";
import { convertFromRaw, EditorState } from "draft-js";
import * as React from "react";
import { Editor } from "react-draft-wysiwyg";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Post } from "../../model/Post";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { formatDistance } from "date-fns";

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
  cardRoot: {
    height: "100%",
    width: "100%",
    border: "1px solid red",
  },
});
type PostCardProps = {
  post: Post;
  onPostDelete?: (id: number) => void;
  navigateToEdit: () => void;
};

const PostCard = ({ post, onPostDelete, navigateToEdit }: PostCardProps) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleContextMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleContextMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePostDelete = () => {
    if (onPostDelete) onPostDelete(post.postId);
    handleContextMenuClose();
  };

  let editorState: EditorState;
  try {
    const raw = JSON.parse(post.text);
    const contentState = convertFromRaw(raw as any);

    editorState = EditorState.createWithContent(contentState);
  } catch (err) {
    editorState = EditorState.createEmpty();
  }

  const date = new Date(post.creationTime);
  const displayDate = formatDistance(date, new Date());

  return (
    <Card className={classes.cardRoot}>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleContextMenuClose}
      >
        <MenuItem onClick={navigateToEdit}>Edit</MenuItem>
        <MenuItem onClick={handlePostDelete}>Delete</MenuItem>
      </Menu>
      <CardHeader
        title={post.title}
        subheader={displayDate}
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon onClick={handleContextMenuOpen} />
          </IconButton>
        }
      />
      <CardContent>
        <Editor
          editorState={editorState}
          toolbarHidden={true}
          readOnly
          onChange={() => {}}
        />
      </CardContent>
      <CardActions>
        {/* <Button size="small" color="primary">
          Read More
        </Button>
        <Button onClick={handlePostDelete} size="small" color="secondary">
          Delete
        </Button> */}
      </CardActions>
    </Card>
  );
};

export default PostCard;
