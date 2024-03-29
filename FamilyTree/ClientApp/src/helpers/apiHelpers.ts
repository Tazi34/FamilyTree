export const backendURL = process.env.REACT_APP_BACKEND_API_BASE_URL;
export const baseURL = backendURL; //

export const PROFILE_API_URL = `${baseURL}/editUsers`;
export const TREE_API_URL = `${baseURL}/tree`;
export const CHAT_API_URL = `${baseURL}/chat`;
export const GEDCOME_API_URL = `${baseURL}/gedcom`;

export const INVITATIONS_API_URL = `${baseURL}/invitations`;
export const AUTHENTICATION_API_URL = `${baseURL}/users`;
export const GOOGLE_AUTHENTICATION_API_URL = `${baseURL}/users/google`;
export const FACEBOOK_AUTHENTICATION_API_URL = `${baseURL}/users/facebook`;

export const REGISTER_API_URL = AUTHENTICATION_API_URL;
export const LOGIN_API_URL = `${baseURL}/users`;
export const COMMENTS_API_URL = `${baseURL}/comment`;

export const BLOG_API_URL = `${baseURL}/blog`;
export const SEARCH_API_URL = `${baseURL}/search`;
