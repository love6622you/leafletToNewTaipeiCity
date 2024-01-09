import { defineStore } from 'pinia';

export const InitialUserState = () => ({
  google: {
    token: '',
    userInfo: {},
  },
  facebook: {
    token: '',
    userInfo: {},
  },
});

export const useUserStore = defineStore('user', {
  state: () => InitialUserState(),
  getters: {
    isLogin: (state) => !!state.google.token && !!state.facebook.token,
  },
  actions: {
    setUserToken(type, token) {
      this[type].token = token;
    },
    setUserInfo(type, userInfo) {
      this[type].userInfo = userInfo;
    },
    logout() {
      InitialUserState();
    },
  },
  persist: true,
});
