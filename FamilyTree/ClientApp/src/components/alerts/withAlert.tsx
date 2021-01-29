import React, { useState } from "react";
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

    const alert = (message: string, severity: any) => {
      setMessage(message);
      setSeverity(severity);
      setOpen(true);
    };

    const alertSuccess = (message: string) => {
      alert(message, "success");
    };
    const alertError = (message: string) => {
      alert(message, "error");
    };
    const alertInfo = (message: string) => {
      alert(message, "info");
    };

    return (
      <>
        <WrappedComponent
          alertInfo={alertInfo}
          alertError={alertError}
          alertSuccess={alertSuccess}
          alert={alert}
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
