import { Button, TextField } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { AnyARecord } from "dns";
import { Formik } from "formik";
import React from "react";
import { formatInitials } from "../../helpers/formatters";
import { User } from "../loginPage/authenticationReducer";

const useStyles = makeStyles((theme: Theme) => ({
  textInput: {},
  container: {
    position: "relative",
    marginBottom: 10,
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginRight: 16,
  },
}));

type Props = {
  user: User;
  onSubmit: (text: string) => any;
};
const CreatePostArea = ({ user, onSubmit }: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Formik
        initialValues={{ text: "" }}
        onSubmit={(values, { resetForm }) => {
          onSubmit(values.text).then((resp: any) => {
            if (!resp.error) {
              resetForm();
            }
          });
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
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar
                    alt={formatInitials(user.name, user.surname)}
                    src={user.pictureUrl}
                  />
                </ListItemAvatar>
                <TextField
                  label="Create comment"
                  multiline
                  name="text"
                  rows={4}
                  placeholder="What's in your mind?"
                  value={values.text}
                  onChange={change.bind(null, "text")}
                  variant="outlined"
                  fullWidth
                  className={classes.textInput}
                />
              </ListItem>
              <div className={classes.buttonContainer}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.button}
                >
                  Submit
                </Button>
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default CreatePostArea;
