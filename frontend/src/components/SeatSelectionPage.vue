<script setup>
import { ref, computed } from "vue";
import Footer from "./Footer.vue";
import Header from "./Header.vue";
import {
	MapPinIcon,
	CalendarIcon,
	InformationCircleIcon,
	CheckCircleIcon,
	TrashIcon,
} from "@heroicons/vue/20/solid";
import { UserIcon } from "@heroicons/vue/24/outline";

// Mock data based on Figma context
const event = {
	title: "Neon Nights: The Underground Tour",
	date: "Oct 24, 2023 • 20:00",
	venue: "Brutal Hall, Sector 7",
	address: "123 Industrial Way, Sector 7, Cyber City",
	parking: "Available at Lot C, 500m from venue",
	ageLimit: "18+ only",
	image:
		"https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070&auto=format&fit=crop",
};

const zones = [
	{ id: "A", name: "Premium", price: 120, color: "bg-[#e63b2e]" },
	{ id: "B", name: "General", price: 80, color: "bg-[#0055ff]" },
];

const seats = ref([
	// Zone A
	{ id: "A1", zone: "A", status: "available" },
	{ id: "A2", zone: "A", status: "booked" },
	{ id: "A3", zone: "A", status: "available" },
	{ id: "A4", zone: "A", status: "available" },
	{ id: "A5", zone: "A", status: "available" },
	{ id: "A6", zone: "A", status: "booked" },
	{ id: "A7", zone: "A", status: "available" },
	{ id: "A8", zone: "A", status: "available" },
	{ id: "A9", zone: "A", status: "available" },
	{ id: "A10", zone: "A", status: "available" },
	// Zone B
	{ id: "B1", zone: "B", status: "available" },
	{ id: "B2", zone: "B", status: "available" },
	{ id: "B3", zone: "B", status: "available" },
	{ id: "B4", zone: "B", status: "available" },
	{ id: "B5", zone: "B", status: "booked" },
	{ id: "B6", zone: "B", status: "booked" },
	{ id: "B7", zone: "B", status: "available" },
	{ id: "B8", zone: "B", status: "available" },
	{ id: "B9", zone: "B", status: "available" },
	{ id: "B10", zone: "B", status: "available" },
	{ id: "B11", zone: "B", status: "available" },
]);

const selectedSeats = ref([]);

const toggleSeat = (seat) => {
	if (seat.status === "booked") return;

	const index = selectedSeats.value.findIndex((s) => s.id === seat.id);
	if (index === -1) {
		selectedSeats.value.push(seat);
	} else {
		selectedSeats.value.splice(index, 1);
	}
};

const isSelected = (seat) => selectedSeats.value.some((s) => s.id === seat.id);

const totalPrice = computed(() => {
	return selectedSeats.value.reduce((total, seat) => {
		const zone = zones.find((z) => z.id === seat.zone);
		return total + (zone ? zone.price : 0);
	}, 0);
});

const getZoneColor = (zoneId, status) => {
	if (status === "booked") return "bg-gray-400 cursor-not-allowed opacity-50";
	const zone = zones.find((z) => z.id === zoneId);
	return zone ? zone.color : "bg-gray-200";
};
</script>

