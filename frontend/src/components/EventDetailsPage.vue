<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { CalendarIcon, ClockIcon, MapPinIcon } from "@heroicons/vue/24/outline";
import Footer from "./Footer.vue";
import Header from "./Header.vue";
import { apiRequest } from "@/lib/api";
import { formatCurrency, formatEventDate, formatTime } from "@/lib/format";

type EventDetail = {
	id: string; title: string; category: string; badgeText: string | null; summary: string | null; description: string | null;
	heroImageUrl: string | null; startsAt: string; endsAt: string | null; doorsAt: string | null; currency: string;
	venue: { id: string; name: string; city: string; address: string; imageUrl: string | null };
	images: { id: string; imageUrl: string; altText: string | null }[];
	lineup: { id: string; name: string; role: string | null; imageUrl: string | null }[];
	pricing: { minPrice: string | null; maxPrice: string | null; availableSeats: number };
};

const route = useRoute();
const event = ref<EventDetail | null>(null);
const isLoading = ref(true);
const errorMessage = ref("");
const gallery = computed(() => event.value ? [event.value.heroImageUrl, ...event.value.images.map((image) => image.imageUrl)].filter(Boolean) as string[] : []);

async function loadEvent() {
	isLoading.value = true; errorMessage.value = "";
	try { event.value = await apiRequest<EventDetail>(`/events/${encodeURIComponent(String(route.params.id))}`); }
	catch (error) { errorMessage.value = error instanceof Error ? error.message : "Unable to load this event."; event.value = null; }
	finally { isLoading.value = false; }
}
onMounted(loadEvent);
watch(() => route.params.id, loadEvent);
</script>

<template>
	<div class="min-h-screen bg-[#f5f0e8] font-['Space_Grotesk'] text-[#1a1a1a]">
		<Header />
		<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
			<div v-if="isLoading" class="border-4 border-[#1a1a1a] bg-white p-8 font-bold uppercase">Loading event…</div>
			<div v-else-if="errorMessage" class="border-4 border-[#e63b2e] bg-white p-8 font-bold uppercase text-[#e63b2e]">{{ errorMessage }}</div>
			<template v-else-if="event">
				<section class="mb-8 overflow-hidden border-4 border-[#1a1a1a] bg-[#1a1a1a] shadow-[10px_10px_0_0_#1a1a1a] lg:mb-12 lg:grid lg:grid-cols-2">
					<div class="p-6 text-white sm:p-10"><span class="mb-5 inline-block border-2 border-[#1a1a1a] bg-[#ffcc00] px-3 py-1 text-sm font-bold uppercase text-[#1a1a1a]">{{ event.badgeText || event.category }}</span><p class="mb-3 font-bold uppercase text-[#ffcc00]">{{ event.category }}</p><h1 class="mb-6 text-4xl font-black uppercase leading-none sm:text-6xl lg:text-7xl">{{ event.title }}</h1><p class="max-w-xl text-base font-bold sm:text-xl">{{ event.summary || event.description || 'Details will be announced soon.' }}</p></div>
					<img :src="event.heroImageUrl || '/imgHeroBg.webp'" :alt="event.title" class="h-64 w-full object-cover sm:h-96 lg:h-full" />
				</section>

				<div class="grid gap-8 lg:grid-cols-[1fr_22rem]">
					<div class="space-y-10">
						<section><h2 class="mb-5 inline-block border-b-4 border-[#1a1a1a] pb-1 text-3xl font-bold uppercase sm:text-4xl">Overview</h2><p class="max-w-3xl whitespace-pre-line font-['Inter'] text-base leading-relaxed sm:text-lg">{{ event.description || event.summary || 'Event information will be published soon.' }}</p></section>
						<section v-if="gallery.length"><h2 class="mb-5 inline-block border-b-4 border-[#e63b2e] pb-1 text-3xl font-bold uppercase sm:text-4xl">Gallery</h2><div class="grid grid-cols-1 gap-4 sm:grid-cols-2"><img v-for="(image, index) in gallery" :key="image" :src="image" :alt="`${event.title} image ${index + 1}`" class="h-56 w-full border-2 border-[#1a1a1a] object-cover shadow-[4px_4px_0_0_#1a1a1a]" /></div></section>
						<section v-if="event.lineup.length"><h2 class="mb-5 inline-block border-b-4 border-[#0055ff] pb-1 text-3xl font-bold uppercase sm:text-4xl">Lineup</h2><div class="grid gap-4 sm:grid-cols-2"><div v-for="artist in event.lineup" :key="artist.id" class="flex items-center gap-4 border-2 border-[#1a1a1a] bg-white p-4 shadow-[4px_4px_0_0_#1a1a1a]"><img v-if="artist.imageUrl" :src="artist.imageUrl" :alt="artist.name" class="size-14 object-cover" /><div><p class="text-xl font-bold uppercase">{{ artist.name }}</p><p class="text-sm font-bold uppercase text-[#0055ff]">{{ artist.role || 'Performer' }}</p></div></div></div></section>
						<section><h2 class="mb-5 inline-block border-b-4 border-[#1a1a1a] pb-1 text-3xl font-bold uppercase sm:text-4xl">Location</h2><RouterLink :to="{ name: 'venue-details', params: { id: event.venue.id } }" class="block border-4 border-[#1a1a1a] bg-white p-5 shadow-[6px_6px_0_0_#1a1a1a]"><MapPinIcon class="mb-3 size-8" /><p class="text-xl font-bold uppercase">{{ event.venue.name }}</p><p class="font-['Inter']">{{ event.venue.address }}, {{ event.venue.city }}</p></RouterLink></section>
					</div>
					<aside><div class="border-4 border-[#1a1a1a] bg-white p-5 shadow-[8px_8px_0_0_#1a1a1a] lg:sticky lg:top-28 sm:p-6"><h2 class="mb-5 border-b-4 border-[#1a1a1a] pb-2 text-2xl font-black uppercase">Event details</h2><dl class="mb-5 space-y-4"><div class="flex gap-3"><CalendarIcon class="size-6 shrink-0" /><div><dt class="text-xs font-bold uppercase text-gray-500">Date</dt><dd class="font-bold">{{ formatEventDate(event.startsAt) }}</dd></div></div><div class="flex gap-3"><ClockIcon class="size-6 shrink-0" /><div><dt class="text-xs font-bold uppercase text-gray-500">Time</dt><dd class="font-bold">{{ formatTime(event.startsAt) }}<template v-if="event.endsAt"> – {{ formatTime(event.endsAt) }}</template></dd></div></div><div class="flex gap-3"><MapPinIcon class="size-6 shrink-0" /><div><dt class="text-xs font-bold uppercase text-gray-500">Venue</dt><dd class="font-bold">{{ event.venue.name }}</dd></div></div></dl><div class="mb-5 border-2 border-[#1a1a1a] bg-[#eee9e0] p-3"><p class="text-xs font-bold uppercase">From</p><p class="text-2xl font-black">{{ formatCurrency(event.pricing.minPrice, event.currency) }}</p><p class="text-xs font-bold uppercase text-gray-500">{{ event.pricing.availableSeats }} seats available</p></div><RouterLink :to="{ name: 'seat-selection', params: { eventId: event.id } }" class="block border-4 border-[#1a1a1a] bg-[#e63b2e] px-5 py-3 text-center text-xl font-black uppercase text-white shadow-[5px_5px_0_0_#1a1a1a] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#1a1a1a]">Select seats</RouterLink></div></aside>
				</div>
			</template>
		</main>
		<Footer />
	</div>
</template>
