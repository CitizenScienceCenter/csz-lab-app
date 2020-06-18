//import snakes from "@/assets/snakes.min.json";

const state = {
    snake:'Not selected'
};

const actions = {
    addSnake({state, commit}, snake){
        commit('SET_SNAKE',snake)
    }
};
const mutations = {
    SET_SNAKE(state, value) {
        state.snake = value;
    }
};

const getters = {
    activeSnake: state => state.snake
};

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
};
