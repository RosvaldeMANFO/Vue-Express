import { createRouter, createWebHistory } from "vue-router";
import LoginVue from "../views/common.views/Login.vue";
import RegisterVue from "../views/user.views/Register.vue";
import CataLogVue from "../views/user.views/Catalog.vue";
import OnboardingVue from "../views/common.views/Onboarding.vue";
import ErrorVue from "../views/common.views/Error.vue";
import { useSessionStore } from "../store";
import BooksVue from "../views/admin.views/Books.vue";
import BookCollectionVue from "../views/admin.views/BookCollection.vue";
import BookRegistrationVue from "../views/admin.views/BookRegistration.vue";
import ReadersVue from "../views/admin.views/Readers.vue";
import RequestVue from "../views/admin.views/Requests.vue";
import BorrowingRequest from "../views/user.views/BorrowingRequest.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "onboarding",
      component: OnboardingVue,
    },
    {
      path: "/reader",
      name: "READER",
      redirect: "catalog",
    },
    {
      path: "/admin",
      name: "ADMIN",
      redirect: "books",
    },
    {
      path: "/books",
      name: "books",
      component: BooksVue,
    },
    {
      path: "/collections",
      name: "collections",
      component: BookCollectionVue,
    },
    {
      path: "/books/register/:bookId?",
      name: "register_book",
      component: BookRegistrationVue,
    },
    {
      path: "/readers",
      name: "readers",
      component: ReadersVue,
    },
    {
      path: "/requests/:readerId?",
      name: "requests",
      component: RequestVue,
    },
    {
      path: "/catalog",
      name: "catalog",
      component: CataLogVue,
    },
    {
      path: "/borrow",
      name: "borrow",
      component: BorrowingRequest,
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
  const required = ["login", "register", "onboarding"];
  let sessionExpired = store.exp < Math.floor(Date.now() / 1000);
  if (!required.includes(String(to.name)) && sessionExpired)
    next({ name: "login", replace: true });
  else next();
});

export default router;
