<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useAuth } from "@clerk/vue";
import { RouterLink, useRoute } from "vue-router";
import Footer from "./Footer.vue";
import Header from "./Header.vue";
import { useApi } from "@/lib/api";
import { formatCurrency, formatEventDate } from "@/lib/format";

type Ticket = {
	id: string;
	status: string;
	currency: string;
	total: string;
	expiresAt: string | null;
	eventTitle: string;
	startsAt: string;
	venueName: string;
	venueCity: string;
	seats: { id: string; label: string; zoneCode: string; price: string }[];
};
type PaySession = { orderId: string; snapToken: string; clientKey: string };

declare global {
	interface Window {
		snap?: {
			pay: (
				token: string,
				options: {
					onSuccess?: () => void;
					onPending?: () => void;
					onError?: () => void;
					onClose?: () => void;
				},
			) => void;
		};
	}
}

const route = useRoute();
const api = useApi();
const { isLoaded, isSignedIn } = useAuth();
const ticket = ref<Ticket | null>(null);
const isLoading = ref(false);
const isPaying = ref(false);
const errorMessage = ref("");
const paymentNotice = ref("");
const ticketId = computed(() =>
	typeof route.query.ticketId === "string" ? route.query.ticketId : "",
);

// Snap is injected on demand rather than in index.html so the key never ships to visitors
// who are only browsing. The sandbox and production bundles live at different hosts, and the
// SB- prefix on sandbox keys is enough to pick the right one.
function loadSnap(clientKey: string) {
	return new Promise<void>((resolve, reject) => {
		if (window.snap) return resolve();
		const failed = () =>
			reject(new Error("Could not load the Midtrans payment window."));
		const existing = document.getElementById("midtrans-snap");
		if (existing) {
			existing.addEventListener("load", () => resolve());
			existing.addEventListener("error", failed);
			return;
		}
		const script = document.createElement("script");
		script.id = "midtrans-snap";
		script.src = clientKey.startsWith("SB-")
			? "https://app.sandbox.midtrans.com/snap/snap.js"
			: "https://app.midtrans.com/snap/snap.js";
		script.setAttribute("data-client-key", clientKey);
		script.onload = () => resolve();
		script.onerror = failed;
		document.head.appendChild(script);
	});
}

// The browser is never believed about the outcome. This asks our API to re-check with
// Midtrans server-side, which is also what makes the flow work on localhost where the
// webhook cannot reach us.
async function syncPayment(message: string) {
	try {
		await api(`/tickets/${ticketId.value}/payment/sync`, { method: "POST" });
		paymentNotice.value = message;
	} catch {
		paymentNotice.value =
			"Payment sent. Waiting for Midtrans to confirm — this page will show the ticket once it clears.";
	} finally {
		isPaying.value = false;
		await loadTicket();
	}
}

async function pay() {
	if (!ticket.value) return;
	isPaying.value = true;
	errorMessage.value = "";
	paymentNotice.value = "";
	try {
		const session = await api<PaySession>(`/tickets/${ticket.value.id}/pay`, {
			method: "POST",
		});
		const clientKey =
			session.clientKey || import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
		if (!clientKey) throw new Error("Midtrans client key is not configured.");
		await loadSnap(clientKey);
		window.snap?.pay(session.snapToken, {
			onSuccess: () => void syncPayment("Payment received. Your ticket is confirmed."),
			onPending: () => void syncPayment("Payment started. Awaiting confirmation."),
			onError: () => {
				errorMessage.value = "The payment could not be completed.";
				isPaying.value = false;
			},
			onClose: () => {
				isPaying.value = false;
			},
		});
	} catch (error) {
		errorMessage.value =
			error instanceof Error ? error.message : "Unable to start the payment.";
		isPaying.value = false;
	}
}
async function loadTicket() {
	if (!isSignedIn.value || !ticketId.value) return;
	isLoading.value = true;
	errorMessage.value = "";
	try {
		const tickets = await api<Ticket[]>("/me/tickets");
		ticket.value = tickets.find((item) => item.id === ticketId.value) || null;
		if (!ticket.value)
			errorMessage.value = "This seat hold could not be found.";
	} catch (error) {
		errorMessage.value =
			error instanceof Error ? error.message : "Unable to load checkout.";
	} finally {
		isLoading.value = false;
	}
}
onMounted(loadTicket);
watch([isSignedIn, ticketId], loadTicket);
</script>

