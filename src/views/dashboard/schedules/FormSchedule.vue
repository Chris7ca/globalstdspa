<template>
    <form @submit.prevent="handleSubmit">

        <div v-if="errors" class="uk-margin uk-alert-danger" uk-alert>
            <a role="button" class="uk-alert-close" uk-close></a>
            <p v-if="errors.message">{{ errors.message }}</p>
            <ul v-if="errors.errors">
                <li v-for="(error, eI) in Object.values(errors.errors)" :key="eI">
                    {{ error[0] }}
                </li>
            </ul>
        </div>
        
        <div v-if="successMessage" class="uk-margin uk-alert-success" uk-alert>
            <a role="button" class="uk-alert-close" uk-close></a>
            <p>{{ successMessage }}</p>
        </div>

        <div class="uk-margin">
            <label class="uk-form-label" for="form-horizontal-text">Hour</label>
            <div class="uk-form-controls">
                <input class="uk-input" v-model="form.hour" step="1800" type="time" required>
            </div>
        </div>

        <div class="uk-margin">
            <label>
                <input type="checkbox" v-model="form.status" value="true"> Status
            </label>
        </div>

        <div class="uk-margin-medium-top">
            <button class="uk-button uk-button-primary" :disabled="loader">
                {{ textButton }}
                <span class="uk-margin-small-left" uk-spinner="ratio: 0.7" v-if="loader"></span>
            </button>
        </div> 

    </form>
</template>

<script>

import { EventBus } from "@/bus";
import { mapActions } from "vuex";

export default {
    name: "FormSchedule",
    data: () => ({
        mode: "create",
        loader: false,
        errors: null,
        form: {
            hour: null,
            status: false,
        },
        successMessage: null,
        editingSchedule: null,
    }),
    computed: {
        textButton() {
            return this.mode == "create" 
                ? "Save schedule"
                : "Update information";
        }
    },
    methods:{
        ...mapActions("schedules", ["storeSchedule","updateSchedule"]),
        async handleSubmit() {
            
            this.loader = true;
            const data  = this.form;

            try {

                if (this.mode == "create") {    
                    await this.storeSchedule(data);
                    this.errors = null;
                    this.successMessage = "The schedule was created";
                } else {

                    await this.updateSchedule({id: this.editingSchedule, data});
                    this.errors = null;
                    this.successMessage = "The schedule was updated";
                }

            } catch (error) {
                this.successMessage = null;
                this.errors = error;
            }

            this.loader = false;
        }
    },
    created() {
        EventBus.$on("newSchedule", () => {
            this.mode = "create";
            this.errors = null;
            this.successMessage = null;
            this.form.hour = null;
            this.form.status = null;
        });

        EventBus.$on("editSchedule", schedule => {
            this.mode = "update";
            this.errors = null;
            this.successMessage = null;
            this.editingSchedule = schedule.id;
            this.form.hour = schedule.hour;
            this.form.status = schedule.status;
        });
    }
};
</script>