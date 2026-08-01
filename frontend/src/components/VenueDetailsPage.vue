<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import {
	CalendarIcon,
	LightBulbIcon,
	MapPinIcon,
	SpeakerWaveIcon,
	UserGroupIcon,
	ViewfinderCircleIcon,
} from "@heroicons/vue/24/outline";
import Footer from "./Footer.vue";
import Header from "./Header.vue";
import VenueMap from "./VenueMap.vue";
import { apiRequest } from "@/lib/api";
import { formatEventDate, formatTime } from "@/lib/format";

type VenueDetail = {
	id: string;
	name: string;
	address: string;
	city: string;
	description: string | null;
	imageUrl: string | null;
	capacity: number;
	audioSystem: string | null;
	lightingSystem: string | null;
	stageAreaSqm: string | null;
	latitude: string | null;
	longitude: string | null;
	images: { id: string; imageUrl: string; altText: string | null }[];
	events: {
		id: string;
		title: string;
		slug: string;
		category: string;
		heroImageUrl: string | null;
		startsAt: string;
		doorsAt: string | null;
	}[];
};
const route = useRoute();
const venue = ref<VenueDetail | null>(null);
const isLoading = ref(true);
const errorMessage = ref("");
const gallery = computed(() =>
	venue.value
		? [
				...(venue.value.imageUrl
					? [{ url: venue.value.imageUrl, altText: null as string | null }]
					: []),
				...venue.value.images.map((image) => ({
					url: image.imageUrl,
					altText: image.altText,
				})),
			]
		: [],
);
async function loadVenue() {
	isLoading.value = true;
	errorMessage.value = "";
	try {
		venue.value = await apiRequest<VenueDetail>(
			`/venues/${encodeURIComponent(String(route.params.id))}`,
		);
	} catch (error) {
		venue.value = null;
		errorMessage.value =
			error instanceof Error ? error.message : "Unable to load this venue.";
	} finally {
		isLoading.value = false;
	}
}
onMounted(loadVenue);
watch(() => route.params.id, loadVenue);
</script>

