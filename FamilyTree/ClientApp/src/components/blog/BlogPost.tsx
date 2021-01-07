import {
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
  const [editMode, setEditMode] = React.useState(false);

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
  //TODO uwspolnic z post CARD

  // const comments = [...Array(4)].map(Math.random).map((a, index) => ({
  //   user: {
  //     name: "Pawel",
  //     surname: "Kasjaniuk",
  //     pictureUrl: "",
  //     userId: 1,
  //   },
  //   commentId: index,
  //   time: "2021-01-07T16:40:13.615Z",
  //   text:
  //     "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magnam animi eligendi accusamus ducimus pariatur? Eaque autem debitis quibusdam incidunt tenetur explicabo fuga animi expedita fugiat. Nesciunt tempore optio fuga nisi? Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magnam animi eligendi accusamus ducimus pariatur? Eaque autem debitis quibusdam incidunt tenetur explicabo fuga animi expedita fugiat. Nesciunt tempore optio fuga nisi? Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magnam animi eligendi accusamus ducimus pariatur? Eaque autem debitis quibusdam incidunt tenetur explicabo fuga animi expedita fugiat. Nesciunt tempore optio fuga nisi? Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magnam animi eligendi accusamus ducimus pariatur? Eaque autem debitis quibusdam incidunt tenetur explicabo fuga animi expedita fugiat. Nesciunt tempore optio fuga nisi?",
  // }));

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
