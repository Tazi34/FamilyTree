import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { Formik } from "formik";
import React from "react";
import { WithAlert, withAlertMessage } from "../alerts/withAlert";
import PasswordField from "../loginPage/UI/PasswordField";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "600px",
    margin: "auto",
    padding: "10px 30px 30px 30px",
    marginTop: 60,
  },
  button: {
    marginTop: "20px",
    marginBottom: "10px",
  },
}));

export type UserRegistrationData = {
  name: string;
  surname: string;
  email: string;
  password: string;
  birthday: string;
  previousSurnames: string[];
  sex: "Male" | "Female" | "Not Sure";
};

const initialData = {
  name: "",
  surname: "",
  email: "",
  password: "",
  birthday: new Date(),
  previousSurnames: [],
};

type Props = {
  onRegister: Function;
} & WithAlert;

const RegistrationForm = ({ onRegister, alertSuccess, alertError }: Props) => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Formik
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            const registerData: UserRegistrationData = {
              ...values,
              birthday: values.birthday.toISOString(),
              sex: "Male",
            };
            onRegister(registerData);
            setSubmitting(false);
          }, 400);
        }}
        initialValues={initialData}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          isSubmitting,
          setFieldTouched,
          /* and other goodies */
        }) => {
          const change = (name: string, e: any) => {
            e.persist();
            handleChange(e);
            setFieldTouched(name, true, false);
          };
          return (
            <form onSubmit={handleSubmit}>
              <Typography align={"center"} variant={"h5"} color={"primary"}>
                SIGN UP
              </Typography>
              <TextField
                autoComplete={"given-name"}
                fullWidth
                label="Name"
                name={"name"}
                onChange={change.bind(null, "name")}
              />
              <TextField
                autoComplete={"family-name"}
                fullWidth
                label="Surname"
                name={"surname"}
                onChange={change.bind(null, "surname")}
              />
              <TextField
                name="email"
                type="email"
                autoComplete={"username"}
                fullWidth
                label="Email"
                onChange={change.bind(null, "email")}
              />
              <KeyboardDatePicker
                fullWidth
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                name="birthday"
                label="Birthday"
                value={values.birthday}
                onChange={(_, value) => {
                  setFieldValue("birthday", value);
                }}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
              <PasswordField
                onChange={change.bind(null, "password")}
                autoComplete="new-password"
                fullWidth
                label="Password"
                name={"password"}
              />

              <PasswordField
                onChange={change.bind(null, "confirmPassword")}
                autoComplete={"new-password"}
                fullWidth
                label="Confirm password"
                name={"confirmPassword"}
              />
              <Button
                variant={"contained"}
                color={"primary"}
                fullWidth
                type="submit"
                className={classes.button}
              >
                SUBMIT
              </Button>
            </form>
          );
        }}
      </Formik>
    </Paper>
  );
};

export default withAlertMessage(RegistrationForm);
