import axios from "axios";
import { URL_API } from '../config/url';

export const LOGIN_URL = "auth/login";
export const REGISTER_URL = "api/auth/register";
export const REQUEST_PASSWORD_URL = "api/auth/forgot-password";
export const FORGOT_PASSWORD_URL = "auth/forgotPassword"
export const CONFIRM_FORGOT_PASSWORD = "auth/confirmForgotPassword"

export const ME_URL = "user/userInfo";

export function login(email, password) {
  return axios.post(URL_API + LOGIN_URL, { email: email, password });
}
export function forgotPassword(email, hostFront) {
  return axios.post(URL_API + FORGOT_PASSWORD_URL, { email, hostFront });
}

export function confirmForgotPassword(email, strConfirm, newPassword) {
  return axios.post(URL_API + CONFIRM_FORGOT_PASSWORD, { email, strConfirm, newPassword });
}

export function register(email, fullname, username, password) {
  return axios.post(URL_API + REGISTER_URL, { email, fullname, username, password });
}

export function requestPassword(email) {
  return axios.post(URL_API + REQUEST_PASSWORD_URL, { email });
}

export function getUserByToken(token) {
  return axios.get(URL_API + ME_URL + '?token=' + token);
}
