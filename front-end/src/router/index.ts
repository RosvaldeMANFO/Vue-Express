import { createRouter, createWebHistory } from "vue-router";
import LoginVue from "../views/common.views/Login.vue";
import RegisterVue from "../views/user.views/Register.vue";
import BookListVue from "../views/user.views/BookList.vue";
import BorrowListVue from "../views/user.views/BorrowList.vue"
import OnboardingVue from "../views/common.views/Onboarding.vue";
import ErrorVue from "../views/common.views/Error.vue";
import { useSessionStore } from "../store";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "onboarding",
      component: OnboardingVue,
    },
    {
      path: "/",
      name: "READER",
      redirect: "catalog",
    },
    {
      path: "/catalog",
      name: "catalog",
      component: BookListVue,
    },
    {
      path: "/borrow",
      name: "borrow",
      component: BorrowListVue,
    },
    {
      path: "/login",
      name: "login",
      component: LoginVue,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterVue,
    },
    {
      path: "/error",
      name: "error",
      component: ErrorVue,
    },
  ],
});

router.beforeEach((to, _from, next) => {
  let store = useSessionStore();
  const required = ['login', 'register']
  let sessionExpired = store.exp < Math.floor(Date.now() / 1000);
  if ( !required.includes(String(to.name)) && sessionExpired)
    next({ name: "login", replace: true });
  else next();
});
export default router;
