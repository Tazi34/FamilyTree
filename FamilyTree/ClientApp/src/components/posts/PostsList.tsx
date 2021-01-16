import { Fade, List, makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import Skeleton from "@material-ui/lab/Skeleton";
import * as React from "react";
import { Post } from "../../model/Post";
import EmptyPostsList from "./EmptyPostsList";
import PostCardContainer from "./PostCardContainer";
import Pagination from "@material-ui/lab/Pagination";

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
  const [currentPage, setCurrentPage] = React.useState(1);
  const classes = useStyles();
  const listRef = React.useRef<any>();
  const hasPosts = posts && posts.length > 0;

  const showEmptyList = loaded && !hasPosts;
  const showPostsList = loaded && hasPosts;

  if (showEmptyList) {
    return <EmptyPostsList isOwner={isOwner} />;
  }
  const postsPerPage = 5;
  const pages = Math.ceil(posts.length / postsPerPage);
  return (
    <List component={"div"} className={classes.root} ref={listRef}>
      {showPostsList &&
        posts
          .slice(
            (currentPage - 1) * postsPerPage,
            (currentPage - 1) * postsPerPage + postsPerPage
          )
          .map((p: Post) => (
            <Fade key={p.postId} in={loaded} timeout={1000}>
              <div className={classes.postCard}>
                <PostCardContainer onPostDelete={onPostDelete} post={p} />
              </div>
            </Fade>
          ))}

      {showPostsList && (
        <Pagination
          count={pages}
          defaultPage={1}
          siblingCount={1}
          onChange={(e, pageNo) => {
            setCurrentPage(pageNo);
            if (listRef.current) {
              window.scrollTo({ top: 0 });
            }
          }}
        />
      )}

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