<template>
	<div class="min-h-screen bg-[#f5f0e8] font-['Space_Grotesk'] text-[#1a1a1a]">
		<Header />
		<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
			<div
				v-if="isLoading"
				class="border-4 border-[#1a1a1a] bg-white p-8 font-bold uppercase"
			>
				Loading venue…
			</div>
			<div
				v-else-if="errorMessage"
				class="border-4 border-[#e63b2e] bg-white p-8 font-bold uppercase text-[#e63b2e]"
			>
				{{ errorMessage }}
			</div>
			<template v-else-if="venue"
				><section
					class="mb-10 overflow-hidden border-4 border-[#1a1a1a] bg-[#1a1a1a] text-white shadow-[10px_10px_0_0_#1a1a1a]"
				>
					<div class="grid lg:grid-cols-[1fr_18rem]">
						<div class="p-6 sm:p-10">
							<p class="mb-4 font-bold uppercase text-[#ffcc00]">
								Venue portal
							</p>
							<h1
								class="mb-5 text-4xl font-black uppercase leading-none sm:text-6xl"
							>
								{{ venue.name }}
							</h1>
							<p class="flex items-center gap-2 font-bold uppercase">
								<MapPinIcon class="size-5" />{{ venue.address }},
								{{ venue.city }}
							</p>
						</div>
						<img
							:src="venue.imageUrl || '/imgVenue.webp'"
							:alt="venue.name"
							class="h-56 w-full object-cover lg:h-full"
						/>
					</div>
				</section>
				<section class="mb-10">
					<h2
						class="mb-6 inline-block border-b-4 border-[#1a1a1a] pb-1 text-3xl font-bold uppercase sm:text-4xl"
					>
						Technical specs
					</h2>
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
						<div
							class="border-2 border-[#1a1a1a] bg-white p-4 shadow-[5px_5px_0_0_#1a1a1a]"
						>
							<UserGroupIcon class="mb-3 size-8 text-[#0055ff]" />
							<p class="text-3xl font-black">
								{{ venue.capacity.toLocaleString() }}
							</p>
							<p class="text-xs font-bold uppercase">Max capacity</p>
						</div>
						<div
							class="border-2 border-[#1a1a1a] bg-[#1a1a1a] p-4 text-white shadow-[5px_5px_0_0_#1a1a1a]"
						>
							<SpeakerWaveIcon class="mb-3 size-8 text-[#ffcc00]" />
							<p class="text-lg font-black uppercase">
								{{ venue.audioSystem || "TBA" }}
							</p>
							<p class="text-xs font-bold uppercase text-[#ffcc00]">
								Audio system
							</p>
						</div>
						<div
							class="border-2 border-[#1a1a1a] bg-white p-4 shadow-[5px_5px_0_0_#1a1a1a]"
						>
							<LightBulbIcon class="mb-3 size-8 text-[#e63b2e]" />
							<p class="text-lg font-black uppercase">
								{{ venue.lightingSystem || "TBA" }}
							</p>
							<p class="text-xs font-bold uppercase">Lighting system</p>
						</div>
						<div
							class="border-2 border-[#1a1a1a] bg-[#ffcc00] p-4 shadow-[5px_5px_0_0_#1a1a1a]"
						>
							<ViewfinderCircleIcon class="mb-3 size-8" />
							<p class="text-3xl font-black">
								{{ venue.stageAreaSqm || "TBA"
								}}<span v-if="venue.stageAreaSqm" class="text-base"> m²</span>
							</p>
							<p class="text-xs font-bold uppercase">Stage area</p>
						</div>
					</div>
				</section>
				<section v-if="venue.description" class="mb-10">
					<h2
						class="mb-5 inline-block border-b-4 border-[#e63b2e] pb-1 text-3xl font-bold uppercase sm:text-4xl"
					>
						Overview
					</h2>
					<p
						class="max-w-3xl whitespace-pre-line font-['Inter'] leading-relaxed sm:text-lg"
					>
						{{ venue.description }}
					</p>
				</section>
				<section v-if="gallery.length" class="mb-10">
					<h2
						class="mb-5 inline-block border-b-4 border-[#0055ff] pb-1 text-3xl font-bold uppercase sm:text-4xl"
					>
						Visual archive
					</h2>
					<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						<img
							v-for="(image, index) in gallery"
							:key="`${index}-${image.url}`"
							:src="image.url"
							:alt="image.altText || `${venue.name} image ${index + 1}`"
							class="h-56 w-full border-2 border-[#1a1a1a] object-cover shadow-[4px_4px_0_0_#1a1a1a]"
						/>
					</div>
				</section>
				<section
					v-if="venue.latitude != null && venue.longitude != null"
					class="mb-10"
				>
					<h2
						class="mb-5 inline-block border-b-4 border-[#1a1a1a] pb-1 text-3xl font-bold uppercase sm:text-4xl"
					>
						Location
					</h2>
					<VenueMap
						:latitude="Number(venue.latitude)"
						:longitude="Number(venue.longitude)"
						:name="venue.name"
					/>
				</section>
				<section>
					<h2
						class="mb-6 inline-block border-b-4 border-[#1a1a1a] pb-1 text-3xl font-bold uppercase sm:text-4xl"
					>
						Scheduled live
					</h2>
					<div v-if="venue.events.length" class="space-y-4">
						<article
							v-for="event in venue.events"
							:key="event.id"
							class="flex flex-col gap-4 border-2 border-[#1a1a1a] bg-white p-4 shadow-[5px_5px_0_0_#1a1a1a] sm:flex-row sm:items-center sm:justify-between"
						>
							<div class="flex items-center gap-4">
								<img
									v-if="event.heroImageUrl"
									:src="event.heroImageUrl"
									:alt="event.title"
									class="size-20 shrink-0 border-2 border-[#1a1a1a] object-cover"
								/>
								<div>
									<p class="font-bold uppercase text-[#0055ff]">
										{{
											formatEventDate(event.startsAt, {
												month: "short",
												day: "numeric",
											})
										}}
										· {{ formatTime(event.startsAt) }}
									</p>
									<h3 class="text-xl font-black uppercase">
										{{ event.title }}
									</h3>
									<p class="text-sm font-bold uppercase">
										{{ event.category }}
									</p>
									<p
										v-if="event.doorsAt"
										class="text-sm font-bold uppercase text-gray-500"
									>
										Doors {{ formatTime(event.doorsAt) }}
									</p>
								</div>
							</div>
							<RouterLink
								:to="{
									name: 'event-details',
									params: { id: event.slug || event.id },
								}"
								class="bg-[#1a1a1a] px-5 py-3 text-center font-bold uppercase text-white hover:bg-black"
								>Get tickets</RouterLink
							>
						</article>
					</div>
					<p
						v-else
						class="border-2 border-[#1a1a1a] bg-white p-6 font-bold uppercase"
					>
						No upcoming events are published for this venue.
					</p>
				</section></template
			>
		</main>
		<Footer />
	</div>
</template>
