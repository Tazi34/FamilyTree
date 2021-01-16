import { Fade, List, makeStyles, Paper } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import Skeleton from "@material-ui/lab/Skeleton";
import * as React from "react";
import { useSelector } from "react-redux";
import { Post } from "../../model/Post";
import { getUser } from "../loginPage/authenticationReducer";
import EmptyPostsList from "./EmptyPostsList";
import PostCard from "./PostCard";
import PostCardContainer from "./PostCardContainer";

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  postCard: {
    marginBottom: 20,
  },
  skeleton: {
    width: "100%",
    height: 450,
  },
  skeletonContainer: {},
}));
type PostsListProps = {
  posts: Post[];
  loaded: boolean;
  onPostDelete?: (id: number) => void;
  isOwner: boolean;
};
const PostsList = ({
  posts,
  onPostDelete,
  loaded,
  isOwner,
}: PostsListProps) => {
  const classes = useStyles();

  const hasPosts = posts && posts.length > 0;

  const showEmptyList = loaded && !hasPosts;
  const showPostsList = loaded && hasPosts;

  if (showEmptyList) {
    return <EmptyPostsList isOwner={isOwner} />;
  }
  return (
    <List component={"div"} className={classes.root}>
      {showPostsList &&
        posts.map((p: Post) => (
          <Fade key={p.postId} in={loaded} timeout={1000}>
            <div className={classes.postCard}>
              <PostCardContainer onPostDelete={onPostDelete} post={p} />
            </div>
          </Fade>
        ))}

      {!loaded &&
        [...Array(4)].map(Math.random).map((a, index) => (
          <div key={index} className={classes.postCard}>
            <div className={classes.skeletonContainer}>
              <Skeleton variant="rect" className={classes.skeleton} />
            </div>
          </div>
        ))}
    </List>
  );
};

export default PostsList;