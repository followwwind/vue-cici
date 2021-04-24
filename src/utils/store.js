import Cookies from 'js-cookie'

const TokenKey = 'X-API-TOKEN'
const SysUser = 'SysUser'
const FrontUser = 'FrontUser'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUser() {
  var user = localStorage.getItem(SysUser)
  if(user){
    return JSON.parse(user);
  }
  return user;
}

export function setUser(user) {
  return localStorage.setItem(SysUser, JSON.stringify(user));
}

export function removeUser() {
  return localStorage.removeItem(SysUser)
}

export function getFrontUser() {
  var user = localStorage.getItem(FrontUser)
  if(user){
    return JSON.parse(user);
  }
  return user;
}

export function setFrontUser(user) {
  return localStorage.setItem(FrontUser, JSON.stringify(user));
}

export function removeFrontUser() {
  return localStorage.removeItem(FrontUser)
}

export function setLocalStorage(key, value) {
  return localStorage.setItem(key, value);
}
export function getLocalStorage(key) {
  return localStorage.getItem(key);
}
export function removeLocalStorage(key) {
  return localStorage.removeItem(key);
}
