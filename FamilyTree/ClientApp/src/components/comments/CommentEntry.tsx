import { Menu, MenuItem, Typography } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles, Theme } from "@material-ui/core/styles";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { formatDistance } from "date-fns";
import React from "react";
import { formatInitials } from "../../helpers/formatters";
import { Comment } from "../../model/Comment";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",

    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
}));

type Props = {
  comment: Comment;
  canEdit: boolean;
  onEdit: (comment: Comment) => void;
  onDelete: (id: number) => void;
};
const CommentEntry = ({ comment, onEdit, onDelete, canEdit }: Props) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleContextMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleContextMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar
          alt={formatInitials(comment.user.name, comment.user.surname)}
          src={comment.user.pictureUrl}
        />
      </ListItemAvatar>
      <ListItemText
        primary={`${comment.user.name} ${comment.user.surname}`}
        secondary={
          <React.Fragment>
            <Typography component="span" variant="body2" color="textPrimary">
              {formatDistance(new Date(comment.time), new Date())} ago
            </Typography>
            <div>{comment.text}</div>
          </React.Fragment>
        }
      />
      {canEdit && (
        <IconButton edge="end" aria-label="comments">
          <MoreVertIcon onClick={handleContextMenuOpen} />
        </IconButton>
      )}

      {canEdit && (
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleContextMenuClose}
        >
          <MenuItem onClick={() => onDelete(comment.commentId)}>
            Delete
          </MenuItem>
        </Menu>
      )}
    </ListItem>
  );
};

export default CommentEntry;
