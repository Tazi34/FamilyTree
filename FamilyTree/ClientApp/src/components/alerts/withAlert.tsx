import React, { Component, useState } from "react";
import { AlertMessage } from "./AlertMessage";
export type WithAlert = {
  alertInfo: (message: string) => {};
  alertSuccess: (message: string) => {};
  alertError: (message: string) => {};
};
export function withAlertMessage(WrappedComponent: any) {
  return (props: any) => {
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("");
    const [open, setOpen] = useState(false);

    const alertMessage = (message: string, severity: any) => {
      setMessage(message);
      setSeverity(severity);
      setOpen(true);
    };

    const alertSuccess = (message: string) => {
      alertMessage(message, "success");
    };
    const alertError = (message: string) => {
      alertMessage(message, "error");
    };
    const alertInfo = (message: string) => {
      alertMessage(message, "info");
    };

    return (
      <>
        <WrappedComponent
          alertInfo={alertInfo}
          alertError={alertError}
          alertSuccess={alertSuccess}
          {...props}
        />
        <AlertMessage
          severity={severity}
          message={message}
          open={open}
          onClose={() => setOpen(false)}
        ></AlertMessage>
      </>
    );
  };
}
