import { createRouter, createWebHistory } from "vue-router";
import Main from "@/components/Main.vue";
import VendorComponent from "@/components/VendorComponent.vue";
const routes = [
    {
        path: "/",
        component: Main,
    },
    {
        path: "/vendor",
        component: VendorComponent,
    },

];
const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;