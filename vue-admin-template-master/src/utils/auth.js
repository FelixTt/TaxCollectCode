import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 如上，对id管理
export function getID() {
  return Cookies.get('userID')
}

export function setID(ID) {
  return Cookies.set('userID', ID)
}

export function removeID() {
  return Cookies.remove('userID')
}
// 如上，对roles管理
export function getRoles() {
  return Cookies.get('roles')
}

export function setRoles(ID) {
  return Cookies.set('roles', ID)
}

export function removeRoles() {
  return Cookies.remove('roles')
}

// 如上，对用户名管理
export function getUserName() {
  return Cookies.get('userName')
}

export function setUserName(userName) {
  return Cookies.set('userName', userName)
}

export function removeUserName() {
  return Cookies.remove('userName')
}