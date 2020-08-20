import { uuid } from "@/helper";

const state = {
  notifications: [],
  currentNotification:{},
  // errorNotifications: [],
  isLoadingSpinnerDisplayed: false
};

// filter methods on the state data
const getters = {
  isLoadingDisplayed: state => id => {
    return (
      typeof state.loadingNotifications.find(value => {
        return value === id;
      }) !== "undefined"
    );
  },
  
};

// async methods making mutations are placed here
const actions = {};

// methods that change the state
const mutations = {
  showError(state, { title, content }) {
    // state.errorNotifications.push({ id: uuid(), message: {title, content} })
    state.notifications.push({
      id: uuid(),
      icon: "error",
      title: title,
      text: content
    });
  },
  // closeError (state, id) {
  //   state.errorNotifications = state.errorNotifications.filter(value => {
  //     return value.id !== id
  //   })
  // },
  showSuccess(state, { title, content }) {
    // state.successNotifications.push({ id: uuid(), message: {title, content} })
    state.notifications.push({
      id: uuid(),
      icon: "success",
      title: title,
      text: content
    });
  },
  showInfo(state, { title, content }) {
    // state.infoNotifications.push({ id: uuid(), message: {title, content} })
    state.notifications.push({
      id: uuid(),
      icon: "info",
      title: title,
      text: content
    });
  },
  showLoading(state, id) {
    state.loadingNotifications.push(id);
  },
  closeLoading(state, id) {
    state.loadingNotifications = state.loadingNotifications.filter(value => {
      return value !== id;
    });
  },
  showLoadingSpinner(state, value) {
    state.isLoadingSpinnerDisplayed = value;
  },
  getCurrentNotification(state) {
    state.currentNotification= state.notifications.shift();
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
