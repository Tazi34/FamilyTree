import {
  Button,
  CardHeader,
  Divider,
  makeStyles,
  TextField,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import axios from "axios";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import { Formik } from "formik";
import * as React from "react";
import { Editor } from "react-draft-wysiwyg";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { baseURL } from "../../helpers/apiHelpers";
import { Post } from "../../model/Post";
import createPostValidation from "../blog/validation/createPostValidation";
import ErrorValidationWrapper from "../UI/ErrorValidationWrapper";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    margin: "0 auto",
    padding: 30,
    minHeight: "100%",

    background: theme.palette.background.paper,
  },
  title: {
    minWidth: 300,
    marginBottom: 10,
  },
  submitButton: {
    marginTop: 5,
  },
}));

type Props = {
  post?: Post;
  onSubmit: (content: string, title: string) => void;
};
const PostForm = ({ post, onSubmit }: Props) => {
  const classes = useStyles();

  const [editorState, setEditorState] = React.useState(() => {
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
  const onPictureUpload = (file: any) => {
    const form = new FormData();
    form.append("picture", file);
    return axios.post(baseURL + "/blog/picture", form).then((resp: any) => {
      if (resp.status === 200) {
        return {
          data: {
            link: resp.data.pictureUrl,
          },
        };
      }
    });
  };

  return (
    <div className={classes.root}>
      <Formik
        initialValues={{ title: post?.title ?? "" }}
        validationSchema={createPostValidation}
        onSubmit={(values, { resetForm }) => {
          const raw = convertToRaw(editorState.getCurrentContent());
          onSubmit(JSON.stringify(raw), values.title);
        }}
      >
        {({
          setFieldTouched,
          handleChange,
          handleSubmit,
          errors,
          touched,
          values,
        }) => {
          const change = (name: string, e: any) => {
            e.persist();
            handleChange(e);
            setFieldTouched(name, true, false);
          };
          return (
            <form onSubmit={handleSubmit}>
              <CardHeader variant="h6">Create post</CardHeader>
              <ErrorValidationWrapper
                error={errors.title}
                touched={touched.title}
              >
                <TextField
                  className={classes.title}
                  placeholder="Post title"
                  variant="outlined"
                  label="Post title"
                  name="title"
                  onChange={change.bind(null, "title")}
                  value={values.title}
                />
              </ErrorValidationWrapper>

              <Divider />
              <Editor
                wrapperStyle={{ border: "1px solid #E8E8E8" }}
                toolbarStyle={{ border: "1px solid #E8E8E8" }}
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
              <Button
                className={classes.submitButton}
                type="submit"
                color="primary"
                variant="contained"
              >
                Submit
              </Button>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default PostForm;
