import { Button, makeStyles, Paper, TextField } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { Formik } from "formik";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Sex } from "../../model/Sex";
import {
  authenticateToken,
  getUser,
  User,
} from "../loginPage/authenticationReducer";
import userProfileAPI from "./API/userProfileAPI";

const useStyles = makeStyles((theme: Theme) => ({
  profileEditorRoot: {
    width: "100%",
    height: "100%",
  },
}));

type FormData = {
  name: string;
  surname: string;
  email: string;
  birthday: string;
  previousSurnames: string[];
  sex: Sex;
};

const UserProfileContainer = (props: any) => {
  const classes = useStyles();
  const user = useSelector(getUser) as User;
  const dispatch = useDispatch();

  const handleProfileEdit = (data: FormData) => {
    const userToken = user.token;
    const requestData = { ...data, userId: user.id };
    userProfileAPI
      .requestEditProfile(requestData)
      .then(() => {
        props.onSuccess("Profile edited");
        dispatch(authenticateToken(userToken));
      })
      .catch((err: any) => {
        props.onError("Error editing your profile. Try again later");
      });
  };

  return (
    <Paper className={classes.profileEditorRoot}>
      <Formik
        initialValues={{
          name: user.name,
          surname: user.surname,
          birthday: "2001-05-25",
          email: user.email,
          previousSurnames: [],
          sex: "Male",
        }}
        onSubmit={(values: FormData) => {
          handleProfileEdit(values);
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
                InputProps={{
                  readOnly: true,
                }}
                value={user.email}
                fullWidth
              />
              <TextField
                name="name"
                value={values.name}
                fullWidth
                onChange={change.bind(null, "name")}
              />
              <TextField
                name="surname"
                value={values.surname}
                fullWidth
                onChange={change.bind(null, "surname")}
              />
              <Button type="submit">Submit</Button>
            </form>
          );
        }}
      </Formik>
    </Paper>
  );
};

export default UserProfileContainer;
