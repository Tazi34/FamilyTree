import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { parse } from "date-fns";
import { Formik } from "formik";
import React from "react";
import { Sex } from "../../model/Sex";
import PasswordField from "../loginPage/UI/PasswordField";
import ErrorValidationWrapper from "../UI/ErrorValidationWrapper";
import registrationValidationSchema from "./validation/registrationValidationSchema.ts";

const useStyles = makeStyles((theme) => ({
  main: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  root: {
    [theme.breakpoints.down("xl")]: {
      minWidth: 500,
    },
    [theme.breakpoints.down("md")]: {
      minWidth: 400,
    },
    [theme.breakpoints.down("sm")]: {
      minWidth: 300,
    },
    [theme.breakpoints.down("xs")]: {
      minWidth: 300,
    },
    margin: "auto",
    padding: "10px 30px 30px 30px",
  },
  button: {
    marginTop: "20px",
    marginBottom: "10px",
  },
  formField: {
    marginBottom: 10,
  },
}));

export type UserRegistrationData = {
  name: string;
  surname: string;
  email: string;
  password: string;
  birthday: string;
  maidenName: string;
  sex: Sex;
};

const initialData = {
  name: "",
  surname: "",
  email: "",
  password: "",
  confirmPassword: "",
  birthday: new Date(),
  maidenName: "",
};

type Props = {
  onRegister: Function;
};

const RegistrationForm = ({ onRegister }: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.main}>
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
          validationSchema={registrationValidationSchema}
          initialValues={initialData}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
            setFieldValue,
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
                <ErrorValidationWrapper
                  error={errors.name}
                  touched={touched.name}
                >
                  <TextField
                    className={classes.formField}
                    autoComplete={"given-name"}
                    fullWidth
                    label="Name"
                    name={"name"}
                    onChange={change.bind(null, "name")}
                  />
                </ErrorValidationWrapper>
                <ErrorValidationWrapper
                  error={errors.surname}
                  touched={touched.surname}
                >
                  <TextField
                    className={classes.formField}
                    autoComplete={"family-name"}
                    fullWidth
                    label="Surname"
                    name={"surname"}
                    onChange={change.bind(null, "surname")}
                  />
                </ErrorValidationWrapper>
                <ErrorValidationWrapper
                  error={errors.maidenName}
                  touched={touched.maidenName}
                >
                  <TextField
                    className={classes.formField}
                    fullWidth
                    label="Maiden name"
                    name={"maidenName"}
                    onChange={change.bind(null, "maidenName")}
                  />
                </ErrorValidationWrapper>
                <ErrorValidationWrapper
                  error={errors.email}
                  touched={touched.email}
                >
                  <TextField
                    className={classes.formField}
                    name="email"
                    type="email"
                    autoComplete={"username"}
                    fullWidth
                    label="Email"
                    onChange={change.bind(null, "email")}
                  />
                </ErrorValidationWrapper>
                <ErrorValidationWrapper
                  error={errors.birthday}
                  touched={touched.birthday}
                >
                  <KeyboardDatePicker
                    className={classes.formField}
                    label="Birthday"
                    name="birthday"
                    fullWidth
                    disableToolbar
                    autoOk
                    maxDate={new Date()}
                    variant="inline"
                    format="dd.MM.yyyy"
                    value={values.birthday}
                    onChange={(_, value) => {
                      var date = parse(
                        value as string,
                        "dd.MM.yyyy",
                        new Date()
                      );

                      setFieldValue("birthday", date);
                    }}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </ErrorValidationWrapper>
                <ErrorValidationWrapper
                  error={errors.password}
                  touched={touched.password}
                >
                  <PasswordField
                    className={classes.formField}
                    onChange={change.bind(null, "password")}
                    autoComplete="new-password"
                    fullWidth
                    label="Password"
                    name={"password"}
                  />
                </ErrorValidationWrapper>
                <ErrorValidationWrapper
                  error={errors.confirmPassword}
                  touched={touched.confirmPassword}
                >
                  <PasswordField
                    className={classes.formField}
                    onChange={change.bind(null, "confirmPassword")}
                    autoComplete={"new-password"}
                    fullWidth
                    label="Confirm password"
                    name={"confirmPassword"}
                  />
                </ErrorValidationWrapper>
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
    </div>
  );
};

export default RegistrationForm;
