import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import { useSessionStore } from "./store";

const app = createApp(App);
app.use(router);

const pinia = createPinia();
app.use(pinia);

function resumeSession() {
  const session = localStorage.getItem("session");
  if (session) {
    const store = useSessionStore();
    store.$patch(JSON.parse(String(session)));
  }
}

resumeSession();
app.mount("#app");
