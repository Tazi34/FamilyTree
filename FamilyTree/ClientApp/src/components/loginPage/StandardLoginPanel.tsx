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
import { theme } from "../../App";

interface State {
  password: string;
  showPassword: boolean;
  rememberUser: boolean;
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

const StandardLoginPanel = (props: any) => {
  const [values, setValues] = React.useState({
    password: "",
    showPassword: false,
    rememberUser: false,
  });
  const handleChange = (prop: keyof State) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const classes = useStyles();
  return (
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
          <TextField id="email-login-input" label="Email" fullWidth />
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
          <TextField
            id="password-login-input"
            label="Password"
            type={values.showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
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
                  checked={values.rememberUser}
                  icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                  checkedIcon={<CheckBoxIcon fontSize="small" />}
                  onChange={() => {
                    setValues({
                      ...values,
                      rememberUser: !values.rememberUser,
                    });
                  }}
                />
              }
              label="Remember me"
            />
            <Typography color="primary">Register</Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Button variant="contained" color="primary">
            LOGIN
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StandardLoginPanel;
