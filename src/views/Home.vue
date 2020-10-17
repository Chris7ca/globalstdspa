<template>
    <div>
        
        <h2 class="uk-heading-small uk-text-bold uk-margin-small">Recommended Movies</h2>
        <hr class="uk-divider-small">
        
        <div class="uk-margin-large" v-if="loader">
            <p>Loading recommended movies... <span class="uk-margin-left" uk-spinner="ratio: 0.7"></span></p>
        </div>
        
        <div class="uk-margin-large" uk-slider v-else>
            <div v-if="movies.length > 1">
                <a class="uk-padding-small" role="button" uk-icon="icon: arrow-left; ratio: 1.3" uk-slider-item="previous"></a>
                <a class="uk-padding-small" role="button" uk-icon="icon: arrow-right; ratio: 1.3" uk-slider-item="next"></a>
            </div>
            <div class="uk-position-relative uk-visible-toggle" tabindex="-1">
        
                <ul class="uk-slider-items uk-child-width-1-5@xl uk-child-width-1-4@l uk-child-width-1-3@m uk-child-width-1-2@s uk-grid">
                    <li v-for="(movie, mI) in movies" :key="mI">
                        <MovieCard :title="movie.title" :thumbnail="movie.thumbnail" :releaseDate="movie.release_date" :onBillboard="movie.on_billboard"></MovieCard>
                    </li>
                </ul>
        
            </div>    
        </div>

    </div>
</template>

<script>

import http from "@/api";
import MovieCard from "@/components/MovieCard.vue";

export default {
    name: "Home",
    data: () => ({
        resource: "/api/movies/recommended",
        apiURL: process.env.VUE_APP_API,
        loader: true,
        movies: [],
    }),
    components: {
        MovieCard
    },
    methods: {
        async loadMovies() {
            try {
                const response = await http.get(`${this.apiURL}${this.resource}`);
                this.movies = response.data;
            } catch (error) {
                this.uikit.notification(`An error ocurred: ${error}`, "danger");
            }

            this.loader = false;
        }
    },
    mounted() {
        this.loadMovies();
    }
};
</script>
