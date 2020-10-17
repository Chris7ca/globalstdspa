<template>
    <main>
        <div class="uk-width-1-2 uk-position-center">
            <h1>Login for more actions</h1>

            <div class="uk-alert uk-alert-danger" v-if="errors">
                <span class="uk-text-danger uk-text-bold">Invalid credentials</span>
            </div>

            <form class="uk-margin-medium" @submit.prevent="handleSubmit">
                <div class="uk-margin">
                    <input type="text" class="uk-input" v-model="form.email" autocomplete="email" placeholder="Your email" autofocus required>
                </div>
                <div class="uk-margin">
                    <input class="uk-input" type="password" v-model="form.password" placeholder="Your password" required>
                </div>
                <div class="uk-margin-medium">
                    <button class="uk-button uk-button-primary uk-box-shadow-hover-large" :disabled="loader">
                        <span v-if="loader" class="uk-margin-small-right" uk-spinner="ratio: 0.7"></span>
                        Log in 
                        <span class="uk-margin-small-left" uk-icon="arrow-right"></span>
                    </button>
                    <span class="uk-margin-small-left uk-margin-small-right">or</span> 
                    <router-link to="/">
                        Back to home
                    </router-link>
                </div>
            </form>
        </div>
    </main>
</template>

<script>

import { mapActions } from "vuex";    

export default {
    name: "Login",
    data: () => ({
        loader: false,
        errors: null,
        form: {
            email: null,
            password: null
        }
    }),
    methods: {
        ...mapActions("auth", ["login"]),
        async handleSubmit() {
            this.loader = true;
            const isAuth = await this.login(this.form);
            
            this.loader = false;

            if ( isAuth.errors ) {
                this.uikit.notification(isAuth.errors, "danger");
            } else {
                this.$router.replace("/dashboard");
            }
        }
    }
};
</script>