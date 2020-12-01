import { Box, makeStyles, Paper, TextField } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { Post } from "../../model/Post";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: 10,
  },
  column: {
    margin: 10,
  },
  icon: {
    margin: 10,
    fontSize: 40,
  },
}));

const sampleNewPost: Post = {
  author: {
    id: 1,
    name: "Nowy",
    surname: "Autor",
  },
  id: -1,
  publicationDate: new Date(),
  text: "New post test",
  title: "Title",
};

const PostCreator = (props: any) => {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <Box display="flex" alignItems="center">
        <AccountCircleIcon className={classes.icon}></AccountCircleIcon>
        <TextField
          className={classes.column}
          multiline
          rows={2}
          id="postCreatorInput"
          label="What would you want to share?"
          fullWidth
          onClick={() => props.onAddPost(sampleNewPost)}
        />
      </Box>
    </Paper>
  );
};

export default PostCreator;
