<script setup>
import { ref } from "vue";
import Footer from "./Footer.vue";
import Header from "./Header.vue";
import {
	MapPinIcon,
	CalendarIcon,
	InformationCircleIcon,
	AdjustmentsHorizontalIcon,
	PhotoIcon,
	UserGroupIcon,
	SpeakerWaveIcon,
	LightBulbIcon,
	ViewfinderCircleIcon,
	ChevronDownIcon,
} from "@heroicons/vue/24/outline";

const portalMenuOpen = ref(false);
</script>

<template>
	<div
		class="min-h-screen bg-[#f5f0e8] text-[#1a1a1a] font-['Space_Grotesk'] flex flex-col"
	>
		<Header />

		<div
			class="grow max-w-360 w-full mx-auto flex flex-col lg:flex-row border-l border-r border-[#1a1a1a]"
		>
			<!-- Sidebar Navigation -->
			<aside
				class="w-full lg:w-64 shrink-0 bg-[#f5f0e8] self-start lg:sticky top-20 border-b lg:border-b-0 lg:border-r border-[#1a1a1a]"
			>
				<div
					class="p-4 lg:p-6 border-b border-[#1a1a1a] flex items-center justify-between gap-4"
				>
					<div>
						<h2 class="text-xl font-bold uppercase tracking-wider mb-1">
							Venue_Portal
						</h2>
						<p class="text-xs font-bold text-gray-500">V.01-SPEC</p>
					</div>
					<button
						type="button"
						class="lg:hidden flex items-center gap-2 border-2 border-[#1a1a1a] px-3 py-2 font-bold text-xs uppercase"
						@click="portalMenuOpen = !portalMenuOpen"
					>
						Menu
						<ChevronDownIcon
							class="h-4 w-4 transition-transform duration-200"
							:class="{ 'rotate-180': portalMenuOpen }"
						/>
					</button>
				</div>
				<nav
					:class="[portalMenuOpen ? 'flex' : 'hidden', 'lg:flex flex-col pt-2 lg:pt-6 font-bold text-sm tracking-wide']"
				>
					<button
						class="px-4 lg:px-6 py-3 lg:py-4 bg-[#ffcc00] border-l-4 border-[#1a1a1a] text-left flex items-center gap-3"
					>
						<InformationCircleIcon class="h-5 w-5" />
						OVERVIEW
					</button>
					<button
						class="px-4 lg:px-6 py-3 lg:py-4 hover:bg-gray-100 text-gray-600 text-left flex items-center gap-3 transition-colors border-l-4 border-transparent"
					>
						<AdjustmentsHorizontalIcon class="h-5 w-5" />
						SPECS
					</button>
					<button
						class="px-4 lg:px-6 py-3 lg:py-4 hover:bg-gray-100 text-gray-600 text-left flex items-center gap-3 transition-colors border-l-4 border-transparent"
					>
						<PhotoIcon class="h-5 w-5" />
						GALLERY
					</button>
					<button
						class="px-4 lg:px-6 py-3 lg:py-4 hover:bg-gray-100 text-gray-600 text-left flex items-center gap-3 transition-colors border-l-4 border-transparent"
					>
						<CalendarIcon class="h-5 w-5" />
						SCHEDULE
					</button>
				</nav>
			</aside>

			<!-- Main Content -->
			<div class="flex-1 min-w-0">
				<!-- Hero Banner -->
				<section
					class="w-full relative min-h-100 sm:min-h-125 border-b border-[#1a1a1a] flex"
				>
					<!-- Main Dark Area -->
					<div
						class="grow bg-[#111111] relative overflow-hidden flex flex-col justify-end p-6 sm:p-10 lg:p-16"
					>
						<!-- Subtle background texture/image overlay -->
						<div
							class="absolute inset-0 opacity-20 pointer-events-none"
							style="
								background-image: url(&quot;https://images.unsplash.com/photo-1568219656418-15c329312bf1?q=80&w=1200&auto=format&fit=crop&quot;);
								background-size: cover;
								background-position: center;
								mix-blend-mode: luminosity;
							"
						></div>

						<div class="relative z-10 w-full max-w-4xl">
							<div
								class="inline-block bg-[#e63b2e] text-white px-3 py-1 font-bold text-sm tracking-widest mb-6"
							>
								VENUE_042
							</div>
							<h1
								class="text-4xl sm:text-6xl md:text-8xl lg:text-[110px] font-bold uppercase tracking-tighter leading-[0.85] text-[#ffcc00] mb-6 sm:mb-8"
							>
								The Concrete<br />Cathedral
							</h1>
							<div
								class="flex items-center text-white font-bold tracking-widest text-sm md:text-lg"
							>
								<MapPinIcon class="h-6 w-6 mr-3" />
								BERLIN_DE // KREUZBERG DISTRICT
							</div>
						</div>
					</div>
					<!-- Right Yellow Bar -->
					<div class="w-24 lg:w-32 bg-[#ffcc00] hidden md:block"></div>
				</section>

				<!-- Technical Specs -->
				<section class="px-4 sm:px-8 lg:px-16 pt-10 sm:pt-16 pb-8 sm:pb-12 border-b border-[#1a1a1a]">
					<h2
						class="text-3xl sm:text-4xl lg:text-5xl font-bold uppercase mb-6 sm:mb-10 inline-block border-b-4 border-[#1a1a1a] pb-1"
					>
						Technical_Specs
					</h2>
					<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
						<!-- Capacity -->
						<div
							class="bg-white border-[3px] border-[#1a1a1a] p-3 xl:p-6 shadow-[6px_6px_0px_0px_#1a1a1a]"
						>
							<div class="text-[#0055ff] mb-4">
								<UserGroupIcon class="h-8 w-8" />
							</div>
							<div class="text-4xl font-bold mb-1">1,200</div>
							<div
								class="text-xs font-bold uppercase tracking-widest text-gray-800"
							>
								Max Capacity
							</div>
						</div>

						<!-- Audio -->
						<div
							class="bg-[#1a1a1a] text-white border-[3px] border-[#1a1a1a] p-3 xl:p-6 shadow-[6px_6px_0px_0px_#1a1a1a]"
						>
							<div class="text-[#ffcc00] mb-4">
								<SpeakerWaveIcon class="h-8 w-8" />
							</div>
							<div class="text-[20px] font-bold mb-1 leading-tight">
								L-AKOSTIK K2
							</div>
							<div
								class="text-xs font-bold uppercase tracking-widest text-[#ffcc00]"
							>
								Audio System
							</div>
						</div>

						<!-- Lighting -->
						<div
							class="bg-white border-[3px] border-[#1a1a1a] p-3 xl:p-6 shadow-[6px_6px_0px_0px_#1a1a1a]"
						>
							<div class="text-[#e63b2e] mb-4">
								<LightBulbIcon class="h-8 w-8" />
							</div>
							<div class="text-[20px] font-bold mb-1 leading-tight">
								GRANDMA3<br />FULL
							</div>
							<div
								class="text-xs font-bold uppercase tracking-widest text-gray-800"
							>
								Lighting Console
							</div>
						</div>

						<!-- Stage -->
						<div
							class="bg-[#ffcc00] border-[3px] border-[#1a1a1a] p-3 xl:p-6 shadow-[6px_6px_0px_0px_#1a1a1a]"
						>
							<div class="text-[#1a1a1a] mb-4">
								<ViewfinderCircleIcon class="h-8 w-8" />
							</div>
							<div class="text-4xl font-bold mb-1">80M²</div>
							<div
								class="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]"
							>
								Stage Area
							</div>
						</div>
					</div>
				</section>

				<!-- Visual Archive -->
				<section class="px-4 sm:px-8 lg:px-16 pt-10 sm:pt-16 pb-8 sm:pb-12 border-b border-[#1a1a1a]">
					<div class="flex justify-between items-end mb-6 sm:mb-10">
						<h2
							class="text-3xl sm:text-4xl lg:text-5xl font-bold uppercase border-b-4 border-[#e63b2e] pb-1"
						>
							Visual_Archive
						</h2>
					</div>

					<!-- Image Grid -->
					<div class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 h-auto md:h-150">
						<!-- Top Left Large -->
						<div
							class="md:col-span-2 bg-[#111111] overflow-hidden border-2 border-[#1a1a1a]"
						>
							<img
								src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1000&auto=format&fit=crop"
								class="w-full h-56 sm:h-75 md:h-full object-cover opacity-80"
								alt="Concert Stage"
							/>
						</div>

						<!-- Right Tall -->
						<div
							class="md:col-span-1 md:row-span-2 bg-black border-2 border-[#1a1a1a] overflow-hidden"
						>
							<img
								src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop"
								class="w-full h-56 sm:h-75 md:h-full object-cover"
								alt="Sound System"
							/>
						</div>

						<!-- Bottom Left -->
						<div
							class="md:col-span-1 bg-[#111111] overflow-hidden border-2 border-[#1a1a1a]"
						>
							<img
								src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1000&auto=format&fit=crop"
								class="w-full h-56 sm:h-75 md:h-full object-cover"
								alt="Stage Lights"
							/>
						</div>

						<!-- Bottom Middle Numeric -->
						<div
							class="md:col-span-1 bg-[#111111] overflow-hidden border-2 border-[#1a1a1a]"
						>
							<img
								src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1000&auto=format&fit=crop"
								class="w-full h-56 sm:h-75 md:h-full object-cover"
								alt="Stage Lights"
							/>
						</div>
					</div>
				</section>

				<!-- Scheduled Live -->
				<section class="px-4 sm:px-8 lg:px-16 pt-10 sm:pt-16 pb-12 sm:pb-20">
					<h2
						class="text-3xl sm:text-4xl lg:text-5xl font-bold uppercase mb-6 sm:mb-10 inline-block border-b-4 border-[#0055ff] pb-1"
					>
						Scheduled_Live
					</h2>

					<div class="flex flex-col gap-4 sm:gap-6">
						<!-- Event Card 1 -->
						<div
							class="bg-white border-[3px] border-[#1a1a1a] p-4 sm:p-6 shadow-[6px_6px_0px_0px_#1a1a1a] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6"
						>
							<div
								class="flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-6 lg:gap-10"
							>
								<div
									class="text-center md:border-r-2 border-[#1a1a1a] md:pr-8 min-w-25"
								>
									<div
										class="text-xl font-bold uppercase tracking-widest text-[#1a1a1a]"
									>
										Oct
									</div>
									<div class="text-4xl font-bold">24</div>
								</div>
								<div>
									<h3
									class="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-tight mb-1"
									>
										Neon_Minimalism Tour
									</h3>
									<p
										class="font-bold text-[#0055ff] tracking-widest text-sm uppercase"
									>
										Feat. Analog_Ghost
									</p>
								</div>
							</div>
							<div
								class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t-2 md:border-t-0 border-[#1a1a1a]"
							>
								<div class="text-right">
									<div
										class="text-xs font-bold uppercase tracking-wider text-gray-500"
									>
										Doors
									</div>
									<div class="text-xl font-bold">22:00</div>
								</div>
								<button
									class="w-full sm:w-auto bg-[#1a1a1a] text-white px-5 sm:px-8 py-3 sm:py-4 font-bold tracking-widest text-xs sm:text-sm uppercase hover:bg-black transition-colors ml-0"
								>
									Get_Tickets
								</button>
							</div>
						</div>

						<!-- Event Card 2 -->
						<div
							class="bg-white border-[3px] border-[#1a1a1a] p-4 sm:p-6 shadow-[6px_6px_0px_0px_#1a1a1a] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6"
						>
							<div
								class="flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-6 lg:gap-10"
							>
								<div
									class="text-center md:border-r-2 border-[#1a1a1a] md:pr-8 min-w-25"
								>
									<div
										class="text-xl font-bold uppercase tracking-widest text-[#1a1a1a]"
									>
										Nov
									</div>
									<div class="text-4xl font-bold">02</div>
								</div>
								<div>
									<h3
									class="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-tight mb-1"
									>
										Synth_Wave Assembly
									</h3>
									<p
										class="font-bold text-[#0055ff] tracking-widest text-sm uppercase"
									>
										Hosted By Kreuz_Audio
									</p>
								</div>
							</div>
							<div
								class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t-2 md:border-t-0 border-[#1a1a1a]"
							>
								<div class="text-right">
									<div
										class="text-xs font-bold uppercase tracking-wider text-gray-500"
									>
										Doors
									</div>
									<div class="text-xl font-bold">21:30</div>
								</div>
								<button
									class="w-full sm:w-auto bg-[#1a1a1a] text-white px-5 sm:px-8 py-3 sm:py-4 font-bold tracking-widest text-xs sm:text-sm uppercase hover:bg-black transition-colors ml-0"
								>
									Get_Tickets
								</button>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>

		<Footer />
	</div>
</template>
