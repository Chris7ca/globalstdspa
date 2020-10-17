import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";

import VueContentPlaceholders from "vue-content-placeholders";

Vue.use(VueContentPlaceholders);

UIkit.use(Icons);

Vue.config.productionTip = false;

Vue.mixin({
	data() {
		return {
			get uikit() {
				return UIkit;
			}
		};
	},
});

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount("#app");
