<template>
    <div>

        <h4 class="uk-text-bold">{{ movie.title }}</h4>

        <div class="uk-margin-medium-top uk-grid uk-flex-middle" uk-grid>
            <div v-for="(schedule, sI) in sortedSchedules" :key="sI">
                <div>
                    <a role="button" :class="classes(schedule)" @click="toggle(schedule)">
                        {{ schedule.hour.substring(0, 5  ) }}
                    </a>
                </div>
            </div>
        </div>

        <div class="uk-margin-medium-top">
            <button class="uk-button uk-button-secondary uk-button-small" @click="assignSchedules" :disabled="loader">
                Assign schedule <span v-if="loader" class="uk-margin-small-left" uk-spinner="ratio: 0.7"></span>
            </button>
        </div>

    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import { EventBus } from  "./../../../bus";

export default {
    data: () => ({
        loader: false,
        movie: {},
    }),
    computed: {
        ...mapGetters("schedules", ["sortedSchedules"]),
    },
    methods: {
        ...mapActions("movies", ["updateMovieSchedule","updateAssignSchedule"]),
        classes(schedule) {
            return {
                "uk-label uk-link-reset": true,
                "active": this.movie.schedules && this.movie.schedules.indexOf(schedule.id) >= 0
            };
        },
        toggle(schedule) {
            const index = this.movie.schedules.indexOf(schedule.id);

            if (index >= 0) {
                this.movie.schedules.splice(index, 1);
            } else {
                this.movie.schedules.push(schedule.id);
            }
        },
        async assignSchedules() {
            this.loader = true;

            try {
                await this.updateAssignSchedule({id: this.movie.id, schedules: this.movie.schedules});
                this.uikit.notification("Movie schedule update", "success");
            } catch (error) {
                this.uikit.notification(error, "danger");
            }

            this.loader = false;
        }
    },
    created() {
        EventBus.$on("assignSchedule", movie => {
            this.movie = Object.assign({}, movie);
        });
    }
};
</script>

<style lang="css" scoped>
    .uk-label {
        color: #333;
        background: transparent;
        border: solid 1px #999;
    }
    .uk-label.active {
        color: #FAFAFA!important;
        background: #579fb9;
        border: solid 1px #579fb9;
    }
</style>