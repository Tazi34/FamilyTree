import "bootstrap/dist/css/bootstrap.css";
import { ConnectedRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import {
  addAuthorizationToken,
  tokenLocalStorageKey,
} from "./components/loginPage/tokenService";
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
  addAuthorizationToken(token);
}
//store.dispatch(loginUser(loginData));
ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);

registerServiceWorker();
