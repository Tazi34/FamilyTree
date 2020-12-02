import {
  Button,
  Card,
  CardActions,
  CardContent,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
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

        <Typography variant="body2" component="p">
          {post.text}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary">
          Read More
        </Button>
        <Button
          onClick={() => onPostDelete(post.id)}
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
