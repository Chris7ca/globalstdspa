<template>
	<div class="uk-container uk-container-small" id="app">
		<header>
			<nav class="uk-navbar-container uk-navbar-transparent uk-position-relative" uk-navbar="mode: click">
				<div class="uk-navbar-left">
					<ul class="uk-navbar-nav">
						<li>
							<router-link to="/">
								<img width="40" src="/images/logo.png" alt="Logo">
							</router-link>
						</li>
					</ul>
				</div>
				<div class="uk-navbar-right">
					<ul class="uk-navbar-nav">
						<router-link v-if="!isAuth" to="/login" tag="li" active-class="uk-active">
							<a role="button">Login</a>
						</router-link>
						<router-link v-if="isAuth" to="/dashboard" tag="li" active-class="uk-active">
							<a role="button">
								{{ user.name }}
								<span class="uk-margin-small-left" uk-icon="icon: user; ratio: 0.8"></span>
							</a>
						</router-link>
					</ul>
				</div>
			</nav>
		</header>
		<router-view />
	</div>
</template>

<script>

import { mapState } from "vuex";

export default {
	name: "App",
	computed: {
		...mapState("auth", ["isAuth"]),
		...mapState("auth", ["user"]),
	}
};

</script>

<style lang="less">
@import "./assets/less/app.less";
</style>