import {
  Box,
  Button,
  Divider,
  makeStyles,
  Paper,
  TextField,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { convertToRaw, EditorState } from "draft-js";
import * as React from "react";
import { Editor } from "react-draft-wysiwyg";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { stateToHTML } from "draft-js-export-html";
import { stateFromHTML } from "draft-js-import-html";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    height: "100%",
    margin: "0 20px 0 20px",
    background: theme.palette.background.paper,
  },
  title: {
    marginBottom: 10,
  },
}));

type Props = {
  postContent?: string;
  onSubmit: (content: string, title: string) => void;
};
const PostForm = ({ postContent, onSubmit }: Props) => {
  const classes = useStyles();
  const [editorState, setEditorState] = React.useState(() => {
    if (postContent) {
      const content = stateFromHTML(postContent);
      return EditorState.createWithContent(content);
    } else {
      return EditorState.createEmpty();
    }
  });

  const handleSubmit = () => {
    const raw = convertToRaw(editorState.getCurrentContent());

    onSubmit(JSON.stringify(raw), "Title");
  };

  return (
    <div className={classes.root}>
      <TextField
        className={classes.title}
        placeholder="Post title"
        variant="outlined"
      />
      <Divider />
      <Editor
        editorState={editorState}
        wrapperClassName="postFormTextEditorWrapper"
        editorClassName="postFormTextEditor"
        onEditorStateChange={setEditorState}
      />
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
};

export default PostForm;
