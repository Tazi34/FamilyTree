import {
  Avatar,
  Button,
  Dialog,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { parse } from "date-fns";
import { Formik } from "formik";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "../../helpers/formatters";
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
    padding: 40,
  },
  title: {
    marginBottom: 15,
  },
  profilePreview: {
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
  pictureContainer: {
    marginRight: 30,
    height: 100,
    width: 100,
  },
  picture: {
    height: "100%",
  },
  previewContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  formContainer: {
    marginTop: 50,
  },
  submitButton: {
    marginRight: 8,
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

const UserProfileDialog = (props: any) => {
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
  const displayDate = formatDate(user.birthday);
  const nameText = `${user.name} ${user.surname}`;
  return (
    <Dialog onClose={props.onClose} open={props.open}>
      <Paper className={classes.profileEditorRoot}>
        <Typography variant="h4" align="center" className={classes.title}>
          User profile
        </Typography>
        <div className={classes.profilePreview}>
          <Avatar
            className={classes.pictureContainer}
            alt={nameText}
            sizes={"(min-width: 40em) 80vw, 100vw"}
            src={user.pictureUrl}
          />

          <div className={classes.previewContent}>
            <div>
              <Typography variant="h5">{nameText}</Typography>
              <Typography variant="body1">{displayDate}</Typography>
            </div>
          </div>
        </div>
        <div className={classes.formContainer}>
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
            {({
              setFieldValue,
              setFieldTouched,
              handleChange,
              handleSubmit,
              values,
            }) => {
              const change = (name: string, e: any) => {
                e.persist();
                handleChange(e);
                setFieldTouched(name, true, false);
              };
              return (
                <form onSubmit={handleSubmit}>
                  <Grid container direction="row" spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        variant="outlined"
                        label="Name"
                        name="name"
                        value={values.name}
                        fullWidth
                        onChange={change.bind(null, "name")}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        variant="outlined"
                        label="Surname"
                        name="surname"
                        value={values.surname}
                        fullWidth
                        onChange={change.bind(null, "surname")}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        variant="outlined"
                        label="Email"
                        InputProps={{
                          readOnly: true,
                        }}
                        value={user.email}
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <KeyboardDatePicker
                        label="Birthday"
                        name="birthday"
                        disableToolbar
                        variant="inline"
                        inputVariant="outlined"
                        autoOk
                        format="dd.MM.yyyy"
                        fullWidth
                        value={values.birthday}
                        onChange={(_, value) => {
                          var date = parse(
                            value as string,
                            "dd.MM.yyyy",
                            new Date()
                          );

                          setFieldValue("birthday", date);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        label="Gender"
                        value={values.sex}
                        name="sex"
                        select
                        fullWidth
                        SelectProps={{
                          MenuProps: {
                            anchorOrigin: {
                              vertical: "bottom",
                              horizontal: "left",
                            },
                            getContentAnchorEl: null,
                          },
                        }}
                        onChange={change.bind(null, "sex")}
                      >
                        <MenuItem value={"Male"}>Male</MenuItem>
                        <MenuItem value={"Female"}>Female</MenuItem>
                        <MenuItem value={"NotSure"}>Other</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                      >
                        Submit
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        onClick={props.onClose}
                      >
                        Back
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              );
            }}
          </Formik>
        </div>
      </Paper>
    </Dialog>
  );
};

export default React.memo(UserProfileDialog);
