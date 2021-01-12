import "bootstrap/dist/css/bootstrap.css";
import { ConnectedRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider, useDispatch } from "react-redux";
import App from "./App";
import GlobalAlerts from "./components/alerts/GlobalAlerts";
import { authenticateToken } from "./components/loginPage/authenticationReducer";
import { tokenLocalStorageKey } from "./components/loginPage/tokenService";
import configureStore from "./helpers/configureStore";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";

// Create browser history to use in the Redux store
const baseUrl = document
  .getElementsByTagName("base")[0]
  .getAttribute("href") as string;
const history = createBrowserHistory({ basename: baseUrl });

// Get the application-wide store instance, prepopulating with state from the server where available.
export const { store, persistor } = configureStore(history);
export type AppDispatch = typeof store.dispatch;
export const useThunkDispatch = () => useDispatch<any>();

const token = localStorage.getItem(tokenLocalStorageKey);
if (token) {
  store.dispatch(authenticateToken(token));
}

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>{" "}
  </Provider>,

  document.getElementById("root")
);

registerServiceWorker();
