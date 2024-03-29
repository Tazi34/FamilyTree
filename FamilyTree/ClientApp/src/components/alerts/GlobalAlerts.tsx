import * as React from "react";
import { useSelector } from "react-redux";
import { selectAlerts } from "./reducer/alertsReducer";
import { withAlertMessage } from "./withAlert";

const GlobalAlerts = (props: any) => {
  const alerts = useSelector(selectAlerts);

  React.useEffect(() => {
    if (alerts.length > 0) {
      const currentAlert = alerts[alerts.length - 1];
      props.alert(currentAlert.message, currentAlert.type);
    }
  }, [alerts]);

  return <div>{props.children}</div>;
};

export default React.memo(withAlertMessage(GlobalAlerts), () => true);
