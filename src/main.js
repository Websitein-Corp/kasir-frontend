import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import "./index.css";
import helpers from "./helpers";
import VueVirtualScroller from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import VueLazyLoad from "vue3-lazyload";

const pinia = createPinia();

const app = createApp(App);

app.config.globalProperties.$helpers = helpers;

app
  .use(pinia)
  .use(router)
  .use(VueVirtualScroller)
  .use(VueLazyLoad)
  .mount("#app");
