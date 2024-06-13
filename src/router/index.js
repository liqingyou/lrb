import routes from "./routes";
import routes2 from "./routes2";
import { createRouter, createWebHashHistory } from "vue-router";

const allRoutes = [...routes, ...routes2];

const router = createRouter({
    history:createWebHashHistory(),
    routes: allRoutes
})

export default router