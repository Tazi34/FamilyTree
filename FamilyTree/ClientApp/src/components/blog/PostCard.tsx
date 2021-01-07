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
import { areEqualShallow } from "../../helpers/helpers";

const useStyles = makeStyles({
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
    width: "100%",

    height: 450,
    // border: "1px solid red",
  },
  postContent: {
    height: 300,
    overflowY: "hidden",
    paddingTop: 0,
  },
});
type PostCardProps = {
  post: Post;
  onPostDelete?: (id: number) => void;
  navigateToEdit: () => void;
  isAdmin?: boolean;
  isOwner?: boolean;
};

const PostCard = ({
  post,
  onPostDelete,
  navigateToEdit,
  isOwner,
  isAdmin,
}: PostCardProps) => {
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

  const headerAction =
    isOwner || isAdmin ? (
      <IconButton aria-label="settings" onClick={handleContextMenuOpen}>
        <MoreVertIcon />
      </IconButton>
    ) : null;

  console.log("POST CARD");

  return (
    <Card className={classes.cardRoot}>
      {(isOwner || isAdmin) && (
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleContextMenuClose}
        >
          {isOwner && <MenuItem onClick={navigateToEdit}>Edit</MenuItem>}
          <MenuItem onClick={handlePostDelete}>Delete</MenuItem>
        </Menu>
      )}

      <CardHeader
        title={post.title}
        subheader={displayDate}
        action={headerAction}
      />
      <CardContent className={classes.postContent}>
        <Editor
          editorState={editorState}
          toolbarHidden={true}
          readOnly
          onChange={() => {}}
        />
      </CardContent>
      <CardActions>
        <Button size="small" color="primary">
          Read more...
        </Button>
      </CardActions>
    </Card>
  );
};

const areEqual = (prev: PostCardProps, next: PostCardProps) => {
  return areEqualShallow(prev.post, next.post);
};
export default React.memo(PostCard, areEqual);
