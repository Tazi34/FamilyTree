import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { useDispatch } from "react-redux";
import { WithAlert, withAlertMessage } from "../alerts/withAlert";
import { createUser } from "../loginPage/authenticationReducer";
import RegistrationForm, { UserRegistartionData } from "./RegistrationForm";

const useStyles = makeStyles((theme: Theme) => ({}));

const Registration = (props: any) => {
  const classes = useStyles();
  const dispatch: any = useDispatch();

  const handleRegister = (registrationData: UserRegistartionData) => {
    dispatch(createUser(registrationData)).then((data: any) => {
      if (data.error) {
        props.onError("Error occured during account creation. ");
      } else {
        props.onSuccess("Account created.");
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
