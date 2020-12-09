import {
  createAction,
  createAsyncThunk,
  createDraftSafeSelector,
  createReducer,
} from "@reduxjs/toolkit";
import Axios, { AxiosResponse } from "axios";
import jwt_decode from "jwt-decode";
import { addThunkWithStatusHandlers } from "../../helpers/helpers";
import { ApplicationState } from "../../helpers/index";
import { AUTHENTICATION_API_URL, baseURL } from "./../../helpers/apiHelpers";
import { StatusState } from "./../../helpers/helpers";
import {
  CreateUserRequestData,
  CreateUserSuccessResponse,
} from "./API/createUser";
import { LoginUserRequestData } from "./API/loginUser";
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
  email: string | null;
  role: string;
  name: string;
  surname: string;
  token: string | null;
};

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
    console.log(loginData);
    return await Axios.post(
      //`${authenticationURL}/${registrationData.email}/${registrationData.password}`
      `${baseURL}/login`,
      loginData
    );
  }
);

export const logoutUser = createAction("users/userLoggedout");

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
        };
        addAuthorizationToken(userData.token);
      })
      .addCase(logoutUser, (state) => {
        state.user = null;
        state.isLoggedIn = false;
        removeAuthorizationToken();
      });

    addThunkWithStatusHandlers(
      builder,
      loginUser,
      (state: AuthenticationState, action: any) => {
        const userToken = action.payload.data.accessToken;
        var decoded: any = jwt_decode(userToken);
        console.log(decoded);
        var userId = decoded.sub;
        var email = decoded.email;
        addAuthorizationToken(userToken);

        state.isLoggedIn = true;
        state.user = {
          email: email,
          id: userId,
          token: userToken,
          role: "USER",
          name: "Pablo",
          surname: "Picasso",
        };
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
const selectSelf = (state: ApplicationState) => state;

export const getUser = createDraftSafeSelector(
  selectSelf,
  (state) => state.authentication.user
);
export const isLoggedIn = createDraftSafeSelector(
  selectSelf,
  (state) => state.authentication.user != null
);
