import { IconButton, InputAdornment, TextField } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import * as React from "react";

const PasswordField = (props: any) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <TextField
      {...props}
      fullWidth
      type={showPassword ? "text" : "password"}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              edge="start"
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default PasswordField;
