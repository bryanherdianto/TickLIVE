<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { ChevronDownIcon, MapPinIcon } from "@heroicons/vue/24/outline";
import Footer from "./Footer.vue";
import Header from "./Header.vue";
import { apiRequest } from "@/lib/api";
import { formatCurrency, formatEventDate } from "@/lib/format";

type EventCard = {
	id: string;
	title: string;
	slug: string;
	category: string;
	badgeText: string | null;
	heroImageUrl: string | null;
	startsAt: string;
	currency: string;
	minPrice: string | null;
	venue: { name: string; city: string; address: string };
};

const events = ref<EventCard[]>([]);
const selectedCategories = ref<string[]>([]);
const city = ref("");
const filtersOpen = ref(false);
const isLoading = ref(true);
const errorMessage = ref("");

const categories = computed(() => [...new Set(events.value.map((event) => event.category))].sort());
const visibleEvents = computed(() => events.value.filter((event) =>
	(selectedCategories.value.length === 0 || selectedCategories.value.includes(event.category)) &&
	(!city.value || `${event.venue.city} ${event.venue.address}`.toLowerCase().includes(city.value.toLowerCase())),
));

function badgeColor(category: string) {
	if (/art/i.test(category)) return "bg-[#05f] text-white";
	if (/sport/i.test(category)) return "bg-[#e63b2e] text-white";
	return "bg-[#1a1a1a] text-white";
}

function clearFilters() {
	selectedCategories.value = [];
	city.value = "";
}

async function loadEvents() {
	isLoading.value = true;
	errorMessage.value = "";
	try {
		events.value = await apiRequest<EventCard[]>("/events?limit=50");
	} catch (error) {
		errorMessage.value = error instanceof Error ? error.message : "Unable to load events.";
	} finally {
		isLoading.value = false;
	}
}

onMounted(loadEvents);
</script>

<template>
	<div class="min-h-screen bg-[#f5f0e8] font-['Space_Grotesk'] text-[#1a1a1a]">
		<Header />
		<div class="flex flex-col lg:flex-row pt-4 sm:pt-6">
			<aside class="w-full shrink-0 border-b-4 border-[#1a1a1a] px-4 py-4 lg:w-80 lg:border-b-0 lg:border-r-4 lg:px-8 lg:py-8">
				<button type="button" class="flex w-full items-center justify-between border-2 border-[#1a1a1a] px-4 py-3 text-left text-lg font-bold uppercase lg:hidden" @click="filtersOpen = !filtersOpen">
					Filters
					<ChevronDownIcon class="size-6 transition-transform" :class="{ 'rotate-180': filtersOpen }" />
				</button>
				<div :class="[filtersOpen ? 'flex' : 'hidden', 'lg:flex flex-col gap-8 pt-4 lg:pt-0']">
					<div>
						<h2 class="border-b-2 border-[#1a1a1a] pb-2 text-lg font-bold uppercase">Category</h2>
						<label v-for="category in categories" :key="category" class="mt-3 flex cursor-pointer items-center gap-3 font-bold uppercase">
							<input v-model="selectedCategories" :value="category" type="checkbox" class="size-5 appearance-none border-2 border-[#1a1a1a] bg-white checked:bg-[#1a1a1a]" />
							{{ category }}
						</label>
					</div>
					<div>
						<label class="mb-3 block border-b-2 border-[#1a1a1a] pb-2 text-lg font-bold uppercase" for="event-city">Location</label>
						<div class="flex items-center border-2 border-[#1a1a1a] bg-white px-3">
							<input id="event-city" v-model="city" type="search" placeholder="All cities" class="h-11 min-w-0 flex-1 bg-transparent font-bold uppercase outline-none" />
							<MapPinIcon class="size-5 shrink-0" />
						</div>
					</div>
					<button type="button" class="bg-[#1a1a1a] py-4 font-bold uppercase text-white hover:bg-black" @click="clearFilters">Clear all</button>
				</div>
			</aside>

			<main class="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">
				<div class="mx-auto max-w-5xl">
					<h1 class="mb-8 text-5xl font-bold uppercase tracking-tighter sm:mb-12 sm:text-7xl lg:text-8xl">Events</h1>
					<div class="grid grid-cols-1 gap-5 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
						<div v-if="isLoading" class="col-span-full border-4 border-[#1a1a1a] bg-white p-8 font-bold uppercase">Loading events…</div>
						<div v-else-if="errorMessage" class="col-span-full border-4 border-[#e63b2e] bg-white p-8 font-bold uppercase text-[#e63b2e]">{{ errorMessage }}</div>
						<div v-else-if="visibleEvents.length === 0" class="col-span-full border-4 border-[#1a1a1a] bg-white p-8 font-bold uppercase">No events match these filters yet.</div>
						<RouterLink v-for="event in visibleEvents" :key="event.id" :to="{ name: 'event-details', params: { id: event.slug || event.id } }" class="group flex flex-col overflow-hidden border-4 border-[#1a1a1a] bg-white p-1 shadow-[8px_8px_0px_0px_#1a1a1a] transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_#1a1a1a]">
							<div class="relative h-52 overflow-hidden border-b-4 border-[#1a1a1a] sm:h-64">
								<img :src="event.heroImageUrl || '/imgHeroBg.webp'" :alt="event.title" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
								<span :class="['absolute left-4 top-4 px-3 py-1 text-sm font-bold uppercase', badgeColor(event.category)]">{{ event.badgeText || 'On sale' }}</span>
								<span class="absolute bottom-4 right-4 border-2 border-[#1a1a1a] bg-[#fc0] px-3 py-2 text-lg font-bold">{{ formatCurrency(event.minPrice, event.currency) }}</span>
							</div>
							<div class="flex grow flex-col p-4">
								<div class="mb-3 flex justify-between gap-3 text-sm font-bold uppercase"><span class="text-[#05f]">{{ event.category }}</span><span>{{ formatEventDate(event.startsAt, { month: 'short', day: 'numeric' }) }}</span></div>
								<h2 class="mb-6 text-2xl font-bold uppercase leading-tight">{{ event.title }}</h2>
								<div class="mt-auto flex items-center gap-2 text-sm font-bold uppercase text-[#4a4a4a]"><MapPinIcon class="size-4 shrink-0" />{{ event.venue.name }}, {{ event.venue.city }}</div>
								<span class="mt-5 block border-2 border-[#1a1a1a] py-3 text-center text-base font-bold uppercase transition-colors group-hover:bg-[#1a1a1a] group-hover:text-white">Get tickets</span>
							</div>
						</RouterLink>
					</div>
				</div>
			</main>
		</div>
		<Footer />
	</div>
</template>
