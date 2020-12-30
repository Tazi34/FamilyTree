import { connectRouter, routerMiddleware } from "connected-react-router";
import { History } from "history";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import logger from "redux-logger";
import { persistStore } from "redux-persist";
import thunk from "redux-thunk";
import { ApplicationState, reducers } from ".";
import { removeAuthorizationToken } from "../components/loginPage/tokenService";
import { signalRMiddleware } from "./../components/chat/reducer/signalRMiddleware";
import { logoutUser } from "./../components/loginPage/authenticationReducer";
import { initialAppState, reducersToPersis } from "./index";

export default function configureStore(
  history: History,
  initialState?: ApplicationState
) {
  const middleware = [thunk, routerMiddleware(history), signalRMiddleware];

  if (process.env.NODE_ENV === "development") {
    middleware.push(logger);
    console.log(process.env);
  }

  for (const key in reducersToPersis) {
    if (Object.prototype.hasOwnProperty.call(reducersToPersis, key)) {
      // const persistConfig = {
      //   key: key.toString(),
      //   storage,
      // };
      // const persistedReducer = persistReducer(
      //   persistConfig,
      //   reducersToPersis[key]
      // );
      // reducers[key] = persistedReducer;
      reducers[key] = reducersToPersis[key];
    }
  }

  const appReducer = combineReducers({
    ...reducers,
    router: connectRouter(history),
  });

  const rootReducer = (state: any, action: any) => {
    if (action.type == logoutUser.toString()) {
      removeAuthorizationToken();
      return {
        ...initialAppState,
        router: state.router,
      };
    }
    return appReducer(state, action);
  };

  const enhancers = [];
  const windowIfDefined =
    typeof window === "undefined" ? null : (window as any);
  if (windowIfDefined && windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__) {
    enhancers.push(windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__());
  }
  const store = createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...middleware), ...enhancers)
  );
  const persistor = persistStore(store);

  return { store, persistor };
}
