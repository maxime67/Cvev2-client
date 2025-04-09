import { createRouter, createWebHistory } from "vue-router";
import Main from "@/components/Main.vue";
import VendorComponent from "@/components/VendorComponent.vue";
import CveComponent from "@/components/cve/CveComponent.vue";
import LoginForm from "@/components/auth/LoginForm.vue";
import RegisterForm from "@/components/auth/RegisterForm.vue";
import { AuthService } from "@/services/AuthService";

const routes = [
    {
        path: "/",
        name: "home",
        component: Main,
    },
    {
        path: "/vendor",
        name: "vendor",
        component: VendorComponent,
        meta: { requiresAuth: true } // Cette route nécessite une authentification
    },
    {
        path: "/cve/:id",
        name: "cve",
        component: CveComponent,
    },
    {
        path: "/login",
        name: "login",
        component: LoginForm,
        meta: { guestOnly: true } // Cette route est uniquement pour les visiteurs non authentifiés
    },
    {
        path: "/register",
        name: "register",
        component: RegisterForm,
        meta: { guestOnly: true } // Cette route est uniquement pour les visiteurs non authentifiés
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Navigation guard pour protéger les routes et rediriger si nécessaire
router.beforeEach((to, from, next) => {
    const isAuthenticated = AuthService.getters.isAuthenticated.value;

    // Si la route requiert une authentification et que l'utilisateur n'est pas connecté
    if (to.meta.requiresAuth && !isAuthenticated) {
        next({ name: 'login', query: { redirect: to.fullPath } });
    }
    // Si la route est pour les invités seulement et que l'utilisateur est connecté
    else if (to.meta.guestOnly && isAuthenticated) {
        next({ name: 'home' });
    }
    else {
        next();
    }
});

export default router;