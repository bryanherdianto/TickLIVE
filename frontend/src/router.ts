import { createRouter, createWebHistory } from "vue-router";
import HomePage from "./components/HomePage.vue";
import EventPage from "./components/EventPage.vue";
import CheckoutPage from "./components/CheckoutPage.vue";
import VenuePage from "./components/VenuePage.vue";
import SeatSelectionPage from "./components/SeatSelectionPage.vue";
import EventDetailsPage from "./components/EventDetailsPage.vue";
import VenueDetailsPage from "./components/VenueDetailsPage.vue";
import TicketsPage from "./components/TicketsPage.vue";
import LoginPage from "./components/LoginPage.vue";
import RegisterPage from "./components/RegisterPage.vue";
import MyEventsPage from "./components/MyEventsPage.vue";
import MyVenuesPage from "./components/MyVenuesPage.vue";

const routes = [
	{ path: "/", name: "home", component: HomePage },
	{ path: "/events", name: "events", component: EventPage },
	{ path: "/event/:id", name: "event-details", component: EventDetailsPage },
	{ path: "/venues", name: "venues", component: VenuePage },
	{ path: "/venue/:id", name: "venue-details", component: VenueDetailsPage },
	{
		path: "/seat-selection/:eventId",
		name: "seat-selection",
		component: SeatSelectionPage,
	},
	{ path: "/checkout", name: "checkout", component: CheckoutPage },
	{ path: "/tickets", name: "my-tickets", component: TicketsPage },
	{ path: "/my-events", name: "my-events", component: MyEventsPage },
	{ path: "/my-venues", name: "my-venues", component: MyVenuesPage },
	{ path: "/login", name: "login", component: LoginPage },
	{ path: "/register", name: "register", component: RegisterPage },
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

export default router;
