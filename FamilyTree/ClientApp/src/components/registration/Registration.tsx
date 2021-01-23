import * as React from "react";
import { useDispatch } from "react-redux";
import useAlert from "../alerts/useAlert";
import { createUser } from "../loginPage/authenticationReducer";
import RegistrationForm, { UserRegistrationData } from "./RegistrationForm";

const Registration = (props: any) => {
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
  return <RegistrationForm onRegister={handleRegister} />;
};

export default Registration;
