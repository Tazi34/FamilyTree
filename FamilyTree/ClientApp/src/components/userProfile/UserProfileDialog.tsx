import {
  Avatar,
  Button,
  Dialog,
  Grid,
  IconButton,
  makeStyles,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { parse } from "date-fns";
import { Formik } from "formik";
import * as React from "react";
import { useSelector } from "react-redux";
import { useThunkDispatch } from "../..";
import { formatDate } from "../../helpers/formatters";
import { Sex } from "../../model/Sex";
import useAlert from "../alerts/useAlert";
import { getUser, User } from "../loginPage/authenticationReducer";
import ErrorValidationWrapper from "../UI/ErrorValidationWrapper";
import PicturePickerDialog from "../UI/PicturePickerDialog";
import { editProfile } from "./API/editProfile";
import userProfileAPI from "./API/userProfileAPI";
import editProfileValidationSchema from "./editProfileValidationSchema";
import UserProfilePreview from "./UserProfilePreview";

const imgSize = 100;
const useStyles = makeStyles((theme: Theme) => ({
  profileEditorRoot: {
    width: "100%",
    height: "100%",
    padding: 40,
  },
  editPictureIconContainer: {
    zIndex: 100000,
    position: "absolute",
    right: 5,
    bottom: 5,
    padding: 7,
  },
  editPictureIcon: {
    fontSize: 17,
  },
  title: {
    marginBottom: 15,
  },

  pictureContainer: {
    width: imgSize,
    height: imgSize,
    cursor: "pointer",
    marginRight: 30,
    position: "relative",
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
  maidenName: string;
  sex: Sex;
};

const UserProfileDialog = (props: any) => {
  const user = useSelector(getUser) as User;
  const [pictureDialog, setPictureDialog] = React.useState(false);
  const [picturePreview, setPicturePreview] = React.useState(user.pictureUrl);
  const alert = useAlert();
  const classes = useStyles();

  const dispatch = useThunkDispatch();

  const handleProfileEdit = (data: FormData) => {
    const requestData = { ...data, userId: user.id };

    dispatch(editProfile(requestData)).then((resp: any) => {
      if (!resp.error) {
        alert.success("Profile edited");
        props.onClose();
      } else {
        alert.error("Error editing your profile. Try again later");
      }
    });
  };

  const closePictureDialog = () => {
    setPictureDialog(false);
  };
  const handleProfilePictureUpdate = (data: any) => {
    userProfileAPI
      .requestUploadProfilePicture({ picture: data })
      .then((resp: any) => {
        if (!resp.error) {
          setPicturePreview(resp.data.pictureUrl);
          closePictureDialog();
        } else {
          //TOD
        }
      });
  };
  return (
    <Dialog onClose={props.onClose} open={props.open}>
      <PicturePickerDialog
        open={pictureDialog}
        onClose={closePictureDialog}
        onPickPicture={handleProfilePictureUpdate}
      />
      <Paper className={classes.profileEditorRoot}>
        <Typography variant="h4" align="center" className={classes.title}>
          User profile
        </Typography>
        <UserProfilePreview
          profile={{ ...user, pictureUrl: picturePreview }}
          onClick={() => setPictureDialog(true)}
        />

        <div className={classes.formContainer}>
          <Formik
            initialValues={{
              maidenName: user.maidenName,
              name: user.name,
              surname: user.surname,
              birthday: user.birthday,
              email: user.email,
              sex: "Male",
            }}
            validationSchema={editProfileValidationSchema}
            onSubmit={(values: FormData) => {
              handleProfileEdit(values);
            }}
          >
            {({
              setFieldValue,
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
                  <Grid container direction="row" spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <ErrorValidationWrapper
                        error={errors.name}
                        touched={touched.name}
                      >
                        <TextField
                          variant="outlined"
                          label="Name"
                          name="name"
                          value={values.name}
                          fullWidth
                          onChange={change.bind(null, "name")}
                        />
                      </ErrorValidationWrapper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <ErrorValidationWrapper
                        error={errors.surname}
                        touched={touched.surname}
                      >
                        <TextField
                          variant="outlined"
                          label="Surname"
                          name="surname"
                          value={values.surname}
                          fullWidth
                          onChange={change.bind(null, "surname")}
                        />
                      </ErrorValidationWrapper>
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
                      <ErrorValidationWrapper
                        error={errors.birthday}
                        touched={touched.birthday}
                      >
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
                      </ErrorValidationWrapper>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <ErrorValidationWrapper
                        error={errors.sex}
                        touched={touched.sex}
                      >
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
                      </ErrorValidationWrapper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <ErrorValidationWrapper
                        error={errors.maidenName}
                        touched={touched.maidenName}
                      >
                        <TextField
                          variant="outlined"
                          label="Maiden name"
                          name="maidenName"
                          value={values.maidenName}
                          fullWidth
                          onChange={change.bind(null, "maidenName")}
                        />
                      </ErrorValidationWrapper>
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
