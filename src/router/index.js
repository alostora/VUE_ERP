import { createRouter, createWebHistory } from "vue-router";

import HomePage from "../latest/views/HomePage.vue";
import LoginPage from "../latest/views/LoginPage.vue";
import user_routes from "@/views/user/routes/routes";
import country_routes from "@/views/country/routes/routes";
import governorate_routes from "../latest/model/governorate/routes/governorate-routes";
import city_routes from "../latest/model/city/routes/city-routes";
import company_routes from "../latest/model/company/routes/company-routes";
import branch_routes from "../latest/model/branch/routes/branch_routes";
import MVVMContent from "../latest/views/layouts/MVVMContent.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
      meta: { requiresAuth: true }, // Protected route
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: MVVMContent
        },
        ...user_routes,
        ...country_routes,
        ...governorate_routes,
        ...city_routes,
        ...company_routes,
        ...branch_routes,
      ],
    },
    {
      path: "/login",
      name: "login",
      component: LoginPage,
      meta: { requiresAuth: false } // Unprotected route
    },
  ],
});

// --- ADDED NAVIGATION GUARD ---
router.beforeEach((to, from, next) => {
  // Check if the route the user is navigating to requires authentication
  if (to.meta.requiresAuth) {
    // Check if the authentication token exists in local storage
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
      // Token exists, user is authenticated. Proceed to the desired route.
      next();
    } else {
      // Token does NOT exist. Redirect to the login page.
      // We pass the intended destination path as a query parameter ('redirect')
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    }
  } else {
    // Route does not require authentication (e.g., /login). Proceed as normal.
    next();
  }
});
// ------------------------------

export default router;