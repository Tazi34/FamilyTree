import "bootstrap/dist/css/bootstrap.css";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider, useDispatch } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import configureStore from "./helpers/configureStore";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import "./index.css";
import { loginUser } from "./components/loginPage/authenticationReducer";
import { LoginUserRequestData } from "./components/loginPage/API/loginUser";
import { loginData } from "./components/tree/helpers/loginData";
// Create browser history to use in the Redux store
const baseUrl = document
  .getElementsByTagName("base")[0]
  .getAttribute("href") as string;
const history = createBrowserHistory({ basename: baseUrl });

// Get the application-wide store instance, prepopulating with state from the server where available.
export const store: any = configureStore(history);
export type AppDispatch = typeof store.dispatch;
export const useThunkDispatch = () => useDispatch<AppDispatch>();

store.dispatch(loginUser(loginData));
ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);

registerServiceWorker();
