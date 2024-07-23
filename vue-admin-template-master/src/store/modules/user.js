import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, getUserName, setUserName, removeUserName, getID, setID, removeID } from '@/utils/auth'
import { resetRouter } from '@/router'
import store from '..'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: getUserName(),
    avatar: '',
    id: getID(),
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return login({ username: username.trim(), password: password }).then(response => {
      const { data } = response
      if (response && response.data !== null) {
        commit('SET_TOKEN', data.token)
        commit('SET_NAME', data.userData.username)
        commit('SET_ID', data.userData.id)
        commit('SET_ROLES', data.userData.roles)
        setToken(data.token)
        setID(data.userData.id)
        setUserName(data.userData.username)
      }
      return response
    }).catch(error => {
      this.$message({
        message: error,
        type: "error",
      });
      console.log('store-user-err0r', error)
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar, roles } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_ROLES', roles)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
      removeToken() // must remove  token  first
      removeID()
      removeUserName()
      resetRouter()
      commit('RESET_STATE')
      resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

