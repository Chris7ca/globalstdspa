<template>
    <form ref="formMovie" @submit.prevent="handleSubmit">

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
            <label class="uk-form-label" for="form-horizontal-text">Title</label>
            <div class="uk-form-controls">
                <input class="uk-input" name="title" type="text" placeholder="Title movie" required>
            </div>
        </div>

        <div class="uk-margin">
            <label class="uk-form-label" for="form-horizontal-text">Release date</label>
            <div class="uk-form-controls">
                <input class="uk-input" name="release_date" type="date" placeholder="AAAA/MM/DD" required>
            </div>
        </div>

        <div class="uk-margin">
            <label class="uk-form-label" for="form-horizontal-text">Thumbnail</label>
            <div class="uk-form-controls">
                <div uk-form-custom="target: true">
                    <input type="file" name="thumbnail" :required="mode == 'create'">
                    <input class="uk-input uk-form-width-medium" type="text" placeholder="Select thumbnail" disabled>
                </div>
            </div>
        </div>

        <div class="uk-margin">
            <label>
                <input type="checkbox" name="on_billboard" value="true"> On billboard
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
    name: "FormMovie",
    data: () => ({
        mode: "create",
        loader: false,
        errors: null,
        successMessage: null,
        editingMovie: null,
    }),
    computed: {
        textButton() {
            return this.mode == "create" 
                ? "Save movie"
                : "Update information";
        }
    },
    methods:{
        ...mapActions("movies", ["storeMovie","updateMovie"]),
        async handleSubmit() {
            
            this.loader = true;

            try {
                
                const formData = new FormData(this.$refs.formMovie);
                
                if (formData.get("on_billboard") == null) {
                    formData.set("on_billboard", false);
                }

                if (this.mode == "create") {    
                    await this.storeMovie(formData);
                    this.errors = null;
                    this.successMessage = "The movie was created";
                } else {
                    
                    if (formData.get("thumbnail").size == 0) {
                        formData.delete("thumbnail");
                    }

                    await this.updateMovie({id: this.editingMovie, formData});
                    this.errors = null;
                    this.successMessage = "The movie was updated";
                }

            } catch (error) {
                this.successMessage = null;
                this.errors = error;
            }

            this.loader = false;
        }
    },
    created() {
        EventBus.$on("newMovie", () => {
            this.mode = "create";
            this.errors = null;
            this.successMessage = null;
            this.$refs.formMovie.reset();
        });

        EventBus.$on("editMovie", movie => {
            this.mode = "update";
            this.errors = null;
            this.successMessage = null;
            this.editingMovie = movie.id;
            this.$refs.formMovie.title.value = movie.title;
            this.$refs.formMovie.release_date.value = movie.release_date;
            this.$refs.formMovie.on_billboard.checked = movie.on_billboard;
        });
    }
};
</script>