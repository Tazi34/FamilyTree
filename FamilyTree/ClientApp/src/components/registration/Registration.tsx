import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { useDispatch } from "react-redux";
import useAlert from "../alerts/useAlert";
import { WithAlert, withAlertMessage } from "../alerts/withAlert";
import { createUser } from "../loginPage/authenticationReducer";
import RegistrationForm, { UserRegistrationData } from "./RegistrationForm";

const useStyles = makeStyles((theme: Theme) => ({}));

const Registration = (props: any) => {
  const classes = useStyles();
  const dispatch: any = useDispatch();
  const alert = useAlert();

  const handleRegister = (registrationData: UserRegistrationData) => {
    dispatch(createUser(registrationData)).then((data: any) => {
      if (data.error) {
        if (data.payload.status === 409) {
          alert.error("Email already taken");
        } else {
          alert.error("Error occured during account creation. ");
        }
      } else {
        alert.success("Account created.");
      }
    });
  };
  return (
    <div>
      <RegistrationForm onRegister={handleRegister} />
    </div>
  );
};

export default withAlertMessage(Registration);
