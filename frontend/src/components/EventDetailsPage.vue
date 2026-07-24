<script setup lang="ts">
import { ref } from "vue";
import Header from "./Header.vue";
import Footer from "./Footer.vue";
import {
	CalendarIcon,
	MapPinIcon,
	TicketIcon,
	ClockIcon,
	PlayIcon,
} from "@heroicons/vue/24/outline";
import { HeartIcon } from "@heroicons/vue/20/solid";
</script>

<template>
	<div
		class="min-h-screen flex flex-col bg-[#f5f0e8] font-['Space_Grotesk'] text-[#1a1a1a]"
	>
		<Header />

		<main class="grow pb-10 p-4 sm:p-6 lg:p-12 max-w-7xl mx-auto w-full">
			<!-- Event Header Section -->
			<section
				class="border-b-4 border-[#1a1a1a] pb-8 sm:pb-12 mb-8 sm:mb-12 flex flex-col md:flex-row justify-between items-start gap-6 sm:gap-8"
			>
				<div class="flex-1 space-y-5 sm:space-y-8">
					<div
						class="inline-block bg-[#e63b2e] text-white px-4 py-2 border-[3px] border-[#1a1a1a] shadow-[4px_4px_0_0_#1a1a1a] font-bold text-sm tracking-widest uppercase"
					>
						Live Performance
					</div>

					<h1
						class="text-5xl sm:text-6xl md:text-8xl font-black leading-none uppercase tracking-tighter"
					>
						Cyber Punk<br />Orchestra
					</h1>

					<div class="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
						<button
							class="bg-[#ffcc00] hover:bg-[#ffe066] text-[#1a1a1a] border-[3px] border-[#1a1a1a] shadow-[6px_6px_0_0_#1a1a1a] hover:shadow-[2px_2px_0_0_#1a1a1a] hover:translate-x-1 hover:translate-y-1 transition-all px-8 py-2 font-bold text-lg flex items-center justify-center gap-2"
						>
							<TicketIcon class="w-6 h-6" />
							BUY TICKETS
						</button>
						<button
							class="bg-[#0055ff] hover:bg-[#3377ff] text-white border-[3px] border-[#1a1a1a] shadow-[6px_6px_0_0_#1a1a1a] hover:shadow-[2px_2px_0_0_#1a1a1a] hover:translate-x-1 hover:translate-y-1 transition-all px-8 py-2 font-bold text-lg flex items-center justify-center gap-2"
						>
							<HeartIcon class="w-6 h-6 text-white" />
							SAVE EVENT
						</button>
					</div>
				</div>

				<div
					class="md:w-2/5 md:pt-4 md:border-t-4 border-[#1a1a1a] md:pl-8 mt-0"
				>
					<p class="text-xl md:text-2xl font-medium leading-tight font-sans">
						"A sensory overload where classical strings meet industrial
						distortion. An auditory revolution in the heart of the concrete
						jungle."
					</p>
				</div>
			</section>

			<!-- Brutalist Gallery -->
			<section
				class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-16 h-auto md:h-125"
			>
				<div
					class="lg:col-span-2 border-4 border-[#1a1a1a] shadow-[8px_8px_0_0_#1a1a1a] bg-white h-60 sm:h-75 md:h-full relative overflow-hidden group cursor-pointer"
				>
					<img
						src="https://images.unsplash.com/photo-1540039155732-d6986c714be8?auto=format&fit=crop&q=80"
						alt="Cyberpunk aesthetic concert"
						class="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
					/>
					<div class="absolute inset-0 bg-transparent mix-blend-color"></div>
				</div>

				<div class="flex flex-col gap-4 sm:gap-6 h-full">
					<div
						class="flex-1 border-4 border-[#1a1a1a] shadow-[8px_8px_0_0_#1a1a1a] bg-white relative overflow-hidden group cursor-pointer h-40 sm:h-50 md:h-auto"
					>
						<img
							src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80"
							alt="Crowd at concert"
							class="w-full h-full object-cover filter contrast-125 sepia group-hover:sepia-0 transition-all duration-500"
						/>
					</div>
					<div
						class="flex-1 border-4 border-[#1a1a1a] shadow-[8px_8px_0_0_#1a1a1a] bg-white relative overflow-hidden group cursor-pointer h-40 sm:h-50 md:h-auto"
					>
						<img
							src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80"
							alt="Crowd at concert"
							class="w-full h-full object-cover filter contrast-125 sepia group-hover:sepia-0 transition-all duration-500"
						/>
					</div>
				</div>
			</section>

			<!-- Content Layout -->
			<div class="flex flex-col lg:flex-row gap-8 sm:gap-12 text-[#1a1a1a]">
				<!-- Left: Description -->
				<div class="flex-1 space-y-8 sm:space-y-12 pr-0 lg:pr-12">
					<section>
						<h2
							class="text-3xl sm:text-4xl font-bold border-b-4 border-[#1a1a1a] pb-2 mb-4 sm:mb-6 inline-block uppercase"
						>
							Overview
						</h2>
						<div class="text-base sm:text-lg space-y-4 sm:space-y-6 font-sans leading-relaxed">
							<p>
								Experience the clash of centuries. The Cyber Punk Orchestra
								brings together 60 classically trained musicians and 5
								electronic sound designers to create an unprecedented wall of
								sound.
							</p>
							<p>
								Expect reimagined symphonies layered with dirty synth basslines,
								glitch percussion, and immersive neo-noir lighting that will
								transport you to a dystopian future.
							</p>
						</div>
					</section>

					<section>
						<h2
							class="text-3xl sm:text-4xl font-bold border-b-4 border-[#1a1a1a] pb-2 mb-4 sm:mb-6 inline-block uppercase"
						>
							Lineup
						</h2>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div
								class="border-[3px] border-[#1a1a1a] p-4 bg-white shadow-[4px_4px_0_0_#1a1a1a] flex gap-4 items-center"
							>
								<img
									src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150"
									alt="Maestro Vorn"
									class="w-16 h-16 object-cover border-2 border-[#1a1a1a] shadow-[2px_2px_0_0_#1a1a1a]"
								/>
								<div>
									<span class="font-bold text-xl uppercase block leading-tight"
										>Maestro Vorn</span
									>
									<span
										class="text-sm border-2 border-[#1a1a1a] px-2 py-0.5 bg-[#ffcc00] mt-1 inline-block font-bold uppercase tracking-wider"
										>Conductor</span
									>
								</div>
							</div>
							<div
								class="border-[3px] border-[#1a1a1a] p-4 bg-white shadow-[4px_4px_0_0_#1a1a1a] flex gap-4 items-center"
							>
								<img
									src="https://images.unsplash.com/photo-1543132220-4bf3de6e10ae?auto=format&fit=crop&q=80&w=150&h=150"
									alt="Syntax Error"
									class="w-16 h-16 object-cover border-2 border-[#1a1a1a] shadow-[2px_2px_0_0_#1a1a1a]"
								/>
								<div>
									<span class="font-bold text-xl uppercase block leading-tight"
										>Syntax Error</span
									>
									<span
										class="text-sm border-2 border-[#1a1a1a] px-2 py-0.5 bg-[#e63b2e] text-white mt-1 inline-block font-bold uppercase tracking-wider"
										>Synths</span
									>
								</div>
							</div>
						</div>
					</section>

					<section>
						<h2
							class="text-3xl sm:text-4xl font-bold border-b-4 border-[#1a1a1a] pb-2 mb-4 sm:mb-6 inline-block uppercase"
						>
							Location Info
						</h2>
						<div
							class="border-4 border-[#1a1a1a] bg-white shadow-[8px_8px_0_0_#1a1a1a] p-4 sm:p-6 h-52 sm:h-60 flex items-center justify-center"
						>
							<div class="text-center space-y-2">
								<MapPinIcon class="w-12 h-12 mx-auto" />
								<p class="font-bold text-xl uppercase">The Neon Warehouse</p>
								<p class="font-sans">
									Sector 7, Industrial District<br />Neo-Tokyo
								</p>
							</div>
						</div>
						<p class="mt-4 sm:mt-6 font-bold uppercase">
							Sector 7, Industrial District, Neo-Tokyo
						</p>
					</section>
				</div>

				<!-- Right: Sidebar (Ticket details) -->
				<aside class="w-full lg:w-100">
					<div
						class="border-4 border-[#1a1a1a] bg-white shadow-[12px_12px_0_0_#1a1a1a] p-5 sm:p-8 lg:sticky top-28"
					>
						<h3
							class="text-3xl font-black uppercase mb-4 border-b-4 border-[#1a1a1a]"
						>
							Event Details
						</h3>

						<ul class="space-y-3 mb-4">
							<li class="flex items-start gap-4">
								<div
									class="bg-[#ffcc00] p-2 border-2 border-[#1a1a1a] shadow-[2px_2px_0_0_#1a1a1a]"
								>
									<CalendarIcon class="w-6 h-6" />
								</div>
								<div>
									<p class="font-bold uppercase text-sm text-gray-500">Date</p>
									<p class="font-bold text-xl">October 24, 2026</p>
								</div>
							</li>
							<li class="flex items-start gap-4">
								<div
									class="bg-[#ffcc00] p-2 border-2 border-[#1a1a1a] shadow-[2px_2px_0_0_#1a1a1a]"
								>
									<ClockIcon class="w-6 h-6" />
								</div>
								<div>
									<p class="font-bold uppercase text-sm text-gray-500">Time</p>
									<p class="font-bold text-xl">21:00 - 02:00 (EST)</p>
								</div>
							</li>
							<li class="flex items-start gap-4">
								<div
									class="bg-[#ffcc00] p-2 border-2 border-[#1a1a1a] shadow-[2px_2px_0_0_#1a1a1a]"
								>
									<MapPinIcon class="w-6 h-6" />
								</div>
								<div>
									<p class="font-bold uppercase text-sm text-gray-500">Venue</p>
									<p class="font-bold text-xl">The Neon Warehouse</p>
								</div>
							</li>
						</ul>

						<div class="bg-gray-100 border-[3px] border-[#1a1a1a] p-2 mb-4">
							<div class="flex justify-between items-center">
								<span class="font-bold uppercase">General Admission</span>
								<span class="font-black text-xl sm:text-2xl">$45.00</span>
							</div>
						</div>

						<button
							class="w-full bg-[#e63b2e] hover:bg-[#ff4433] text-white border-4 border-[#1a1a1a] shadow-[6px_6px_0_0_#1a1a1a] hover:shadow-[2px_2px_0_0_#1a1a1a] hover:translate-x-1 hover:translate-y-1 transition-all px-8 py-2 font-black text-2xl tracking-wide uppercase"
						>
							Checkout
						</button>
					</div>
				</aside>
			</div>
		</main>

		<Footer />
	</div>
</template>
