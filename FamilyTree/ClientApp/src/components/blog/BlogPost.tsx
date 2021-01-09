import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Theme,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Skeleton from "@material-ui/lab/Skeleton";
import { index } from "d3";
import { formatDistance } from "date-fns";
import { convertFromRaw, EditorState } from "draft-js";
import * as React from "react";
import { Editor } from "react-draft-wysiwyg";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Post } from "../../model/Post";
import CommentsProvider from "../comments/CommentsProvider";
import CommentsSection from "../comments/CommentsSection";

const useStyles = makeStyles((theme: Theme) => ({
  postPage: {
    width: "100%",
    minHeight: "100%",
    backgroundColor: theme.palette.background.paper,
    paddingLeft: 10,
    paddingRight: 10,
  },
  postTitle: {},
  postBody: {},
  commentsSection: {},
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
  },
  postContent: {
    overflowY: "hidden",
    paddingTop: 0,
  },
}));
type Props = {
  post: Post | null;
  canEdit: boolean;
  canDelete: boolean;
  onEditPost?: (postId: number) => void;
  onDeletePost?: (postId: number) => void;
};
const BlogPost = ({
  post,
  canDelete,
  canEdit,
  onEditPost: onEdit,
  onDeletePost: onDelete,
}: Props) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  if (!post) {
    return (
      <div className={classes.postPage}>
        <Skeleton variant="rect" height={600} />
      </div>
    );
  }

  let editorState: EditorState;
  try {
    const raw = JSON.parse(post.text);
    const contentState = convertFromRaw(raw as any);

    editorState = EditorState.createWithContent(contentState);
  } catch (err) {
    editorState = EditorState.createEmpty();
  }

  const handleContextMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleContextMenuClose = () => {
    setAnchorEl(null);
  };
  const handleEdit = () => {
    if (onEdit && canEdit) onEdit(post.postId);
  };
  const handleDelete = () => {
    if (onDelete && canDelete) onDelete(post.postId);
    handleContextMenuClose();
  };

  const displayDate = formatDistance(new Date(post.creationTime), new Date());
  const headerAction =
    canEdit || canDelete ? (
      <IconButton aria-label="settings" onClick={handleContextMenuOpen}>
        <MoreVertIcon />
      </IconButton>
    ) : null;
  return (
    <div className={classes.postPage}>
      <Card className={classes.cardRoot}>
        {(canDelete || canEdit) && (
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleContextMenuClose}
          >
            {canEdit && <MenuItem onClick={handleEdit}>Edit</MenuItem>}
            {canDelete && <MenuItem onClick={handleDelete}>Delete</MenuItem>}
          </Menu>
        )}

        <CardHeader
          title={post.title}
          subheader={displayDate}
          action={headerAction}
          avatar={<Avatar src={post.user.pictureUrl} />}
        />
        <CardContent className={classes.postContent}>
          <Editor
            editorState={editorState}
            toolbarHidden={true}
            readOnly
            onChange={() => {}}
          />
        </CardContent>
      </Card>

      <CommentsProvider postId={post.postId} />
    </div>
  );
};

export default BlogPost;
