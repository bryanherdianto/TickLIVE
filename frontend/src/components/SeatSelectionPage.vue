<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useAuth } from "@clerk/vue";
import { useRoute, useRouter } from "vue-router";
import { CalendarIcon, CheckCircleIcon, InformationCircleIcon, MapPinIcon, TrashIcon, UserIcon } from "@heroicons/vue/24/outline";
import Footer from "./Footer.vue";
import Header from "./Header.vue";
import { apiRequest, useApi } from "@/lib/api";
import { formatCurrency, formatEventDate, formatTime } from "@/lib/format";

type Seat = { id: string; zoneCode: string; label: string; price: string; status: "available" | "held" | "booked" | "unavailable" };
type SeatResponse = { event: { id: string; title: string; currency: string }; seats: Seat[] };
type EventDetail = { id: string; title: string; startsAt: string; currency: string; heroImageUrl: string | null; venue: { name: string; city: string; address: string } };
type TicketHold = { id: string; expires_at: string; total: string; currency: string };

const route = useRoute();
const router = useRouter();
const api = useApi();
const { isSignedIn } = useAuth();
const event = ref<EventDetail | null>(null);
const seats = ref<Seat[]>([]);
const selectedSeatIds = ref<string[]>([]);
const isLoading = ref(true);
const isSubmitting = ref(false);
const errorMessage = ref("");
const notice = ref("");

const zones = computed(() => [...new Set(seats.value.map((seat) => seat.zoneCode))].sort().map((zoneCode, index) => ({ zoneCode, name: `Zone ${zoneCode}`, color: index % 2 === 0 ? "bg-[#e63b2e]" : "bg-[#0055ff]", seats: seats.value.filter((seat) => seat.zoneCode === zoneCode) })));
const selectedSeats = computed(() => seats.value.filter((seat) => selectedSeatIds.value.includes(seat.id)));
const totalPrice = computed(() => selectedSeats.value.reduce((total, seat) => total + Number(seat.price), 0));

function selected(seat: Seat) { return selectedSeatIds.value.includes(seat.id); }
function toggleSeat(seat: Seat) {
	if (seat.status !== "available") return;
	selectedSeatIds.value = selected(seat) ? selectedSeatIds.value.filter((id) => id !== seat.id) : [...selectedSeatIds.value, seat.id];
}
function seatClass(seat: Seat, color: string) {
	if (selected(seat)) return "bg-[#ffcc00] scale-110 z-10 shadow-[0_0_0_2px_#1a1a1a_inset]";
	return seat.status === "available" ? color : "bg-gray-400 cursor-not-allowed opacity-50";
}

async function loadSeatMap() {
	isLoading.value = true; errorMessage.value = ""; selectedSeatIds.value = [];
	try {
		const id = encodeURIComponent(String(route.params.eventId));
		const [eventResult, seatsResult] = await Promise.all([apiRequest<EventDetail>(`/events/${id}`), apiRequest<SeatResponse>(`/events/${id}/seats`)]);
		event.value = eventResult; seats.value = seatsResult.seats;
	} catch (error) { errorMessage.value = error instanceof Error ? error.message : "Unable to load the seat map."; }
	finally { isLoading.value = false; }
}

async function beginCheckout() {
	if (!isSignedIn.value) { await router.push({ name: "login", query: { redirect: route.fullPath } }); return; }
	if (!selectedSeatIds.value.length) return;
	isSubmitting.value = true; errorMessage.value = "";
	try {
		const hold = await api<TicketHold>("/tickets", { method: "POST", body: { seatIds: selectedSeatIds.value } });
		notice.value = "Your seats are held for 15 minutes.";
		await router.push({ name: "checkout", query: { ticketId: hold.id } });
	} catch (error) { errorMessage.value = error instanceof Error ? error.message : "Unable to hold these seats."; await loadSeatMap(); }
	finally { isSubmitting.value = false; }
}
onMounted(loadSeatMap); watch(() => route.params.eventId, loadSeatMap);
</script>

