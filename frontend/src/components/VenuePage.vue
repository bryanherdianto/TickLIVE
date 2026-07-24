<script setup>
import { ref } from "vue";
import Header from "./Header.vue";
import Footer from "./Footer.vue";
import {
	StarIcon,
	ChevronDownIcon,
	ArrowRightIcon,
} from "@heroicons/vue/20/solid";

const venues = ref([
	{
		id: 1,
		name: "The Concrete Cathedral",
		location: "Berlin, DE",
		capacity: "1,200",
		rating: 4.9,
		currentEvent: "Techno-Primitive Night",
		image:
			"https://images.unsplash.com/photo-1574391884720-bbc37bb15cd3?q=80&w=800&auto=format&fit=crop",
		color: "#d6e3ff",
	},
	{
		id: 2,
		name: "Apex Rooftop Pavilion",
		location: "London, UK",
		capacity: "450",
		rating: 4.7,
		currentEvent: "Summer Solstice Jazz",
		image:
			"https://images.unsplash.com/photo-1541336032412-2048a678540d?q=80&w=800&auto=format&fit=crop",
		color: "#ffdad6",
	},
	{
		id: 3,
		name: "The Industrial Void",
		location: "Detroit, US",
		capacity: "2,500",
		rating: 4.8,
		currentEvent: "Warehouse Rave X",
		image:
			"https://images.unsplash.com/photo-1514525253361-bee8d48842a1?q=80&w=800&auto=format&fit=crop",
		color: "#ffcc00",
	},
	{
		id: 4,
		name: "Neon Underground",
		location: "Tokyo, JP",
		capacity: "300",
		rating: 4.9,
		currentEvent: "Synth-Wave Dreams",
		image:
			"https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
		color: "#d6e3ff",
	},
	{
		id: 5,
		name: "The Rusty Anchor",
		location: "Hamburg, DE",
		capacity: "800",
		rating: 4.6,
		currentEvent: "Harbor Punk Fest",
		image:
			"https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800&auto=format&fit=crop",
		color: "#ffdad6",
	},
	{
		id: 6,
		name: "Marble Hall",
		location: "Rome, IT",
		capacity: "1,500",
		rating: 4.8,
		currentEvent: "Opera Brutale",
		image:
			"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop",
		color: "#ffcc00",
	},
]);

const activeFilter = ref("All Spaces");
const filters = ["All Spaces", "Industrial", "Open Air", "Experimental"];
</script>

