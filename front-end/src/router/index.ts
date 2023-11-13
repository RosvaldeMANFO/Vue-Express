import { createRouter, createWebHistory } from "vue-router";
import LoginVue from "../views/common.views/Login.vue";
import RegisterVue from "../views/user.views/Register.vue";
import BooksListVue from "../views/user.views/BooksList.vue";
import OnboardingVue from "../views/common.views/Onboarding.vue";
import ErrorVue from "../views/common.views/Error.vue";
import DashboardVue from "../views/user.views/UserDash.vue";
import BorrowRowVue from "../components/BorrowRow.vue";
import { useSessionStore } from "../store";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "READER",
      component: DashboardVue,
      redirect: "catalog",
      children: [
        {
          path: "/catalog",
          name: "catalog",
          component: BooksListVue,
        },
        {
          path: "/borrow",
          name: "borrow",
          component: BorrowRowVue,
        },
      ],
    },
    {
      path: "/",
      name: "onboarding",
      component: OnboardingVue,
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
  let sessionExpired = store.exp < Math.floor(Date.now() / 1000);
  if (to.name != "login" && sessionExpired)
    next({ name: "login", replace: true });
  else next();
});
export default router;
