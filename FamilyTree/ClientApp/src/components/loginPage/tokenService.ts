import Axios from "axios";

const authorizationHeader = "Authorization";
export const tokenLocalStorageKey = "userToken";
export const rememberUserLocalStorageKey = "rememberUser";

const appendAuthorizationTokenToRequests = (token: string) => {
  Axios.defaults.headers.common[authorizationHeader] = `Bearer ${token}`;
};
const removeTokenFromRequestHeaders = () => {
  Axios.defaults.headers.common[authorizationHeader] = ``;
};

const addTokenToLocalStorage = (token: string) => {
  localStorage.setItem(tokenLocalStorageKey, token);
  window.sessionStorage.setItem(tokenLocalStorageKey, token);
};

const removeTokenFromLocalStorage = () => {
  localStorage.removeItem(tokenLocalStorageKey);
  localStorage.removeItem(rememberUserLocalStorageKey);
  window.sessionStorage.removeItem(tokenLocalStorageKey);
};

export const addAuthorizationToken = (token: string) => {
  appendAuthorizationTokenToRequests(token);
  addTokenToLocalStorage(token);
};

export const removeAuthorizationToken = () => {
  removeTokenFromLocalStorage();
  removeTokenFromRequestHeaders();
};