<template>
	<div class="min-h-screen bg-[#f5f0e8] font-['Space_Grotesk'] text-[#1a1a1a]">
		<Header />

		<main class="max-w-7xl mx-auto px-6 py-12">
			<!-- Hero Section -->
			<section
				class="relative bg-[#faf7f2] border-2 border-[#1a1a1a] shadow-[8px_8px_0_0_#1a1a1a] mb-16 overflow-hidden lg:flex"
			>
				<div
					class="lg:w-7/12 p-8 lg:p-12 border-b-2 lg:border-b-0 lg:border-r-2 border-[#1a1a1a]"
				>
					<h1
						class="text-5xl sm:text-6xl lg:text-8xl font-black uppercase leading-none mb-8 tracking-tighter"
					>
						Space<br /><span class="text-[#e63b2e]">Defined.</span>
					</h1>
					<div class="border-l-4 border-[#0055ff] pl-6 mb-8 max-w-lg">
						<p class="text-xl lg:text-2xl font-bold leading-tight">
							The ultimate destination for sound, soul, and subculture. Get
							tickets to the most underground events.
						</p>
					</div>
					<div class="flex flex-wrap gap-4">
						<button
							class="bg-[#ffcc00] border-2 border-[#1a1a1a] px-8 py-4 font-black uppercase text-lg shadow-[4px_4px_0_0_#1a1a1a] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#1a1a1a] transition-all"
						>
							List Your Venue
						</button>
						<button
							class="bg-[#f5f0e8] border-2 border-[#1a1a1a] px-8 py-4 font-black uppercase text-lg shadow-[4px_4px_0_0_#1a1a1a] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#1a1a1a] transition-all"
						>
							View Map
						</button>
					</div>
				</div>
				<div
					class="lg:w-5/12 relative h-64 lg:h-auto overflow-hidden bg-[#0055ff]"
				>
					<img
						src="/imgVenueHero.webp"
						class="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 opacity-80"
						alt="Venue Hero"
					/>
					<div class="absolute bottom-6 left-6 right-6">
						<div
							class="bg-[#e63b2e] border-2 border-[#1a1a1a] p-4 shadow-[4px_4px_0_0_#1a1a1a]"
						>
							<p
								class="text-white font-black text-xl lg:text-2xl uppercase tracking-tight"
							>
								Featured: The Brutalist Hall
							</p>
						</div>
					</div>
				</div>
			</section>

			<!-- Search & Filters -->
			<section class="mb-12">
				<div
					class="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b-2 border-[#1a1a1a]"
				>
					<!-- Filter Buttons -->
					<div class="flex flex-wrap gap-3">
						<button
							v-for="filter in filters"
							:key="filter"
							@click="activeFilter = filter"
							:class="[
								'px-6 py-2 font-bold uppercase tracking-wider border-2 border-[#1a1a1a] transition-all',
								activeFilter === filter
									? 'bg-[#ffcc00] shadow-[4px_4px_0_0_#1a1a1a]'
									: 'bg-transparent',
							]"
						>
							{{ filter }}
						</button>
					</div>
				</div>
			</section>

			<!-- Venue Grid -->
			<section
				class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8"
			>
				<article
					v-for="venue in venues"
					:key="venue.id"
					class="bg-[#f5f0e8] border-2 border-[#1a1a1a] shadow-[8px_8px_0_0_#1a1a1a] flex flex-col group"
				>
					<!-- Card Image Section -->
					<div
						class="relative h-64 border-b-2 border-[#1a1a1a] overflow-hidden"
					>
						<img
							:src="venue.image"
							:alt="venue.name"
							class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
						/>
						<div class="absolute top-4 left-4">
							<span
								class="bg-[#0055ff] text-white border-2 border-[#1a1a1a] px-3 py-1 font-bold text-xs uppercase shadow-[2px_2px_0_0_#1a1a1a]"
							>
								{{ venue.location }}
							</span>
						</div>
					</div>

					<!-- Card Content -->
					<div class="p-4 sm:p-6 flex flex-col grow">
						<div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6">
							<h3 class="text-3xl font-black leading-none uppercase sm:pr-4 break-words">
								{{ venue.name }}
							</h3>
							<div class="text-left sm:text-right shrink-0">
								<p class="text-[10px] uppercase font-black opacity-60">
									Capacity
								</p>
								<p class="text-xl font-black leading-none">
									{{ venue.capacity }}
								</p>
							</div>
						</div>

						<!-- Event Status Box -->
						<div
							class="bg-[#eee9e0] border-2 border-[#1a1a1a] p-4 mb-6 shadow-[4px_4px_0_0_#1a1a1a]"
						>
							<p class="text-[#e63b2e] text-[10px] font-black uppercase mb-1">
								Currently Hosting
							</p>
							<p class="text-lg font-bold leading-tight uppercase">
								{{ venue.currentEvent }}
							</p>
						</div>

						<!-- Footer Details -->
						<div
							class="mt-auto pt-6 border-t-2 border-[#1a1a1a]/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4"
						>
							<div
								class="self-start flex items-center gap-1.5 bg-[#ffcc00] border-2 border-[#1a1a1a] px-2 py-0.5 shadow-[2px_2px_0_0_#1a1a1a]"
							>
								<StarIcon class="w-4 h-4" />
								<span class="font-black text-sm">{{ venue.rating }}</span>
							</div>

							<button
								class="w-full sm:w-auto justify-center bg-[#1a1a1a] text-white px-4 py-2 font-black uppercase text-sm hover:bg-[#0055ff] transition-colors flex items-center group/btn"
							>
								View Details
								<ArrowRightIcon
									class="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform"
								/>
							</button>
						</div>
					</div>
				</article>
			</section>

			<!-- Load More / Pagination -->
			<section class="flex justify-center py-8">
				<button
					class="group relative inline-block bg-[#1a1a1a] px-10 sm:px-12 py-4 shadow-[8px_8px_0_0_#ffcc00] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
				>
					<span
						class="relative font-black text-white uppercase text-sm sm:text-xl flex items-center"
					>
						Load More Spaces
						<ArrowRightIcon class="w-6 h-6 ml-3" />
					</span>
				</button>
			</section>
		</main>

		<Footer />
	</div>
</template>