<template>
	<div
		class="min-h-screen bg-[#f5f0e8] text-[#1a1a1a] font-['Space_Grotesk'] selection:bg-[#ffcc00] selection:text-[#1a1a1a]"
	>
		<Header />

		<main class="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
			<div class="flex flex-col lg:flex-row gap-6 sm:gap-8">
				<!-- Left Column: Venue Map -->
				<div class="flex-1 flex flex-col gap-6 sm:gap-8">
					<!-- Header Section -->
					<div class="border-l-4 border-[#1a1a1a] pl-4 sm:pl-6 py-1 sm:py-2">
						<h1
							class="text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight mb-2"
						>
							Select Your Seats
						</h1>
						<h2 class="text-lg sm:text-xl md:text-2xl text-[#0055ff] font-bold mb-3 sm:mb-4">
							{{ event.title }}
						</h2>

						<div
							class="flex flex-wrap items-center gap-4 text-sm font-['Inter'] font-medium text-gray-700"
						>
							<div class="flex items-center gap-2">
								<CalendarIcon class="w-5 h-5 text-[#1a1a1a]" />
								<span>{{ event.date }}</span>
							</div>
							<div class="flex items-center gap-2">
								<MapPinIcon class="w-5 h-5 text-[#1a1a1a]" />
								<span>{{ event.venue }}</span>
							</div>
						</div>
					</div>

					<!-- Stage and Map Container -->
					<div
						class="bg-[#eee9e0] border-[3px] border-[#1a1a1a] shadow-[8px_8px_0px_0px_#1a1a1a] p-4 sm:p-6 md:p-8 mt-2 sm:mt-4 relative overflow-hidden"
					>
						<!-- Stage -->
						<div
							class="bg-[#1a1a1a] text-white text-center py-3 sm:py-4 px-4 sm:px-8 font-bold tracking-widest uppercase border-b-[6px] border-[#ffcc00] mt-0 md:mt-16 mx-auto max-w-2xl transform perspective-1000 rotate-x-12 origin-bottom"
						>
							STAGE
						</div>

						<!-- Legend -->
						<div
							class="relative md:absolute md:top-4 md:right-4 flex flex-wrap justify-start md:justify-center gap-3 sm:gap-6 mb-6 md:mb-12 bg-white/50 backdrop-blur border-2 border-[#1a1a1a] p-3 sm:p-4 mt-4 md:mt-0 w-full md:w-auto"
						>
							<div class="flex items-center gap-2">
								<div
									class="w-5 h-5 bg-[#e63b2e] border-2 border-[#1a1a1a]"
								></div>
								<span class="text-sm font-bold">Premium ($120)</span>
							</div>
							<div class="flex items-center gap-2">
								<div
									class="w-5 h-5 bg-[#0055ff] border-2 border-[#1a1a1a]"
								></div>
								<span class="text-sm font-bold">General ($80)</span>
							</div>
							<div class="flex items-center gap-2">
								<div
									class="w-5 h-5 bg-gray-400 border-2 border-[#1a1a1a] opacity-50"
								></div>
								<span class="text-sm font-bold">Booked</span>
							</div>
							<div class="flex items-center gap-2">
								<div
									class="w-5 h-5 bg-[#ffcc00] border-2 border-[#1a1a1a]"
								></div>
								<span class="text-sm font-bold">Selected</span>
							</div>
						</div>

						<!-- Seat Map -->
						<div class="flex flex-col gap-8 sm:gap-12 items-center pb-4 sm:pb-8 mt-6 sm:mt-12">
							<!-- Zone A: Premium -->
							<div class="flex flex-col gap-3 sm:gap-4 items-center">
								<h3
									class="text-lg font-bold bg-white px-4 py-1 mb-2 border-2 border-[#1a1a1a] shadow-[2px_2px_0px_0px_#1a1a1a] -rotate-2"
								>
									Zone A: Premium
								</h3>
								<div class="flex flex-wrap justify-center gap-3 sm:gap-5 max-w-xl">
									<button
										v-for="seat in seats.filter((s) => s.zone === 'A')"
										:key="seat.id"
										@click="toggleSeat(seat)"
										:disabled="seat.status === 'booked'"
										class="w-8 h-8 sm:w-10 sm:h-10 border-2 border-[#1a1a1a] transition-all duration-150 relative flex items-center justify-center group"
										:class="[
											isSelected(seat)
												? 'bg-[#ffcc00] shadow-[0_0_0_2px_#1a1a1a_inset] scale-110 z-10'
												: getZoneColor('A', seat.status),
										]"
									>
										<span
											v-if="isSelected(seat)"
											class="absolute -top-3 -right-3 w-5 h-5 bg-[#1a1a1a] text-white rounded-full flex items-center justify-center text-xs"
										>
											<CheckCircleIcon class="w-4 h-4 text-[#ffcc00]" />
										</span>
										<span
											v-if="seat.status !== 'booked'"
											class="opacity-0 group-hover:opacity-100 text-[#1a1a1a] font-bold text-xs bg-white px-1 border border-[#1a1a1a] absolute -top-8 whitespace-nowrap z-20 pointer-events-none"
										>
											{{ seat.id }}
										</span>
									</button>
								</div>
							</div>

							<!-- Zone B: General -->
							<div class="flex flex-col gap-3 sm:gap-4 items-center mt-2 sm:mt-4">
								<h3
									class="text-lg font-bold bg-white px-4 py-1 mb-2 border-2 border-[#1a1a1a] shadow-[2px_2px_0px_0px_#1a1a1a] rotate-1"
								>
									Zone B: General
								</h3>
								<div class="flex flex-wrap justify-center gap-3 sm:gap-5 max-w-2xl">
									<button
										v-for="seat in seats.filter((s) => s.zone === 'B')"
										:key="seat.id"
										@click="toggleSeat(seat)"
										:disabled="seat.status === 'booked'"
										class="w-8 h-8 sm:w-10 sm:h-10 border-2 border-[#1a1a1a] transition-all duration-150 relative flex items-center justify-center group"
										:class="[
											isSelected(seat)
												? 'bg-[#ffcc00] shadow-[0_0_0_2px_#1a1a1a_inset] scale-110 z-10'
												: getZoneColor('B', seat.status),
										]"
									>
										<span
											v-if="isSelected(seat)"
											class="absolute -top-3 -right-3 w-5 h-5 bg-[#1a1a1a] text-white rounded-full flex items-center justify-center text-xs"
										>
											<CheckCircleIcon class="w-4 h-4 text-[#ffcc00]" />
										</span>
										<span
											v-if="seat.status !== 'booked'"
											class="opacity-0 group-hover:opacity-100 text-[#1a1a1a] font-bold text-xs bg-white px-1 border border-[#1a1a1a] absolute -top-8 whitespace-nowrap z-20 pointer-events-none"
										>
											{{ seat.id }}
										</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Right Column: Summary Sidebar -->
				<aside class="w-full lg:w-96 flex flex-col gap-4 sm:gap-6">
					<!-- Selected Seats Card -->
					<div
						class="bg-[#1a1a1a] text-[#f5f0e8] border-[3px] border-[#1a1a1a] shadow-[8px_8px_0px_0px_#ffcc00] p-4 sm:p-6"
					>
						<h2
							class="text-2xl font-bold uppercase border-b-2 border-dashed border-gray-700 pb-4 mb-6"
						>
							Your Tickets
						</h2>

						<div
							v-if="selectedSeats.length === 0"
							class="text-gray-400 py-8 text-center border-2 border-dashed border-gray-700 bg-black/20"
						>
							<UserIcon class="w-12 h-12 mx-auto mb-2 opacity-50" />
							<p>No seats selected yet.</p>
							<p class="text-sm mt-1">Click on the map to select seats.</p>
						</div>

						<div v-else class="flex flex-col gap-4">
							<ul
								class="max-h-60 overflow-y-auto pr-2 space-y-3 custom-scrollbar"
							>
								<li
									v-for="seat in selectedSeats"
									:key="seat.id"
									class="flex justify-between items-center bg-[#2a2a2a] border border-gray-700 p-3 relative overflow-hidden group"
								>
									<div
										class="absolute left-0 top-0 bottom-0 w-1"
										:class="getZoneColor(seat.zone)"
									></div>
									<div class="pl-2">
										<span class="font-bold text-lg block"
											>Seat {{ seat.id }}</span
										>
										<span class="text-xs text-gray-400 uppercase"
											>Zone {{ seat.zone }} •
											{{ zones.find((z) => z.id === seat.zone)?.name }}</span
										>
									</div>
									<div class="flex items-center gap-3">
										<span class="font-bold text-[#ffcc00]"
											>${{ zones.find((z) => z.id === seat.zone)?.price }}</span
										>
										<button
											@click="toggleSeat(seat)"
											class="text-gray-500 hover:text-[#e63b2e] transition-colors p-1"
											title="Remove"
										>
											<TrashIcon class="w-5 h-5" />
										</button>
									</div>
								</li>
							</ul>

							<div
								class="border-t-2 border-dashed border-gray-700 mt-2 pt-4 flex flex-col gap-2"
							>
								<div class="flex justify-between text-gray-400">
									<span>Tickets ({{ selectedSeats.length }})</span>
									<span>${{ totalPrice }}</span>
								</div>
								<div class="flex justify-between text-gray-400">
									<span>Fees & Taxes</span>
									<span
										>${{
											selectedSeats.length > 0
												? (selectedSeats.length * 15).toFixed(2)
												: "0"
										}}</span
									>
								</div>
								<div
									class="flex justify-between text-xl font-bold text-[#ffcc00] mt-2 pt-2 border-t border-gray-700"
								>
									<span>Total</span>
									<span
										>${{
											selectedSeats.length > 0
												? (totalPrice + selectedSeats.length * 15).toFixed(2)
												: "0"
										}}</span
									>
								</div>
							</div>

							<button
								class="w-full bg-[#ffcc00] text-[#1a1a1a] font-bold text-xl uppercase py-4 px-6 border-[3px] border-transparent mt-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:border-[#ffcc00] hover:-translate-y-1 relative"
								:disabled="selectedSeats.length === 0"
							>
								Checkout Now
							</button>
						</div>
					</div>

					<!-- Extra Info Card -->
					<div
						class="bg-[#f5f0e8] border-[3px] border-[#1a1a1a] shadow-[6px_6px_0px_0px_#1a1a1a] p-4 sm:p-6 text-sm font-['Inter']"
					>
						<h3
							class="font-['Space_Grotesk'] font-bold text-lg border-b-2 border-[#1a1a1a] pb-2 mb-4 flex items-center gap-2 uppercase"
						>
							<InformationCircleIcon class="w-6 h-6" />
							Extra Info
						</h3>
						<ul class="space-y-3">
							<li class="flex gap-3 items-start">
								<span class="font-bold w-20 shrink-0">Address:</span>
								<span>{{ event.address }}</span>
							</li>
							<li class="flex gap-3 items-start">
								<span class="font-bold w-20 shrink-0">Parking:</span>
								<span>{{ event.parking }}</span>
							</li>
							<li class="flex gap-3 items-start">
								<span class="font-bold w-20 shrink-0">Age Limit:</span>
								<span>{{ event.ageLimit }}</span>
							</li>
						</ul>
					</div>

					<!-- Promotional Banner -->
					<div
						class="relative h-48 border-[3px] border-[#1a1a1a] overflow-hidden group cursor-pointer"
					>
						<img
							:src="event.image"
							alt="Concert crowd"
							class="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-110"
						/>
						<div
							class="absolute inset-0 bg-[#0055ff]/60 mix-blend-multiply group-hover:bg-[#0055ff]/20 transition-all duration-500"
						></div>
						<div
							class="absolute inset-0 flex flex-col justify-center items-center text-center p-4 bg-black/40"
						>
							<span
								class="bg-[#ffcc00] text-[#1a1a1a] px-3 py-1 font-bold text-sm transform -rotate-2 -ml-4 mb-2 shadow-[2px_2px_0px_0px_#1a1a1a] border-2 border-[#1a1a1a]"
								>VIP UPGRADE</span
							>
							<h4
								class="text-white font-bold text-xl font-['Space_Grotesk'] leading-tight drop-shadow-[2px_2px_0_rgba(0,0,0,1)]"
							>
								Unlock Backstage<br />Access Setup
							</h4>
						</div>
					</div>
				</aside>
			</div>
		</main>

		<Footer />
	</div>
</template>
