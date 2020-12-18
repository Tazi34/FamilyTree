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

  const rootReducer = combineReducers({
    ...reducers,
    router: connectRouter(history),
  });

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
