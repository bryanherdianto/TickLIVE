<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useAuth } from "@clerk/vue";
import { RouterLink, useRouter } from "vue-router";
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
	eventId: string;
	eventTitle: string;
	startsAt: string;
	heroImageUrl: string | null;
	venueName: string;
	venueCity: string;
	seats: { id: string; label: string; zoneCode: string; price: string }[];
};
const api = useApi();
const router = useRouter();
const { isLoaded, isSignedIn } = useAuth();
const tickets = ref<Ticket[]>([]);
const query = ref("");
const isLoading = ref(false);
const errorMessage = ref("");
const filteredTickets = computed(() =>
	tickets.value.filter((ticket) =>
		`${ticket.eventTitle} ${ticket.venueName} ${ticket.status}`
			.toLowerCase()
			.includes(query.value.toLowerCase()),
	),
);
const upcomingTickets = computed(
	() =>
		tickets.value.filter((ticket) => new Date(ticket.startsAt) >= new Date())
			.length,
);

function statusLabel(status: string) {
	return status === "paid"
		? "Confirmed"
		: status === "pending"
			? "Continue checkout"
			: status;
}
function statusClass(status: string) {
	return status === "paid"
		? "bg-[#ffcc00]"
		: status === "pending"
			? "bg-[#d6e3ff]"
			: "bg-gray-200";
}
function continueCheckout(ticket: Ticket) {
	if (ticket.status === "pending")
		router.push({ name: "checkout", query: { ticketId: ticket.id } });
}
async function loadTickets() {
	if (!isSignedIn.value) return;
	isLoading.value = true;
	errorMessage.value = "";
	try {
		tickets.value = await api<Ticket[]>("/me/tickets");
	} catch (error) {
		errorMessage.value =
			error instanceof Error ? error.message : "Unable to load your tickets.";
	} finally {
		isLoading.value = false;
	}
}
onMounted(loadTickets);
watch(isSignedIn, loadTickets);
</script>

<template>
	<div class="min-h-screen bg-[#f5f0e8] font-['Space_Grotesk'] text-[#1a1a1a]">
		<Header />
		<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
			<section class="mb-8 sm:mb-12">
				<h1
					class="mb-4 text-5xl font-bold leading-none sm:text-7xl md:text-[96px]"
				>
					My Tickets
				</h1>
				<p
					class="max-w-2xl border-l-4 border-[#1a1a1a] pl-4 font-['Inter'] sm:pl-6 sm:text-xl"
				>
					Manage your upcoming experiences and digital entry passes.
				</p>
			</section>
			<div
				v-if="!isLoaded"
				class="border-2 border-[#1a1a1a] bg-white p-6 font-bold uppercase"
			>
				Loading account…
			</div>
			<section
				v-else-if="!isSignedIn"
				class="border-4 border-[#1a1a1a] bg-white p-8 shadow-[6px_6px_0_0_#1a1a1a]"
			>
				<h2 class="mb-3 text-2xl font-bold uppercase">
					Sign in to see your tickets
				</h2>
				<RouterLink
					:to="{ name: 'login', query: { redirect: '/tickets' } }"
					class="inline-block bg-[#e63b2e] px-5 py-3 font-bold uppercase text-white"
					>Sign in</RouterLink
				>
			</section>
			<template v-else>
				<section
					class="mb-8 flex flex-col gap-5 sm:mb-12 lg:flex-row lg:items-end lg:justify-between"
				>
					<div class="flex gap-4">
						<div
							class="w-36 border border-[#1a1a1a] bg-[#ffcc00] p-4 shadow-[4px_4px_0_0_#1a1a1a]"
						>
							<p class="text-3xl font-bold">{{ tickets.length }}</p>
							<p class="text-xs font-bold uppercase">Total orders</p>
						</div>
						<div
							class="w-36 border border-[#1a1a1a] bg-white p-4 shadow-[4px_4px_0_0_#1a1a1a]"
						>
							<p class="text-3xl font-bold">{{ upcomingTickets }}</p>
							<p class="text-xs font-bold uppercase">Upcoming</p>
						</div>
					</div>
					<input
						v-model="query"
						type="search"
						placeholder="Search tickets…"
						class="w-full border-2 border-[#1a1a1a] bg-white px-4 py-3 font-bold sm:w-64"
					/>
				</section>
				<section
					class="overflow-hidden border-2 border-[#1a1a1a] bg-white shadow-[8px_8px_0_0_#1a1a1a]"
				>
					<div v-if="isLoading" class="p-8 font-bold uppercase">
						Loading tickets…
					</div>
					<div
						v-else-if="errorMessage"
						class="p-8 font-bold uppercase text-[#e63b2e]"
					>
						{{ errorMessage }}
					</div>
					<div
						v-else-if="filteredTickets.length === 0"
						class="p-8 font-bold uppercase"
					>
						No ticket orders yet. Find an event and select your seats.
					</div>
					<div v-else class="divide-y-2 divide-[#1a1a1a]">
						<article
							v-for="ticket in filteredTickets"
							:key="ticket.id"
							:class="[
								'grid grid-cols-1 gap-4 p-4 sm:p-6 md:grid-cols-[1fr_auto_auto] md:items-center',
								ticket.status === 'pending'
									? 'cursor-pointer hover:bg-[#fff7cf]'
									: 'hover:bg-[#faf7f2]',
							]"
							:role="ticket.status === 'pending' ? 'link' : undefined"
							:tabindex="ticket.status === 'pending' ? 0 : undefined"
							@click="continueCheckout(ticket)"
							@keydown.enter="continueCheckout(ticket)"
						>
							<div class="flex gap-4">
								<img
									:src="ticket.heroImageUrl || '/imgHeroBg.webp'"
									:alt="ticket.eventTitle"
									class="size-16 border border-[#1a1a1a] object-cover sm:size-20"
								/>
								<div>
									<h2 class="text-lg font-bold">{{ ticket.eventTitle }}</h2>
									<p class="font-['Inter'] text-sm text-gray-600">
										{{ formatEventDate(ticket.startsAt) }} ·
										{{ ticket.venueName }}, {{ ticket.venueCity }}
									</p>
									<p class="mt-1 text-xs font-bold uppercase">
										{{ ticket.seats.length }} seat{{
											ticket.seats.length === 1 ? "" : "s"
										}}: {{ ticket.seats.map((seat) => seat.label).join(", ") }}
									</p>
								</div>
							</div>
							<div class="flex justify-between gap-4 md:block md:text-center">
								<span class="md:hidden font-bold uppercase">Price</span
								><span class="font-bold">{{
									formatCurrency(ticket.total, ticket.currency)
								}}</span>
							</div>
							<div class="flex flex-col items-start gap-2 md:items-center">
								<span
									:class="[
										'border border-[#1a1a1a] px-3 py-1 text-sm font-bold shadow-[2px_2px_0_0_#1a1a1a]',
										statusClass(ticket.status),
									]"
									>{{ statusLabel(ticket.status) }}</span
								><small
									v-if="ticket.status === 'pending' && ticket.expiresAt"
									class="text-center font-bold text-[#e63b2e]"
									>Hold expires
									{{
										formatEventDate(ticket.expiresAt, {
											hour: "numeric",
											minute: "2-digit",
										})
									}}</small
								>
							</div>
						</article>
					</div>
				</section>
			</template>
		</main>
		<Footer />
	</div>
</template>
