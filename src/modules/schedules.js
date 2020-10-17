import http from "./../api";

export default {
    namespaced: true,
    state: {
        loadingSchedules: true,
        errors: null,
		schedules: [],
    },
    mutations: {
        LOAD_DATA(state, schedules) {
			state.schedules = schedules;
		},
        UPDATE_LOADER(state, status) {
			state.loadingSchedules = status;
		},
		UPDATE_ERRORS(state, errors) {
			state.errors = errors;
        },
        ADD_SCHEDULE(state, schedule) {
			state.schedules.push(schedule);
		},
		UPDATE_SCHEDULE(state, schedule) {
			state.loadingSchedules = true;
			const index = state.schedules.findIndex(s => s.id == schedule.id);
			state.schedules[index] = schedule;
			state.loadingSchedules = false;
		},
		DELETE_SCHEDULE(state, id) {
			const index = state.schedules.findIndex(s => s.id == id);
			state.schedules.splice(index, 1);
		},
		TOGGLE_STATUS(state, { id, status }) {
			const index = state.schedules.findIndex(s => s.id == id);
			state.schedules[index].status = status;
		}
    },
    actions: {
        async loadSchedules({ commit }) {

            commit("UPDATE_LOADER", true);

            try {
                const response = await http.get("/api/schedules");
                commit("LOAD_DATA", response.data);
            } catch (error) {
                commit("UPDATE_ERRORS", error.response.data.message);
            }

            commit("UPDATE_LOADER", false);
        },
        async storeSchedule({ commit }, data) {

			try {
				const response = await http.post("/api/schedules/store", data);
				commit("ADD_SCHEDULE", response.data);
			} catch (error) {
				throw (error.response.data);
			}
		},
		async updateSchedule({ commit }, { id, data }) {

			try {
				const response = await http.patch(`/api/schedules/${id}/update`, data);
				commit("UPDATE_SCHEDULE", response.data);
			} catch (error) {
				throw (error.response.data);
			}
		},
		async deleteSchedule({ commit }, id) {

			try {
				await http.delete(`/api/schedules/${id}/delete`);
				commit("DELETE_SCHEDULE", id);
			} catch (error) {
				commit("UPDATE_ERRORS", error.response.data.message);
			}
		},
		async toggleStatus({ commit }, { id, data }) {

			try {
				await http.patch(`/api/schedules/${id}/update`, data);
				commit("TOGGLE_STATUS", { id, status: data.status });
			} catch (error) {
				commit("UPDATE_ERRORS", error.response.data.message);
			}
		},
		
	},
	getters: {
		sortedSchedules(state) {
			return state.schedules.sort((a,d) => {
				const asc = a.hour.replace(/:/g, "");
				const desc = d.hour.replace(/:/g, "");

				return asc - desc;
			});
		}
	}
};