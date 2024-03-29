import { useThunkDispatch } from "../..";
import { addAlert, Alert } from "./reducer/alertsReducer";

const useAlert = () => {
  const dispatch = useThunkDispatch();
  const alertSuccess = (message: string) => {
    alertAny({ message, type: "success" });
  };
  const alertError = (message: string) => {
    alertAny({ message, type: "error" });
  };
  const alertInfo = (message: string) => {
    alertAny({ message, type: "info" });
  };
  const alertAny = (alert: Alert) => {
    dispatch(addAlert(alert));
  };

  const alert = {
    success: alertSuccess,
    error: alertError,
    info: alertInfo,
  };
  return alert;
};

export default useAlert;
