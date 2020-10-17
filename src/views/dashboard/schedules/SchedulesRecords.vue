<template>
    <div>

        <h1>Schedules</h1>

        <div class="uk-flex uk-flex-right uk-flex-middle">
            <div class="uk-margin-right">
                <span class="uk-text-meta">
                    {{ schedules.length }} schedules
                </span>
            </div>
            <div>
                <a role="button" class="uk-button uk-button-primary uk-button-small" @click="newSchedule">
                    New schedule
                </a>
            </div>
        </div>

        <table class="uk-table uk-table-small uk-table-divider uk-table-responsive uk-margin">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Hour</th>
                    <th>Status</th>
                    <th class="uk-width-small"></th>
                </tr>
            </thead>

            <TableShimmer v-if="loadingSchedules" :columns="4" :rows="10"></TableShimmer>

            <tbody v-else>
                <tr v-for="(schedule, sI) in schedules" :key="sI">
                    <td>{{ schedule.id }}</td>
                    <td>{{ schedule.hour.substring(0, 5) }}</td>
                    <td>{{ schedule.status ? "On" : "Off" }}</td>
                    <td class="uk-text-center">
                        <span v-if="busyRecords.indexOf(schedule.id) >= 0" uk-spinner="ratio: 0.7"></span>
                        
                        <ul v-else class="uk-iconnav">
                            <li>
                                <a role="button" class="uk-preserve-width" @click="editSchedule(schedule)" uk-icon="pencil"></a>
                            </li>
                            <li>
                                <a role="button" class="uk-preserve-width" @click="toggle(schedule.id, sI)" :uk-icon="schedule.status ? 'lock' : 'unlock'"></a>
                            </li>
                            <li>
                                <a role="button" class="uk-preserve-width" @click="removeSchedule(schedule.id)" uk-icon="trash"></a>
                            </li>
                        </ul>
                    </td>
                </tr>
            </tbody>

        </table>

        <div id="modal-schedule" class="uk-flex-top" uk-modal>
            <div class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">

                <button class="uk-modal-close-default" type="button" uk-close></button>

                <h3>Complete the information</h3>

                <FormSchedule></FormSchedule>

            </div>
        </div>

    </div>
</template>

<script>

import { EventBus } from "@/bus";
import { mapActions, mapState } from "vuex";
import TableShimmer from  "@/components/TableShimmer";
import FormSchedule from "@/views/dashboard/schedules/FormSchedule";

export default {
    name: "SchedulesRecords",
    data: () => ({
        busyRecords: [],
    }),
    components: {
        TableShimmer,
        FormSchedule
    },
    computed: {
        ...mapState("schedules", ["loadingSchedules","schedules"])
    },
    methods: {
        ...mapActions("schedules", ["loadSchedules","deleteSchedule","toggleStatus"]),
        isSortedBy(sortedBy) {
            if (this.sortBy == null) {
                return false;
            }

            return this.sortBy.includes(sortedBy);
        },
        setSortBy(sort) {
            const currentSort = this.sortBy;
            sort = !sort.includes("-") && sort == currentSort ? `-${sort}` : sort;
            this.doSort(sort);
        },
        newSchedule() {
            this.uikit.modal("#modal-schedule").show();
            EventBus.$emit("newSchedule");
        },
        editSchedule(schedule) {
            this.uikit.modal("#modal-schedule").show();
            EventBus.$emit("editSchedule", schedule);
        },
        async removeSchedule(id) {
            const self = this;

            this.uikit.modal.confirm("Are sure you want remove this schedule?")
            .then(async () => {
                self.busyRecords.push(id);
                await self.deleteSchedule(id);

                const index = self.busyRecords.findIndex(r => r == id);
                self.busyRecords.splice(index, 1);
                self.uikit.notification("Schedule was deleted", "success");
            }, () => {});
        },
        async toggle(id, index) {
            this.busyRecords.push(id);
            const status = !this.schedules[index].status;
            await this.toggleStatus({id, data: {status}});
            const i = this.busyRecords.findIndex(r => r == id);
            this.busyRecords.splice(i, 1);
        }
    },
    created() {
        this.loadSchedules();
    }
};
</script>