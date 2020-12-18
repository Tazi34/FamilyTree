import { initialAppState } from "./index";
import { logoutUser } from "./../components/loginPage/authenticationReducer";
import { signalRMiddleware } from "./../components/chat/reducer/signalRMiddleware";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { History } from "history";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { ApplicationState, reducers } from ".";
import logger from "redux-logger";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/es/storage";
const persistConfig = {
  key: "root",
  storage,
};

export default function configureStore(
  history: History,
  initialState?: ApplicationState
) {
  const middleware = [
    thunk,
    routerMiddleware(history),
    logger,
    signalRMiddleware,
  ];

  const appReducer = combineReducers({
    ...reducers,
    router: connectRouter(history),
  });

  const rootReducer = (state: any, action: any) => {
    if (action.type == logoutUser.toString()) {
      console.log(state.router);
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
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  const store = createStore(
    persistedReducer,
    initialState,
    compose(applyMiddleware(...middleware), ...enhancers)
  );
  const persistor = persistStore(store);

  return { store, persistor };
}