<template>
	<div class="min-h-screen bg-[#f5f0e8] font-['Space_Grotesk'] text-[#1a1a1a]">
		<Header />
		<main class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
			<h1 class="mb-8 text-5xl font-bold uppercase sm:text-7xl">Checkout</h1>
			<div
				v-if="!isLoaded || isLoading"
				class="border-4 border-[#1a1a1a] bg-white p-8 font-bold uppercase"
			>
				Loading checkout…
			</div>
			<section
				v-else-if="!isSignedIn"
				class="border-4 border-[#1a1a1a] bg-white p-8"
			>
				<h2 class="mb-4 text-2xl font-bold uppercase">Sign in to continue</h2>
				<RouterLink
					:to="{ name: 'login', query: { redirect: route.fullPath } }"
					class="inline-block bg-[#e63b2e] px-5 py-3 font-bold uppercase text-white"
					>Sign in</RouterLink
				>
			</section>
			<section
				v-else-if="errorMessage || !ticket"
				class="border-4 border-[#e63b2e] bg-white p-8 font-bold uppercase text-[#e63b2e]"
			>
				{{ errorMessage || "No seat hold was selected." }}
			</section>
			<section v-else class="grid gap-8 lg:grid-cols-[1fr_22rem]">
				<div
					class="border-4 border-[#1a1a1a] bg-white p-5 shadow-[8px_8px_0_0_#1a1a1a] sm:p-8"
				>
					<h2 class="mb-5 text-3xl font-bold uppercase">Your seat hold</h2>
					<p class="mb-2 text-xl font-bold">{{ ticket.eventTitle }}</p>
					<p class="mb-6 font-['Inter']">
						{{ formatEventDate(ticket.startsAt) }} · {{ ticket.venueName }},
						{{ ticket.venueCity }}
					</p>
					<ul class="space-y-3 border-t-2 border-[#1a1a1a] pt-5">
						<li
							v-for="seat in ticket.seats"
							:key="seat.id"
							class="flex justify-between"
						>
							<span class="font-bold"
								>Seat {{ seat.label }} · Zone {{ seat.zoneCode }}</span
							><span>{{ formatCurrency(seat.price, ticket.currency) }}</span>
						</li>
					</ul>
					<div
						v-if="ticket.status === 'paid'"
						class="mt-8 border-2 border-[#0055ff] bg-[#dbe7ff] p-4 font-['Inter'] text-sm"
					>
						<b class="block font-['Space_Grotesk'] uppercase"
							>Ticket confirmed</b
						>This order is paid and your seats are booked. You can find it under
						My Tickets.
					</div>
					<div
						v-else
						class="mt-8 border-2 border-[#e63b2e] bg-[#ffdad6] p-4 font-['Inter'] text-sm"
					>
						<b class="block font-['Space_Grotesk'] uppercase"
							>Sandbox payments (no real money)</b
						>This checkout runs against the Midtrans sandbox. Nothing is charged
						and no real card works here. Pay with the test card
						<code class="bg-white px-1 font-bold">4811 1111 1111 1114</code>, any
						future expiry, CVV <b>123</b>, and OTP <b>112233</b>.
					</div>
				</div>
				<aside
					class="h-fit border-4 border-[#1a1a1a] bg-[#1a1a1a] p-6 text-white shadow-[8px_8px_0_0_#ffcc00]"
				>
					<h2
						class="mb-5 border-b-2 border-gray-700 pb-3 text-2xl font-bold uppercase"
					>
						Order summary
					</h2>
					<div class="flex justify-between text-lg font-bold text-[#ffcc00]">
						<span>Total</span
						><span>{{ formatCurrency(ticket.total, ticket.currency) }}</span>
					</div>
					<p
						v-if="ticket.expiresAt && ticket.status === 'pending'"
						class="mt-5 text-sm text-gray-300"
					>
						Seat hold expires
						{{
							formatEventDate(ticket.expiresAt, {
								month: "short",
								day: "numeric",
								hour: "numeric",
								minute: "2-digit",
							})
						}}.
					</p>
					<p
						v-if="paymentNotice"
						class="mt-5 border-2 border-[#ffcc00] p-3 text-sm font-bold text-[#ffcc00]"
					>
						{{ paymentNotice }}
					</p>
					<button
						v-if="ticket.status === 'pending'"
						type="button"
						:disabled="isPaying"
						class="mt-6 w-full border-2 border-[#ffcc00] bg-[#e63b2e] px-4 py-4 text-xl font-bold uppercase text-white disabled:opacity-50"
						@click="pay"
					>
						{{ isPaying ? "Opening payment…" : "Pay now" }}
					</button>
					<RouterLink
						to="/tickets"
						class="mt-6 block bg-[#ffcc00] px-4 py-3 text-center font-bold uppercase text-[#1a1a1a]"
						>View my tickets</RouterLink
					>
				</aside>
			</section>
		</main>
		<Footer />
	</div>
</template>
