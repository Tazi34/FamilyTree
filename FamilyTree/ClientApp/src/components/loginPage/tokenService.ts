import Axios from "axios";

const authorizationHeader = "Token";
const tokenLocalStorageKey = "userToken";

const appendAuthorizationTokenToRequests = (token: string) => {
  Axios.defaults.headers.common[authorizationHeader] = `${token}`;
};
const removeTokenFromRequestHeaders = () => {
  Axios.defaults.headers.common[authorizationHeader] = ``;
};

const addTokenToLocalStorage = (token: string) => {
  localStorage.setItem(tokenLocalStorageKey, token);
};

const removeTokenFromLocalStorage = () => {
  localStorage.removeItem(tokenLocalStorageKey);
};

export const addAuthorizationToken = (token: string) => {
  appendAuthorizationTokenToRequests(token);
  addTokenToLocalStorage(token);
};

export const removeAuthorizationToken = () => {
  removeTokenFromLocalStorage();
  removeTokenFromRequestHeaders();
};
