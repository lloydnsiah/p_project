import { createRouter, createWebHistory } from "vue-router";
import store from "../store";

const routes = [
    {
      path: "/",
      name: "Home",
      component: () => import("../pages/HomePage.vue"),
    },
    {
      path: "/loading",
      name: "LoadingPage",
      component: () => import("../pages/LoadingPage.vue"),
    },
    {
      path: "/dashboard",
      name: "MainDashboard",
      component: () => import("../pages/MainDashboard.vue"),
      children: [
        {
          path: "/dashboard",
          name: "Dashboard",
          component: () => import("../pages/views/Dashboard.vue"),
          meta: {
            roles: ["Admin","User","Staff","Supervisor"], 
            description: "View farm statistics and reports."
          },
        },
        {
          path: "/expenses",
          name: "Expenses Page",
          component: () => import("../pages/views/ExpensesPage.vue"),
          meta: {
            roles: ["Admin","User","Staff","Supervisor"], 
            description: "Manage farm expenses and their reasons.",
          },
        },
        {
          path: "/revenue",
          name: "Revenue Page",
          component: () => import("../pages/views/RevenuePage.vue"),
          meta: {
            roles: ["Admin","User","Staff","Supervisor"], 
            description: "Manage farm revenue and their sources.",
          },
        },
        {
          path: "/eggsPage",
          name: "Eggs Records",
          component: () => import("../pages/views/EggProductsPage.vue"),
          meta: {
            roles: ["Admin","User","Staff","Supervisor"], 
            description:
              "Records the production, damage and spoilt Eggs from production.",
          },
        },
        {
          path: "/birdsPage",
          name: "Birds Management",
          component: () => import("../pages/views/BirdsManagement.vue"),
          meta: {
            roles: ["Admin","User","Staff","Supervisor"], 
            description:
              "Records stock and the mortality Record of Birds",
          },
        },
        {
          path: "/inventory",
          name: "Inventories",
          component: () => import("../pages/views/InventoryPage.vue"),
          meta: {
            roles: ["Admin","User","Staff","Supervisor"], 
            description:
              "Track all farm Equipements",
          },
        },
        {
          path: "/employees",
          name: "Employees",
          component: () => import("../pages/views/EmployeesPage.vue"),
          meta: {
            roles: ["Admin","Supervisor"], 
            description:
              "Track all persons employed to work on the farm",
          },
        },
        {
          path: "/suppliers",
          name: "Suppliers",
          component: () => import("../pages/views/SupplierPage.vue"),
          meta: {
           roles: ["Admin","User","Staff","Supervisor"], 
            description:
              "Track all suppliers and the products supplied",
          },
        },
        {
          path: "/userpage",
          name: "User Page",
          component: () => import("../pages/views/UserPage.vue"),
          meta: {
            roles: ["Admin"], 
            description:
              "Manage farm employees and their activities.",
          },
        },
        {
          path: "/companypage",
          name: "Companies",
          component: () => import("../pages/views/CompanyPage.vue"),
          meta: {
            roles: ["Admin"],
            description:
              "Create and manage companies.",
          },
        },
      ],
    },
  ];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const role = store.state.userrole;

  if (to.meta.roles && !to.meta.roles.includes(role)) {
    return next({ name: "Dashboard" });
  }

  next();
});

export default router;