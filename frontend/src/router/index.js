import { createRouter, createWebHistory } from "vue-router";
import PresentationView from "../views/Presentation/PresentationView.vue";
import VenueDetail from "../views/LandingPages/Venue/VenueDetail.vue";
import EventDetail from "../views/LandingPages/Event/EventDetail.vue";
import MyTicketsView from "../views/LandingPages/MyTickets/MyTicketsView.vue";
import MyEventsView from "../views/LandingPages/MyEvents/MyEventsView.vue";
import MyVenuesView from "../views/LandingPages/MyVenues/MyVenuesView.vue";
import EventView from "../views/LandingPages/Event/EventView.vue";
import VenueView from "../views/LandingPages/Venue/VenueView.vue";

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
      component: EventView,
    },
    {
      path: "/venues",
      name: "venues",
      component: VenueView,
    },
    {
      path: '/venues/:id',
      name: 'VenueDetail',
      component: VenueDetail,
    },
    {
      path: '/events/:id',
      name: 'EventDetail',
      component: EventDetail,
    },
    {
      path: '/my-tickets',
      name: 'MyTickets',
      component: MyTicketsView,
    },
    {
      path: '/my-events',
      name: 'MyEvents',
      component: MyEventsView,
    },
    {
      path: '/my-venues',
      name: 'MyVenues',
      component: MyVenuesView,
    }
  ],
});

export default router;