<template>
	<div class="min-h-screen bg-[#f5f0e8] font-['Space_Grotesk'] text-[#1a1a1a]"><Header /><main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12"><div v-if="isLoading" class="border-4 border-[#1a1a1a] bg-white p-8 font-bold uppercase">Loading seat map…</div><div v-else-if="errorMessage && !event" class="border-4 border-[#e63b2e] bg-white p-8 font-bold uppercase text-[#e63b2e]">{{ errorMessage }}</div><template v-else-if="event"><div class="mb-6 border-l-4 border-[#1a1a1a] pl-4 sm:mb-8 sm:pl-6"><h1 class="mb-2 text-4xl font-bold uppercase sm:text-6xl">Select your seats</h1><h2 class="mb-3 text-lg font-bold text-[#0055ff] sm:text-2xl">{{ event.title }}</h2><div class="flex flex-wrap gap-4 font-['Inter'] text-sm"><span class="flex items-center gap-2"><CalendarIcon class="size-5" />{{ formatEventDate(event.startsAt) }} · {{ formatTime(event.startsAt) }}</span><span class="flex items-center gap-2"><MapPinIcon class="size-5" />{{ event.venue.name }}, {{ event.venue.city }}</span></div></div><p v-if="errorMessage" class="mb-5 border-2 border-[#e63b2e] bg-white p-3 font-bold text-[#e63b2e]">{{ errorMessage }}</p><p v-if="notice" class="mb-5 border-2 border-[#0055ff] bg-white p-3 font-bold text-[#0055ff]">{{ notice }}</p><div class="flex flex-col gap-6 lg:flex-row"><section class="min-w-0 flex-1"><div class="relative overflow-hidden border-[3px] border-[#1a1a1a] bg-[#eee9e0] p-4 shadow-[8px_8px_0_0_#1a1a1a] sm:p-6 md:p-8"><div class="mx-auto max-w-2xl border-b-[6px] border-[#ffcc00] bg-[#1a1a1a] px-4 py-3 text-center font-bold tracking-widest text-white">STAGE</div><div class="my-5 flex flex-wrap gap-3 border-2 border-[#1a1a1a] bg-white/70 p-3 text-sm font-bold"><span class="flex items-center gap-2"><i class="size-4 border-2 border-[#1a1a1a] bg-[#e63b2e]"></i>Available</span><span class="flex items-center gap-2"><i class="size-4 border-2 border-[#1a1a1a] bg-gray-400"></i>Unavailable</span><span class="flex items-center gap-2"><i class="size-4 border-2 border-[#1a1a1a] bg-[#ffcc00]"></i>Selected</span></div><div v-if="zones.length" class="space-y-8 py-4"><section v-for="zone in zones" :key="zone.zoneCode" class="text-center"><h3 class="mb-4 inline-block border-2 border-[#1a1a1a] bg-white px-4 py-1 text-lg font-bold shadow-[2px_2px_0_0_#1a1a1a]">{{ zone.name }}</h3><div class="flex flex-wrap justify-center gap-3 sm:gap-4"><button v-for="seat in zone.seats" :key="seat.id" type="button" :disabled="seat.status !== 'available'" :title="`${seat.label} – ${formatCurrency(seat.price, event!.currency)}`" :class="['relative flex size-8 items-center justify-center border-2 border-[#1a1a1a] transition-all sm:size-10', seatClass(seat, zone.color)]" @click="toggleSeat(seat)"><span v-if="selected(seat)" class="absolute -right-2 -top-2 rounded-full bg-[#1a1a1a] p-0.5 text-[#ffcc00]"><CheckCircleIcon class="size-3" /></span><span class="text-[10px] font-bold">{{ seat.label.replace(zone.zoneCode, '') }}</span></button></div></section></div><p v-else class="border-2 border-[#1a1a1a] bg-white p-6 text-center font-bold uppercase">This event has no published seat map yet.</p></div></section><aside class="w-full lg:w-96"><div class="border-[3px] border-[#1a1a1a] bg-[#1a1a1a] p-4 text-[#f5f0e8] shadow-[8px_8px_0_0_#ffcc00] sm:p-6"><h2 class="mb-5 border-b-2 border-dashed border-gray-700 pb-4 text-2xl font-bold uppercase">Your tickets</h2><div v-if="selectedSeats.length === 0" class="border-2 border-dashed border-gray-700 py-8 text-center text-gray-400"><UserIcon class="mx-auto mb-2 size-10" /><p>No seats selected yet.</p></div><template v-else><ul class="mb-5 space-y-3"><li v-for="seat in selectedSeats" :key="seat.id" class="flex items-center justify-between bg-[#2a2a2a] p-3"><span><b class="block">Seat {{ seat.label }}</b><small class="text-gray-400">Zone {{ seat.zoneCode }}</small></span><span class="flex items-center gap-3 font-bold text-[#ffcc00]">{{ formatCurrency(seat.price, event.currency) }}<button type="button" aria-label="Remove seat" @click="toggleSeat(seat)"><TrashIcon class="size-5 text-gray-400 hover:text-[#e63b2e]" /></button></span></li></ul><div class="border-t-2 border-dashed border-gray-700 pt-4"><div class="flex justify-between text-gray-400"><span>Tickets ({{ selectedSeats.length }})</span><span>{{ formatCurrency(totalPrice, event.currency) }}</span></div><div class="mt-2 flex justify-between border-t border-gray-700 pt-3 text-xl font-bold text-[#ffcc00]"><span>Total</span><span>{{ formatCurrency(totalPrice, event.currency) }}</span></div></div><button type="button" :disabled="isSubmitting" class="mt-5 w-full bg-[#ffcc00] px-5 py-4 text-xl font-bold uppercase text-[#1a1a1a] disabled:opacity-50" @click="beginCheckout">{{ isSubmitting ? 'Holding seats…' : 'Checkout now' }}</button><p class="mt-3 text-center text-xs text-gray-400">Seats are held for 15 minutes before payment.</p></template></div><div class="mt-6 border-[3px] border-[#1a1a1a] bg-white p-4 shadow-[5px_5px_0_0_#1a1a1a]"><h3 class="mb-3 flex items-center gap-2 border-b-2 border-[#1a1a1a] pb-2 font-bold uppercase"><InformationCircleIcon class="size-5" />Venue info</h3><p class="text-sm"><b>Address:</b> {{ event.venue.address }}, {{ event.venue.city }}</p></div></aside></div></template></main><Footer /></div>
</template>
