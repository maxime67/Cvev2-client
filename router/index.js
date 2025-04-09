import { createRouter, createWebHistory } from "vue-router";
import Main from "@/components/Main.vue";
import VendorComponent from "@/components/VendorComponent.vue";
import CveComponent from "@/components/CveComponent.vue";
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
    },
    {
        path: "/cve/:id",
        name: "cve",
        component: CveComponent,
    }

];
const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;