import { makeStyles, Paper } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import PostsList from "./PostsList";
import posts from "../../samples/posts";
import PostCreator from "./PostCreator";
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "80%",
    margin: "50px auto",
    padding: 30,
  },
}));

const BlogPage = (props: any) => {
  const classes = useStyles();

  const openPostCreator = () => {
    alert("create post");
  };
  return (
    <Paper className={classes.root}>
      <PostCreator onTextEditClick={openPostCreator}></PostCreator>
      <div>
        <PostsList posts={posts}></PostsList>
      </div>
    </Paper>
  );
};

export default BlogPage;
