<template>
    <div>

        <h1>Movies</h1>

        <div class="uk-flex uk-flex-right uk-flex-middle">
            <div class="uk-margin-right">
                <span class="uk-text-meta">
                    {{ movies.data.length }} / {{ movies.total }} movies
                </span>
            </div>
            <div>
                <a role="button" class="uk-button uk-button-primary uk-button-small" @click="newMovie">
                    New movie
                </a>
            </div>
        </div>

        <table class="uk-table uk-table-small uk-table-divider uk-table-responsive uk-margin">
            <thead>
                <tr>
                    <th>
                        <a role="button" class="uk-button uk-padding-remove uk-text-uppercase uk-text-nowrap" @click="sortBy('id')">
                            <span v-if="isSortedBy('id')" :uk-icon="!queryParams.sortBy.includes('-') ? 'arrow-down' : 'arrow-up'"></span> ID
                        </a>
                    </th>
                    <th>
                        <a role="button" class="uk-button uk-padding-remove uk-text-uppercase uk-text-nowrap" @click="sortBy('title')">
                            <span v-if="isSortedBy('title')" :uk-icon="!queryParams.sortBy.includes('-') ? 'arrow-down' : 'arrow-up'"></span> Title
                        </a>
                    </th>
                    <th>
                        <a role="button" class="uk-button uk-padding-remove uk-text-uppercase uk-text-nowrap" @click="sortBy('release_date')">
                            <span v-if="isSortedBy('release_date')" :uk-icon="!queryParams.sortBy.includes('-') ? 'arrow-down' : 'arrow-up'"></span> Release date
                        </a>
                    </th>
                    <th>
                        <a role="button" class="uk-button uk-padding-remove uk-text-uppercase uk-text-nowrap" @click="sortBy('on_billboard')">
                            <span v-if="isSortedBy('on_billboard')" :uk-icon="!queryParams.sortBy.includes('-') ? 'arrow-down' : 'arrow-up'"></span> Status
                        </a>
                    </th>
                    <th class="uk-width-small"></th>
                </tr>
            </thead>

            <TableShimmer v-if="loadingMovies" :columns="5" :rows="10"></TableShimmer>

            <tbody v-else>
                <tr v-for="(movie, mI) in movies.data" :key="mI">
                    <td>{{ movie.id }}</td>
                    <td>{{ movie.title }}</td>
                    <td class="uk-text-nowrap">{{ movie.release_date }}</td>
                    <td>{{ movie.on_billboard ? "Yes" : "No" }}</td>
                    <td class="uk-text-center">
                        <span v-if="busyRecords.indexOf(movie.id) >= 0" uk-spinner="ratio: 0.7"></span>
                        
                        <ul v-else class="uk-iconnav">
                            <li>
                                <a role="button" class="uk-preserve-width" @click="editMovie(movie)" uk-icon="pencil"></a>
                            </li>
                            <li>
                                <a role="button" class="uk-preserve-width" @click="assign(movie)" uk-icon="calendar"></a>
                            </li>
                            <li>
                                <a role="button" class="uk-preserve-width" @click="toggleLock(movie.id, mI)" :uk-icon="movie.on_billboard ? 'lock' : 'unlock'"></a>
                            </li>
                            <li>
                                <a role="button" class="uk-preserve-width" @click="removeMovie(movie.id)" uk-icon="trash"></a>
                            </li>
                        </ul>
                    </td>
                </tr>
            </tbody>

        </table>

        <Pagination :sizeData="movies.total" :perPage="queryParams.perPage" @updatePage="updatePage"></Pagination>

        <div id="modal-movie" class="uk-flex-top" uk-modal>
            <div class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">

                <button class="uk-modal-close-default" type="button" uk-close></button>

                <h3>Complete the information</h3>

                <FormMovie></FormMovie>

            </div>
        </div>

        <div id="modal-assign" class="uk-flex-top" uk-modal>
            <div class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">

                <button class="uk-modal-close-default" type="button" uk-close></button>

                <h3>Schedule movies</h3>

                <ScheduleMovies></ScheduleMovies>

            </div>
        </div>

    </div>
</template>

<script>

import { EventBus } from "@/bus";
import { mapActions, mapState } from "vuex";
import Pagination from  "@/components/Pagination";
import TableShimmer from  "@/components/TableShimmer";
import FormMovie from "@/views/dashboard/movies/FormMovie";
import ScheduleMovies from "@/views/dashboard/movies/ScheduleMovies";

export default {
    name: "MoviesRecords",
    components: {
        ScheduleMovies,
        TableShimmer,
        Pagination,
        FormMovie,
    },
    data: () => ({
        busyRecords: [],
        queryParams: {
            page: 1,
            perPage: 10,
            sortBy: null,
        }
    }),
    computed: {
        ...mapState("movies", ["movies","loadingMovies","errors"]),
    },
    watch: {
        errors(error) {
            const message = `An error occurred: ${error}`;
            this.uikit.notification(message, "danger");
        }
    },
    methods: {
        ...mapActions("movies", ["loadMovies","deleteMovie","toggleOnBillboard"]),
        updatePage(page) {
            this.queryParams.page = page;
            this.loadMovies(this.queryParams);
        },
        isSortedBy(sortedBy) {
            if (this.queryParams.sortBy == null) {
                return false;
            }

            return this.queryParams.sortBy.includes(sortedBy);
        },
        sortBy(sort) {
            const currentSort = this.queryParams.sortBy;
            sort = !sort.includes("-") && sort == currentSort ? `-${sort}` : sort;
            this.queryParams.sortBy = sort;
            this.loadMovies(this.queryParams);
        },
        newMovie() {
            this.uikit.modal("#modal-movie").show();
            EventBus.$emit("newMovie");
        },
        editMovie(movie) {
            this.uikit.modal("#modal-movie").show();
            EventBus.$emit("editMovie", movie);
        },
        async removeMovie(id) {
            const self = this;

            this.uikit.modal.confirm("Are sure you want remove this movie?")
            .then(async () => {
                self.busyRecords.push(id);
                await self.deleteMovie(id);

                const index = self.busyRecords.findIndex(r => r == id);
                self.busyRecords.splice(index, 1);
                self.uikit.notification("Movie was deleted", "success");
            }, () => {});
        },
        async toggleLock(id, index) {
            this.busyRecords.push(id);
            const status = !this.movies.data[index].on_billboard;
            await this.toggleOnBillboard({id, data: {on_billboard: status}});
            const i = this.busyRecords.findIndex(r => r == id);
            this.busyRecords.splice(i, 1);
        },
        assign(movie) {
            this.uikit.modal("#modal-assign").show();
            EventBus.$emit("assignSchedule", movie);
        }
    },
    created() {
        this.loadMovies(this.queryParams);
    }
};
</script>