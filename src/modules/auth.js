import router from "./../router/index";

import http from "./../api";

let user, isAuth;

try {
    user = JSON.parse(localStorage.getItem("user"));
    isAuth = user ? true : false;
    http.defaults.headers.common["Authorization"] = `Bearer ${isAuth ? user.token : ""}`;
} catch (error) {
    user = null;
    isAuth = false;
}

export default {
    namespaced: true,
    state: {
        user,
        isAuth
    },
    mutations: {
        LOGIN_SUCCESS(state, user) {
            state.isAuth = true ;
            state.user = user;
        },
        LOGOUT(state) {
            state.isAuth = false;
            state.user = null;
        },
    },
    actions: {
        async login({ commit }, {email, password}) {

            const data = {
                status: false,
                errors: null
            };
        
            try {

                const response = await http.post("/api/auth/login", {
                    email, password
                });

                localStorage.setItem("user", JSON.stringify(response.data.user));
                http.defaults.headers.common["Authorization"] = `Bearer ${response.data.user.token}`;
                commit("LOGIN_SUCCESS", response.data.user);

                data.status = true;

            } catch (error) {
                data.errors = error.response.data.message;
            }

            return data;
        },
        async logout({ commit }) {
            localStorage.clear();
            commit("LOGOUT");
            router.replace("/login");
        },
    }
};