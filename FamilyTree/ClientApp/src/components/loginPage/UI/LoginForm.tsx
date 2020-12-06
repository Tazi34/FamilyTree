import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { Theme } from "@material-ui/core/styles";
import { AccountCircle, Visibility, VisibilityOff } from "@material-ui/icons";
import * as React from "react";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import { loginData } from "../../tree/treeLogic/loginData";
import { Formik } from "formik";
import PasswordField from "./PasswordField";
import { TypographyLink } from "../../navigation/TypographyLink";
import { REGISTER_PAGE_URI } from "../../../applicationRouting";

interface State {
  password: string;
  showPassword: boolean;
  rememberUser: boolean;
}

interface Props {
  onLoginUser: Function;
  onRegisterUser: Function;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: { padding: "5px 10px" },
  emailInput: {
    flex: 1,
  },
  inputRow: {
    marginBottom: 10,
  },
}));

const LoginForm = ({ onLoginUser }: Props) => {
  const [formState, setFormState] = React.useState({
    rememberUser: false,
  });

  const classes = useStyles();
  return (
    <Formik
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          onLoginUser(values);

          setSubmitting(false);
        }, 400);
      }}
      initialValues={{ email: "", password: "" }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
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
          <form onSubmit={handleSubmit}>
            <Box
              display="flex"
              flexDirection="column"
              className={classes.root}
              border={1}
              borderColor={"primary.main"}
              borderRadius={7}
            >
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
                  <TextField
                    autoComplete="email"
                    name="email"
                    label="Email"
                    fullWidth
                    onChange={change.bind(null, "email")}
                  />
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
                  <PasswordField
                    autoComplete="current-password"
                    name="password"
                    label="Password"
                    onChange={change.bind(null, "password")}
                  />
                </Grid>
              </Grid>
              <Grid container alignItems="center">
                <Grid item xs={8}>
                  <Box display="flex" flexDirection="column">
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="default"
                          checked={formState.rememberUser}
                          icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                          checkedIcon={<CheckBoxIcon fontSize="small" />}
                          onChange={() => {
                            setFormState({
                              ...formState,
                              rememberUser: !formState.rememberUser,
                            });
                          }}
                        />
                      }
                      label="Remember me"
                    />
                    <TypographyLink to={REGISTER_PAGE_URI} color="primary">
                      Register
                    </TypographyLink>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Button
                    disabled={isSubmitting}
                    variant="contained"
                    color="primary"
                    type="submit"
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