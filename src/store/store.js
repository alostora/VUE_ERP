import { createStore } from "vuex";

// Create a new store instance.
const store = createStore({
  state() {
    return {
      loading: false,
      indeterminateLoading: false,
      snackbar: false,
      snackbarContent: "",
      apiToken: "",
      fcmToken: "",
      notificationEvent: "",
    };
  },
  getters: {
    getLoadingStatus(state) {
      return state.loading;
    },

    getIndeterminateLoadingStatus(state) {
      return state.indeterminateLoading;
    },

    getSnackbarStatus(state) {
      return state.snackbar;
    },

    getSnackbarContent(state) {
      return state.snackbarContent;
    },

    getApiToken(state) {
      return state.apiToken;
    },

    getFcmToken(state) {
      return state.fcmToken;
    },

    getNotificationEvent(state) {
      return state.notificationEvent;
    },
  },
  mutations: {
    stopLoading(state) {
      state.loading = false;
      state.indeterminateLoading = false;
    },
    startLoading(state) {
      state.loading = true;
      state.indeterminateLoading = "indeterminate";
    },

    startSnackbar(state, value) {
      state.snackbar = true;
      state.snackbarContent = value;
    },

    stopSnackbar(state) {
      state.snackbar = false;
      state.snackbarContent = "";
    },

    updateApiToken(state,newApiToken) {
      state.apiToken = newApiToken;
    },

    updateFcmToken(state, newFcmToken) {
      state.fcmToken = newFcmToken;
    },

    updateNotificationEvent(state, notificationEvent) {
      state.notificationEvent = notificationEvent;
    },

  },
});

export default store;
