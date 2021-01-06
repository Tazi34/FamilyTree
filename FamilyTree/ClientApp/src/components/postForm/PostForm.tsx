import {
  Box,
  Button,
  Divider,
  makeStyles,
  Paper,
  TextField,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import * as React from "react";
import { Editor } from "react-draft-wysiwyg";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Post } from "../../model/Post";
import { Formik } from "formik";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    height: "100%",
    margin: "0 auto",
    padding: 30,
  },
  title: {
    marginBottom: 10,
  },
}));

type Props = {
  post?: Post;
  onSubmit: (content: string, title: string) => void;
  onPictureUpload?: (file: any) => Promise<any>;
};
const PostForm = ({ post, onSubmit, onPictureUpload }: Props) => {
  const classes = useStyles();

  const [editorState, setEditorState] = React.useState(() => {
    console.log("init state");
    if (post) {
      try {
        const raw = JSON.parse(post.text);
        const contentState = convertFromRaw(raw as any);
        return EditorState.createWithContent(contentState);
      } catch (err) {
        return EditorState.createEmpty();
      }
    } else {
      return EditorState.createEmpty();
    }
  });

  return (
    <div className={classes.root}>
      <Formik
        initialValues={{ title: post?.title ?? "" }}
        onSubmit={(values, { resetForm }) => {
          const raw = convertToRaw(editorState.getCurrentContent());
          onSubmit(JSON.stringify(raw), values.title);
        }}
      >
        {({ setFieldTouched, handleChange, handleSubmit, values }) => {
          const change = (name: string, e: any) => {
            e.persist();
            handleChange(e);
            setFieldTouched(name, true, false);
          };
          return (
            <form onSubmit={handleSubmit}>
              <TextField
                className={classes.title}
                placeholder="Post title"
                variant="outlined"
                label="Title"
                name="title"
                onChange={change.bind(null, "title")}
                value={values.title}
              />

              <Divider />
              <Editor
                toolbar={{
                  image: {
                    uploadEnabled: true,
                    alignmentEnabled: true,
                    previewImage: true,
                    uploadCallback: onPictureUpload,
                  },
                }}
                editorState={editorState}
                wrapperClassName="postFormTextEditorWrapper"
                editorClassName="postFormTextEditor"
                onEditorStateChange={setEditorState}
              />
              <Button type="submit">Submit</Button>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default PostForm;
