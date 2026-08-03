<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { ArrowRightIcon } from "@heroicons/vue/20/solid";
import Header from "./Header.vue";
import Footer from "./Footer.vue";
import { apiRequest } from "@/lib/api";

type Venue = {
	id: string;
	name: string;
	slug: string;
	city: string;
	address: string;
	capacity: number;
	imageUrl: string | null;
	currentEvent: string | null;
};
const venues = ref<Venue[]>([]);
const query = ref("");
const isLoading = ref(true);
const errorMessage = ref("");
const visibleVenues = computed(() =>
	venues.value.filter((venue) =>
		`${venue.name} ${venue.city}`
			.toLowerCase()
			.includes(query.value.toLowerCase()),
	),
);

async function loadVenues() {
	isLoading.value = true;
	errorMessage.value = "";
	try {
		venues.value = await apiRequest<Venue[]>("/venues");
	} catch (error) {
		errorMessage.value =
			error instanceof Error ? error.message : "Unable to load venues.";
	} finally {
		isLoading.value = false;
	}
}
onMounted(loadVenues);
</script>

<template>
	<div class="min-h-screen bg-[#f5f0e8] font-['Space_Grotesk'] text-[#1a1a1a]">
		<Header />
		<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
			<section
				class="mb-10 overflow-hidden border-2 border-[#1a1a1a] bg-[#faf7f2] shadow-[8px_8px_0_0_#1a1a1a] lg:mb-16 lg:flex"
			>
				<div class="p-6 lg:w-7/12 lg:p-12">
					<h1
						class="mb-6 text-5xl font-black uppercase leading-none tracking-tighter sm:text-6xl lg:text-8xl"
					>
						Space<br /><span class="text-[#e63b2e]">Defined.</span>
					</h1>
					<p
						class="max-w-lg border-l-4 border-[#0055ff] pl-5 text-lg font-bold sm:text-xl"
					>
						Discover spaces for sound, soul, and subculture. Venue data is
						loaded directly from Tickify.
					</p>
				</div>
				<div
					class="relative h-56 overflow-hidden bg-[#0055ff] lg:h-auto lg:w-5/12"
				>
					<img
						src="/imgVenueHero.webp"
						alt="Venue crowd"
						class="h-full w-full object-cover grayscale"
					/>
				</div>
			</section>

			<section class="mb-8 border-b-2 border-[#1a1a1a] pb-6 sm:mb-12">
				<input
					v-model="query"
					type="search"
					placeholder="Search spaces…"
					class="w-full bg-white px-4 py-3 font-bold uppercase outline-none ring-2 ring-[#1a1a1a] sm:w-80"
				/>
			</section>
			<section
				class="grid grid-cols-1 gap-6 py-4 md:grid-cols-2 lg:grid-cols-3"
			>
				<div
					v-if="isLoading"
					class="col-span-full border-2 border-[#1a1a1a] bg-white p-8 font-bold uppercase"
				>
					Loading venues…
				</div>
				<div
					v-else-if="errorMessage"
					class="col-span-full border-2 border-[#e63b2e] bg-white p-8 font-bold uppercase text-[#e63b2e]"
				>
					{{ errorMessage }}
				</div>
				<div
					v-else-if="visibleVenues.length === 0"
					class="col-span-full border-2 border-[#1a1a1a] bg-white p-8 font-bold uppercase"
				>
					No venues are available yet.
				</div>
				<article
					v-for="venue in visibleVenues"
					:key="venue.id"
					class="group flex flex-col border-2 border-[#1a1a1a] bg-[#f5f0e8] shadow-[8px_8px_0_0_#1a1a1a]"
				>
					<div
						class="relative h-64 overflow-hidden border-b-2 border-[#1a1a1a]"
					>
						<img
							:src="venue.imageUrl || '/imgVenue.webp'"
							:alt="venue.name"
							class="h-full w-full object-cover grayscale transition-all group-hover:scale-105 group-hover:grayscale-0"
						/><span
							class="absolute left-4 top-4 border-2 border-[#1a1a1a] bg-[#0055ff] px-3 py-1 text-xs font-bold uppercase text-white shadow-[2px_2px_0_0_#1a1a1a]"
							>{{ venue.city }}</span
						>
					</div>
					<div class="flex grow flex-col p-4 sm:p-6">
						<div
							class="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-between"
						>
							<h2
								class="break-words text-3xl font-black uppercase leading-none"
							>
								{{ venue.name }}
							</h2>
							<div class="shrink-0 sm:text-right">
								<p class="text-[10px] font-black uppercase opacity-60">
									Capacity
								</p>
								<p class="text-xl font-black">
									{{ venue.capacity.toLocaleString() }}
								</p>
							</div>
						</div>
						<div
							class="mb-6 border-2 border-[#1a1a1a] bg-[#eee9e0] p-4 shadow-[4px_4px_0_0_#1a1a1a]"
						>
							<p class="mb-1 text-[10px] font-black uppercase text-[#e63b2e]">
								Currently hosting
							</p>
							<p class="text-lg font-bold uppercase">
								{{ venue.currentEvent || "No live event right now" }}
							</p>
						</div>
						<div
							class="mt-auto flex flex-col gap-4 border-t-2 border-[#1a1a1a]/10 pt-5 sm:flex-row sm:items-center sm:justify-end"
						>
							<RouterLink
								:to="{
									name: 'venue-details',
									params: { id: venue.slug || venue.id },
								}"
								class="flex w-full items-center justify-center bg-[#1a1a1a] px-4 py-2 text-sm font-black uppercase text-white transition-colors hover:bg-[#0055ff] sm:w-auto"
								>View details <ArrowRightIcon class="ml-2 size-4"
							/></RouterLink>
						</div>
					</div>
				</article>
			</section>
		</main>
		<Footer />
	</div>
</template>
