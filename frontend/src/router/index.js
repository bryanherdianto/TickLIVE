import { createRouter, createWebHistory } from "vue-router";
import PresentationView from "../views/Presentation/PresentationView.vue";
import AboutView from "../views/LandingPages/AboutUs/AboutView.vue";
import AuthorView from "../views/LandingPages/Author/AuthorView.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "presentation",
      component: PresentationView,
    },
    {
      path: "/events",
      name: "events",
      component: AuthorView,
    },
    {
      path: "/venues",
      name: "venues",
      component: AboutView,
    },
    {
      path: '/venues/:id',
      name: 'VenueDetail',
      component: PresentationView,
    },
    {
      path: '/events/:id',
      name: 'EventDetail',
      component: PresentationView,
    }
  ],
});

export default router;
