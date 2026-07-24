<script setup>
import {
	MapPinIcon,
	CalendarIcon,
	MusicalNoteIcon,
	PaintBrushIcon,
	TrophyIcon,
	SparklesIcon,
	BanknotesIcon,
} from "@heroicons/vue/24/outline";
import Footer from "./Footer.vue";
import Header from "./Header.vue";

const imgHeroBg = "/imgHeroBg.webp";
const imgTrending1 = "/imgTrending1.webp";
const imgTrending2 = "/imgTrending2.webp";
const imgTrending3 = "/imgTrending3.webp";
const imgVenue = "/imgVenue.webp";
</script>

<template>
	<div class="bg-[#f5f0e8] min-h-screen flex flex-col text-[#1a1a1a]">
		<Header />

		<!-- Hero Section -->
		<section
			class="max-w-360 mx-auto w-full px-4 sm:px-6 pt-4 sm:pt-6 pb-16 sm:pb-24 relative overflow-hidden font-['Space_Grotesk']"
		>
			<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 lg:min-h-124">
				<!-- Left: Text content -->
				<div class="lg:col-span-7 flex flex-col justify-center gap-6 lg:gap-8 z-10">
					<div class="relative h-48 sm:h-64 flex flex-col justify-center">
						<h1
							class="text-6xl sm:text-[128px] leading-none font-bold tracking-tighter uppercase whitespace-nowrap"
						>
							FIND YOUR
						</h1>
						<div class="-rotate-2">
							<span
								class="bg-[#fc0] px-4 text-7xl md:text-[128px] font-bold text-[#e63b2e] tracking-tighter uppercase leading-none inline-block"
							>
								VIBE
							</span>
						</div>
					</div>

					<div
						class="border-l-8 border-[#05f] pl-5 sm:pl-8 max-w-xl font-['Inter'] pt-4 lg:pt-0"
					>
						<p class="font-bold text-2xl leading-relaxed">
							The ultimate destination for sound, soul, and subculture. Get
							tickets to the most underground events.
						</p>
					</div>

					<div class="flex flex-wrap gap-4 pt-2">
						<RouterLink
							to="/events"
							class="bg-[#1a1a1a] border-4 border-[#1a1a1a] shadow-[8px_8px_0px_0px_#1a1a1a] px-9 py-5 text-white font-bold text-2xl uppercase hover:-translate-y-1 transition-transform"
						>
							Browse All Events
						</RouterLink>
						<RouterLink
							to="/login"
							class="bg-[#f5f0e8] border-4 border-[#1a1a1a] shadow-[8px_8px_0px_0px_#1a1a1a] px-9 py-5 font-bold text-2xl uppercase hover:-translate-y-1 transition-transform"
						>
							Host Event
						</RouterLink>
					</div>
				</div>

				<!-- Right: Image -->
				<div
					class="lg:col-span-5 relative flex items-center justify-center pt-8 sm:pt-12 lg:pt-0"
				>
					<div
						class="bg-[#05f] border-4 border-[#1a1a1a] shadow-[8px_8px_0px_0px_#1a1a1a] w-full p-1 relative z-0"
					>
					<div
						class="relative aspect-[4/5] md:aspect-auto md:h-119 w-full bg-cover bg-center grayscale mix-blend-luminosity"
						:style="{ backgroundImage: 'url(' + imgHeroBg + ')' }"
					></div>
					</div>
					<!-- Decorative element -->
					<div
						class="absolute -bottom-6 left-0 sm:-left-6 bg-[#fc0] border-4 border-[#1a1a1a] p-5 z-10"
					>
						<div class="font-bold text-4xl uppercase whitespace-nowrap">
							LIVE NOW
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Search Bar Section -->
		<div
			class="bg-[#1a1a1a] px-6 py-12 relative flex justify-center mt-8 font-['Space_Grotesk']"
		>
			<div
				class="-mt-24 bg-[#f5f0e8] border-4 border-[#1a1a1a] shadow-[8px_8px_0px_0px_#1a1a1a] p-3 flex flex-col md:flex-row gap-2 w-full max-w-5xl z-10"
			>
				<div
					class="bg-[#faf7f2] border-2 border-[#1a1a1a]/10 flex-1 flex items-center px-4 py-3"
				>
					<span class="text-[#e63b2e] mr-4"
						><MapPinIcon class="w-6 h-6"
					/></span>
					<input
						type="text"
						placeholder="Where to go?"
						class="bg-transparent outline-none w-full text-lg font-bold text-[#6b7280] uppercase placeholder:text-gray-500"
					/>
				</div>
				<div
					class="bg-[#faf7f2] border-2 border-[#1a1a1a]/10 flex-1 flex items-center px-4 py-3"
				>
					<span class="text-[#0055ff] mr-4"
						><CalendarIcon class="w-6 h-6"
					/></span>
					<input
						type="date"
						aria-label="Pick a date"
						class="bg-transparent outline-none w-full text-lg font-bold text-[#6b7280] uppercase placeholder:text-gray-500"
					/>
				</div>
				<button
					class="bg-[#fc0] border-2 border-[#1a1a1a] px-10 py-4 md:py-0 font-bold text-xl uppercase text-center hover:bg-yellow-400 transition-colors"
				>
					Search
				</button>
			</div>
		</div>

		<!-- Categories Section -->
		<div
			class="max-w-360 mx-auto w-full px-6 py-24 flex flex-col gap-16 font-['Space_Grotesk']"
		>
			<div>
				<h2
					class="text-5xl md:text-7xl font-bold uppercase tracking-tighter underline decoration-[#e63b2e] decoration-[6px] underline-offset-12"
				>
					Categories
				</h2>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
				<div
					class="bg-[#05f] border-4 border-[#1a1a1a] shadow-[4px_4px_0px_0px_#1a1a1a] h-67 p-8 flex flex-col justify-between hover:-translate-y-1 transition-transform cursor-pointer"
				>
					<div
						class="flex justify-between items-start text-white text-2xl font-bold"
					>
						<MusicalNoteIcon class="w-12 h-12" /><span>01</span>
					</div>
					<div>
						<h3 class="text-white text-4xl font-bold uppercase mb-1">Music</h3>
						<p class="text-white/80 font-bold text-sm uppercase font-['Inter']">
							Gig, Rave, Festival
						</p>
					</div>
				</div>
				<div
					class="bg-[#e63b2e] border-4 border-[#1a1a1a] shadow-[4px_4px_0px_0px_#1a1a1a] h-67 p-8 flex flex-col justify-between hover:-translate-y-1 transition-transform cursor-pointer"
				>
					<div
						class="flex justify-between items-start text-white text-2xl font-bold"
					>
						<PaintBrushIcon class="w-12 h-12" /><span>02</span>
					</div>
					<div>
						<h3 class="text-white text-4xl font-bold uppercase mb-1">Art</h3>
						<p class="text-white/80 font-bold text-sm uppercase font-['Inter']">
							Gallery, Street, Digital
						</p>
					</div>
				</div>
				<div
					class="bg-[#1a1a1a] border-4 border-[#1a1a1a] shadow-[4px_4px_0px_0px_#1a1a1a] h-67 p-8 flex flex-col justify-between hover:-translate-y-1 transition-transform cursor-pointer"
				>
					<div
						class="flex justify-between items-start text-white text-2xl font-bold"
					>
						<TrophyIcon class="w-12 h-12" /><span>03</span>
					</div>
					<div>
						<h3 class="text-white text-4xl font-bold uppercase mb-1">Sports</h3>
						<p class="text-white/80 font-bold text-sm uppercase font-['Inter']">
							Extreme, Pro, Local
						</p>
					</div>
				</div>
				<div
					class="bg-[#e2ddd4] border-4 border-[#1a1a1a] shadow-[4px_4px_0px_0px_#1a1a1a] h-67 p-8 flex flex-col justify-between hover:-translate-y-1 transition-transform cursor-pointer"
				>
					<div
						class="flex justify-between items-start text-[#1a1a1a] text-2xl font-bold"
					>
						<SparklesIcon class="w-12 h-12" /><span>04</span>
					</div>
					<div>
						<h3 class="text-[#1a1a1a] text-4xl font-bold uppercase mb-1">
							Nightlife
						</h3>
						<p
							class="text-[#1a1a1a]/60 font-bold text-sm uppercase font-['Inter']"
						>
							Clubbing, Bars, Pop-ups
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Trending Now Section -->
		<section
			class="bg-[#e8e3da] border-y-8 border-[#1a1a1a] py-24 px-6 font-['Space_Grotesk']"
		>
			<div class="max-w-360 mx-auto w-full flex flex-col gap-16">
				<div
					class="flex flex-col md:flex-row items-start md:items-end justify-between gap-8"
				>
					<div>
						<div class="text-[#e63b2e] text-2xl font-bold uppercase mb-2">
							The Hype
						</div>
						<h2
							class="text-5xl md:text-[96px] font-bold uppercase tracking-tighter leading-none"
						>
							Trending Now
						</h2>
					</div>
				</div>

				<div
					class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-150"
				>
					<div
						class="lg:col-span-2 lg:row-span-2 bg-[#f5f0e8] border-4 border-[#1a1a1a] shadow-[8px_8px_0px_0px_#1a1a1a] p-1 flex flex-col group relative z-0 overflow-hidden cursor-pointer hover:-translate-y-1 transition-transform"
					>
						<div class="relative bg-[#1a1a1a] h-75 lg:flex-1 z-10">
							<div
								class="absolute inset-0 bg-cover bg-center mix-blend-luminosity grayscale"
								:style="{ backgroundImage: 'url(' + imgTrending1 + ')' }"
							></div>
							<div
								class="absolute top-4 left-4 bg-[#e63b2e] border-2 border-[#1a1a1a] px-4 py-1"
							>
								<span class="font-bold text-white text-xl uppercase"
									>FRI 24 MAY</span
								>
							</div>
						</div>
						<div
							class="p-5 pb-4 sm:p-8 sm:pb-4 flex flex-col gap-4 bg-[#f5f0e8] z-20"
						>
							<h3 class="font-bold text-4xl uppercase leading-tight">
								Industrial Techno Night: Voids
							</h3>
							<div class="flex gap-6 items-center flex-wrap">
								<div class="flex items-center gap-2">
									<MapPinIcon class="w-6 h-6 text-[#e63b2e]" />
									<span class="font-bold text-base uppercase"
										>The Warehouse, Berlin</span
									>
								</div>
								<div class="flex items-center gap-2">
									<BanknotesIcon class="w-6 h-6 text-[#0055ff]" />
									<span class="font-bold text-base uppercase">From €45</span>
								</div>
							</div>
							<RouterLink
								to="/events"
								class="bg-[#1a1a1a] border-2 border-[#1a1a1a] mt-4 w-full py-4 text-center font-bold text-2xl text-white uppercase hover:bg-gray-800 transition-colors"
							>
								Grab Tickets
							</RouterLink>
						</div>
					</div>

					<RouterLink to="/events" class="block lg:col-span-2">
						<div
							class="bg-[#f5f0e8] border-4 border-[#1a1a1a] shadow-[4px_4px_0px_0px_#1a1a1a] p-1 flex flex-col sm:flex-row group overflow-hidden cursor-pointer hover:-translate-y-1 transition-transform"
						>
						<div class="sm:w-50 bg-[#e63b2e] relative">
							<div
								class="absolute inset-0 bg-cover bg-center grayscale mix-blend-luminosity"
								:style="{ backgroundImage: 'url(' + imgTrending2 + ')' }"
							></div>
						</div>
						<div class="flex-1 p-4 sm:p-6 flex flex-col justify-between">
							<div>
								<span
									class="bg-[#fc0] border-2 border-[#1a1a1a] px-2 py-1 text-xs font-bold uppercase mb-2 inline-block"
									>Art Exhibit</span
								>
								<h3 class="font-bold text-2xl uppercase mb-2">
									NEO-PIXEL 2024
								</h3>
								<p class="font-bold font-['Inter'] text-sm pb-4">
									Exploring the boundary of digital and physical.
								</p>
							</div>
							<div
								class="border-t-2 border-[#1a1a1a]/10 pt-4 flex justify-between items-center"
							>
								<span class="font-bold text-lg uppercase">€15</span>
								<span class="text-xl">➔</span>
							</div>
						</div>
						</div>
					</RouterLink>

					<RouterLink to="/events" class="block lg:col-span-2">
						<div
							class="bg-[#f5f0e8] border-4 border-[#1a1a1a] shadow-[4px_4px_0px_0px_#1a1a1a] p-1 flex flex-col sm:flex-row group overflow-hidden cursor-pointer hover:-translate-y-1 transition-transform"
						>
						<div class="sm:w-50 bg-[#05f] relative">
							<div
								class="absolute inset-0 bg-cover bg-center grayscale mix-blend-luminosity"
								:style="{ backgroundImage: 'url(' + imgTrending3 + ')' }"
							></div>
						</div>
						<div class="flex-1 p-4 sm:p-6 flex flex-col justify-between">
							<div>
								<span
									class="bg-[#05f] text-white border-2 border-[#1a1a1a] px-2 py-1 text-xs font-bold uppercase mb-2 inline-block"
									>Sports</span
								>
								<h3 class="font-bold text-2xl uppercase mb-2">
									STREET CUP FINALS
								</h3>
								<p class="font-bold font-['Inter'] text-sm pb-4">
									The ultimate underground soccer showdown.
								</p>
							</div>
							<div
								class="border-t-2 border-[#1a1a1a]/10 pt-4 flex justify-between items-center"
							>
								<span class="font-bold text-lg uppercase">€20</span>
								<span class="text-xl">➔</span>
							</div>
						</div>
						</div>
					</RouterLink>
				</div>
			</div>
		</section>

		<!-- Venue of the Month Section -->
		<section
			class="max-w-360 mx-auto w-full px-6 py-24 sm:py-32 font-['Space_Grotesk'] overflow-hidden"
		>
			<div
				class="bg-[#1a1a1a] p-8 sm:p-16 flex flex-col lg:flex-row gap-12 relative"
			>
				<div class="flex-1 flex flex-col justify-center relative z-10">
					<h2
						class="text-white text-5xl md:text-[72px] font-bold uppercase tracking-tighter leading-none mb-6"
					>
						Venue of the<br />Month
					</h2>
					<h3
						class="text-[#fc0] text-2xl md:text-4xl font-bold uppercase tracking-widest mb-8"
					>
						THE CONCRETE CUBE
					</h3>
					<div class="border-l-4 border-[#fc0] pl-6 mb-12 max-w-md">
						<p
							class="text-white/80 font-bold font-['Inter'] text-lg md:text-xl leading-relaxed"
						>
							A brutalist masterpiece repurposed into the city's premier
							underground acoustics space. Raw walls, pristine sound.
						</p>
					</div>
					<RouterLink
						to="/venues"
						class="bg-white border-4 border-white text-[#1a1a1a] px-9 py-5 font-bold text-2xl uppercase self-start hover:bg-gray-200 transition-colors"
					>
						Explore Venue
					</RouterLink>
				</div>

				<div
					class="flex-1 relative z-10 flex justify-center items-center h-75 lg:h-auto"
				>
					<div
						class="border-8 border-white p-2 shadow-[8px_8px_0px_0px_#1a1a1a] w-full max-w-lg bg-[#1a1a1a] h-full lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:w-125 lg:h-100"
					>
						<img
							:src="imgVenue"
							class="w-full h-full object-cover grayscale mix-blend-luminosity"
							alt="Venue"
						/>
					</div>
				</div>

				<!-- Decorative BG shape -->
				<div
					class="absolute -right-48 -top-48 w-96 h-96 bg-[#e63b2e] rotate-45 z-0"
				></div>
			</div>
		</section>

		<!-- Newsletter CTA -->
		<section
			class="max-w-360 w-full mx-auto px-6 mb-24 relative z-20 font-['Space_Grotesk']"
		>
			<div
				class="bg-[#fc0] border-8 border-[#1a1a1a] shadow-[8px_8px_0px_0px_#1a1a1a] p-12 md:p-24 flex flex-col items-center justify-center text-center gap-6"
			>
				<h2
					class="text-6xl md:text-[96px] font-bold uppercase tracking-tighter leading-none text-[#1a1a1a] max-w-3xl"
				>
					DON'T MISS OUT.
				</h2>
				<p
					class="font-bold text-xl md:text-2xl uppercase text-[#1a1a1a] max-w-3xl mb-4"
				>
					Get the secret codes for underground events delivered weekly.
				</p>
			</div>
		</section>

		<Footer />
	</div>
</template>
