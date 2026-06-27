import { createApp } from "vue";

const year = window.location.pathname.replace(/^\/+|\/+$/g, "");
const { default: App } = year === "2022"
    ? await import("./2022/App.vue")
    : await import("./2026/App.vue");

createApp(App).mount("#app");
