import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  makeStyles,
  TextField,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { AccountCircle } from "@material-ui/icons";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import { Formik } from "formik";
import * as React from "react";
import ErrorValidationWrapper from "../../UI/ErrorValidationWrapper";
import PasswordField from "./PasswordField";
import loginValidationSchema from "./validation/loginValidationSchema";

interface Props {
  onLoginUser: Function;
  onRemember: (remember: boolean) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: "5px 10px",
    width: "100%",
  },
  emailInput: {
    flex: 1,
  },
  inputRow: {
    marginBottom: 10,
  },
  loginButton: {
    borderRadius: 0,
  },
}));

const LoginForm = ({ onLoginUser, onRemember }: Props) => {
  const [formState, setFormState] = React.useState({
    rememberUser: false,
  });

  const classes = useStyles();
  return (
    <Formik
      onSubmit={(values, { setSubmitting }) => {
        onLoginUser(values);
        values.password = "";

        setTimeout(() => {
          setSubmitting(false);
        }, 1000);
      }}
      validationSchema={loginValidationSchema}
      initialValues={{ email: "", password: "" }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
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
          <form onSubmit={handleSubmit} className={classes.root}>
            <Box display="flex" flexDirection="column">
              <Grid
                container
                spacing={1}
                alignItems="flex-end"
                className={classes.inputRow}
              >
                <Grid item>
                  <AccountCircle />
                </Grid>
                <Grid item className={classes.emailInput}>
                  <ErrorValidationWrapper
                    error={errors.email}
                    touched={touched.email}
                  >
                    <TextField
                      autoComplete="email"
                      name="email"
                      label="Email"
                      value={values.email}
                      fullWidth
                      onChange={change.bind(null, "email")}
                    />
                  </ErrorValidationWrapper>
                </Grid>
              </Grid>
              <Grid
                container
                spacing={1}
                alignItems="flex-end"
                className={classes.inputRow}
              >
                <Grid item>
                  <LockOpenIcon />
                </Grid>
                <Grid item>
                  <ErrorValidationWrapper
                    error={errors.password}
                    touched={touched.password}
                  >
                    <PasswordField
                      autoComplete="current-password"
                      name="password"
                      value={values.password}
                      label="Password"
                      onChange={change.bind(null, "password")}
                    />
                  </ErrorValidationWrapper>
                </Grid>
              </Grid>
              <Grid container alignItems="center">
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="default"
                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                        onChange={(e, checked) => {
                          onRemember(checked);
                        }}
                      />
                    }
                    label="Remember me"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    disabled={isSubmitting}
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                    className={classes.loginButton}
                  >
                    LOGIN
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </form>
        );
      }}
    </Formik>
  );
};

export default LoginForm;
