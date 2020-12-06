import {
  addAuthorizationToken,
  removeAuthorizationToken,
} from "./tokenService";
import { ApplicationState } from "../../helpers/index";
import { authenticationURL, baseURL } from "./../../helpers/apiHelpers";
import jwt_decode from "jwt-decode";
import {
  createAction,
  createAsyncThunk,
  createDraftSafeSelector,
  createReducer,
} from "@reduxjs/toolkit";
import Axios, { AxiosResponse } from "axios";
import {
  CreateUserRequestData,
  CreateUserSuccessResponse,
} from "./API/createUser";
import { LoginUserRequestData } from "./API/loginUser";

export type AuthenticationState = {
  isLoggedIn: boolean;
  user: User | null;
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
    return await Axios.post(authenticationURL, registrationData);
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
const initialState: AuthenticationState = {
  isLoggedIn: false,
  user: null,
};
export const authenticationReducer = createReducer(initialState, (builder) => {
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
    .addCase(loginUser.fulfilled, (state: AuthenticationState, action) => {
      const userToken = action.payload.data.accessToken;
      var decoded: any = jwt_decode(userToken);
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
    })
    .addCase(loginUser.rejected, (state: AuthenticationState, action) => {
      state.isLoggedIn = false;
      state.user = null;
      removeAuthorizationToken();
    })
    .addCase(logoutUser, (state) => {
      state.user = null;
      state.isLoggedIn = false;
      removeAuthorizationToken();
    });
});

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
