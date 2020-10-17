import http from "./../api";

export default {
	namespaced: true,
	state: {
		loadingMovies: true,
		alreadyInit: false,
		errors: null,
		movies: {
			data: []
		}
	},
	mutations: {
		LOAD_DATA(state, movies) {
			state.movies = movies;
		},
		UPDATE_LOADER(state, status) {
			state.loadingMovies = status;
		},
		UPDATE_ERRORS(state, errors) {
			state.errors = errors;
		},
		ADD_MOVIE(state, movie) {
			state.movies.data.push(movie);
		},
		UPDATE_MOVIE(state, movie) {
			state.loadingMovies = true;
			const index = state.movies.data.findIndex(m => m.id == movie.id);
			state.movies.data[index] = movie;
			state.loadingMovies = false;
		},
		DELETE_MOVIE(state, id) {
			const index = state.movies.data.findIndex(m => m.id == id);
			state.movies.data.splice(index, 1);
		},
		TOGGLE_ON_BILLBOARD(state, { id, status }) {
			const index = state.movies.data.findIndex(m => m.id == id);
			state.movies.data[index].on_billboard = status;
		},
		UPDATE_SCHEDULE(state, { id, schedules }) {
			const index = state.movies.data.findIndex(m => m.id == id);
			state.movies.data[index].schedules = schedules;
		}
	},
	actions: {
		async loadMovies({ commit }, { page, sortBy, perPage }) {
			let queryParams = "?";
			queryParams += page ? `page=${page}` : "";
			queryParams += sortBy ? `&sortBy=${sortBy}` : "";
			queryParams += perPage ? `&perPage=${perPage}` : "";

			commit("UPDATE_LOADER", true);

			try {
				const response = await http.get(`/api/movies${queryParams}`);
				commit("LOAD_DATA", response.data);
			} catch (error) {
				commit("UPDATE_ERRORS", error.response.data.message);
			}

			commit("UPDATE_LOADER", false);
		},
		async storeMovie({ commit }, formData) {

			try {
				const response = await http.post("/api/movies/store", formData, {
					headers: {
						"Content-Type": "multipart/form-data"
					}
				});
				commit("ADD_MOVIE", response.data);
			} catch (error) {
				throw (error.response.data);
			}
		},
		async updateMovie({ commit }, { id, formData }) {

			try {
				const response = await http.post(`/api/movies/${id}/update?_method=PATCH`,
					formData, {
					headers: {
						"Content-Type": "multipart/form-data"
					}
				});
				commit("UPDATE_MOVIE", response.data);
			} catch (error) {
				throw (error.response.data);
			}
		},
		async deleteMovie({ commit }, id) {

			try {
				await http.delete(`/api/movies/${id}/delete`);
				commit("DELETE_MOVIE", id);
			} catch (error) {
				commit("UPDATE_ERRORS", error.response.data.message);
			}
		},
		async toggleOnBillboard({ commit }, { id, data }) {

			try {
				await http.patch(`/api/movies/${id}/update`, data);
				commit("TOGGLE_ON_BILLBOARD", { id, status: data.on_billboard });
			} catch (error) {
				commit("UPDATE_ERRORS", error.response.data.message);
			}
		},
		async updateAssignSchedule({ commit }, {id, schedules}) {
			try {
				await http.patch(`/api/movies/${id}/schedule/update`, 
					{schedules}
				);
				commit("UPDATE_SCHEDULE", { id, schedules });
			} catch (error) {
				throw (error.response.data.message);
			}
		}
	}
};
