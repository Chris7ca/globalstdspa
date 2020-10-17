import Vue from "vue";
import Vuex from "vuex";

import auth from "./../modules/auth";
import movies from "./../modules/movies";
import schedules from "./../modules/schedules";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    auth,
    movies,
    schedules
  }
});
