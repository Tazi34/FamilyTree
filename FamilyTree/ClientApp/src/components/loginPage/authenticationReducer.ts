import { AuthenticateGmailResponse } from "./API/authenticateGmail";
import {
  createAction,
  createAsyncThunk,
  createDraftSafeSelector,
  createReducer,
} from "@reduxjs/toolkit";
import Axios, { AxiosResponse } from "axios";
import { addThunkWithStatusHandlers } from "../../helpers/helpers";
import { ApplicationState } from "../../helpers/index";
import {
  AUTHENTICATION_API_URL,
  LOGIN_API_URL,
} from "./../../helpers/apiHelpers";
import { StatusState } from "./../../helpers/helpers";
import { AuthenticateTokenResponse } from "./API/authenticateToken";
import authenticationAPI from "./API/authenticationAPI";
import {
  CreateUserRequestData,
  CreateUserSuccessResponse,
} from "./API/createUser";
import {
  LoginUserRequestData,
  LoginUserResponseSuccessData,
} from "./API/loginUser";
import {
  addAuthorizationToken,
  removeAuthorizationToken,
} from "./tokenService";

export type AuthenticationState = {
  isLoggedIn: boolean;
  user: User | null;
  status: StatusState;
};

export type User = {
  id: number;
  email: string;
  role: string;
  name: string;
  surname: string;
  token: string;
  previousSurnames: string[];
};
export const userActionsPrefix = "users";
//ACTIONS
export const createUser = createAsyncThunk(
  "users/createUser",
  async (
    registrationData: CreateUserRequestData,
    tunkAPI
  ): Promise<AxiosResponse> => {
    return await Axios.post(AUTHENTICATION_API_URL, registrationData);
  }
);

export const loginUser = createAsyncThunk(
  "users/loginUser",
  async (loginData: LoginUserRequestData): Promise<AxiosResponse> => {
    //TODO zmienic na logowanie do zdeployowanego backendu
    return await Axios.get(
      `${LOGIN_API_URL}/${loginData.email}/${loginData.password}`
      //`${baseURL}/login`,
    );
  }
);
export const authenticateToken = createAsyncThunk<
  AxiosResponse<AuthenticateTokenResponse>,
  string
>(`${userActionsPrefix}/authenticateToken`, async (token) => {
  return await authenticationAPI.requestAuthenticateToken({ token });
});
export const authenticateGmailToken = createAsyncThunk<
  AxiosResponse<AuthenticateGmailResponse>,
  string
>(`${userActionsPrefix}/authenticateGmailToken`, async (token) => {
  return await authenticationAPI.requestAuthenticateGmail({ idToken: token });
});
export const logoutUser = createAction("users/userLoggedOut");

//REDUCER
export const authenticationInitialState: AuthenticationState = {
  isLoggedIn: false,
  user: null,
  status: {
    error: null,
    loading: false,
  },
};
export const authenticationReducer = createReducer(
  authenticationInitialState,
  (builder) => {
    builder
      .addCase(createUser.pending, (state: AuthenticationState, action) => {
        state.isLoggedIn = false;
        state.user = null;
        removeAuthorizationToken();
      })
      .addCase(createUser.fulfilled, (state: AuthenticationState, action) => {
        const userData: CreateUserSuccessResponse = action.payload.data;
        state.isLoggedIn = true;
        state.user = {
          email: userData.email,
          id: userData.userId,
          name: userData.name,
          surname: userData.surname,
          role: userData.role,
          token: userData.token,
          previousSurnames: userData.previousSurnames,
        };
        addAuthorizationToken(userData.token);
      });
    addThunkWithStatusHandlers(
      builder,
      authenticateGmailToken,
      (state: AuthenticationState, action: any) => {
        const userData = action.payload.data;
        setUserLoggedIn(userData, state);
      },
      undefined,
      (state: AuthenticationState, action: any) => {
        state.isLoggedIn = false;
        state.user = null;
        removeAuthorizationToken();
      }
    );
    addThunkWithStatusHandlers(
      builder,
      loginUser,
      (state: AuthenticationState, action: any) => {
        const userData: LoginUserResponseSuccessData = action.payload.data;
        setUserLoggedIn(userData, state);
      },
      undefined,
      (state: AuthenticationState, action: any) => {
        state.isLoggedIn = false;
        state.user = null;
        removeAuthorizationToken();
      }
    );

    addThunkWithStatusHandlers(
      builder,
      authenticateToken,
      (state: AuthenticationState, action: any) => {
        const userData: AuthenticateTokenResponse = action.payload.data;
        setUserLoggedIn(userData, state);
      },
      undefined,
      (state: AuthenticationState, action: any) => {
        state.isLoggedIn = false;
        state.user = null;
        removeAuthorizationToken();
      }
    );
  }
);

//selectors
export const selectSelf = (state: ApplicationState) => state;

export const getUser = createDraftSafeSelector(
  selectSelf,
  (state) => state.authentication.user
);
export const isLoggedIn = createDraftSafeSelector(
  selectSelf,
  (state) => state.authentication.user != null
);
const setUserLoggedIn = (
  userData: LoginUserResponseSuccessData,
  state: AuthenticationState
) => {
  addAuthorizationToken(userData.token);

  state.isLoggedIn = true;
  state.user = {
    email: userData.email,
    id: userData.userId,
    name: userData.name,
    surname: userData.surname,
    role: userData.role,
    token: userData.token,
    previousSurnames: userData.previousSurnames,
  };
};
