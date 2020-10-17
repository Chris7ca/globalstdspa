<template>
    <main class="uk-margin-large-top">
        <div uk-grid>
            <div class="uk-width-auto@m">
                <ul class="uk-tab-left" uk-tab="connect: #menu; animation: uk-animation-slide-left-small, uk-animation-slide-right-small">
                    <li class="uk-margin-small-bottom">
                        <a role="button">
                            <span class="uk-margin-small-right" uk-icon="image"></span>
                            Movies
                        </a>
                    </li>
                    <li class="uk-margin-small-bottom">
                        <a role="button">
                            <span class="uk-margin-small-right" uk-icon="calendar"></span>
                            Schedules
                        </a>
                    </li>
                    <li class="uk-margin-small-bottom">
                        <a role="button" @click.stop="handleLogout">
                            <span class="uk-margin-small-right" uk-icon="sign-out"></span>
                            Logout
                        </a>
                    </li>
                </ul>

            </div>
            <div class="uk-width-expand@m">
                <ul id="menu" class="uk-switcher">
                    <li>
                        <MoviesRecords></MoviesRecords>
                    </li>
                    <li>
                        <SchedulesRecords></SchedulesRecords>
                    </li>
                </ul>
            </div>
        </div>
    </main>
</template>

<script>

import { mapActions } from "vuex";
import MoviesRecords from "@/views/dashboard/movies/MoviesRecords";
import SchedulesRecords from "@/views/dashboard/schedules/SchedulesRecords";

export default {
    name: "Dashboard",
    components: {
        MoviesRecords,
        SchedulesRecords
    },
    methods: {
        ...mapActions("auth", ["logout"]),
        handleLogout() {
            this.logout();
            this.$router.replace("/");
        }
    }
};
</script>