const state = {
    activeThread:null,
    numberOfThreads:0
};

const actions = {
    activeForumThread({state, commit}, thread){
        commit('SET_ACTIVE_THREAD',thread)
    },
    numberOfThreads({state, commit}, NUMBER){
        commit('SET_NUMBER_OF_THREADS',NUMBER)
    }
};
const mutations = {
    SET_ACTIVE_THREAD(state, value) {
        state.activeThread = value;
    },
    SET_NUMBER_OF_THREADS(state, value) {
        state.numberOfThreads = value;
    }
};

const getters = {
    getActiveThread: state => state.activeThread,
    getNumberOfThreads: state => state.numberOfThreads
};

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
};
