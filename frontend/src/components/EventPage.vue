<script setup>
import {
	MapPinIcon,
	ChevronDownIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
} from "@heroicons/vue/24/outline";
import Footer from "./Footer.vue";
import Header from "./Header.vue";

const events = [
	{
		id: 1,
		image:
			"https://www.figma.com/api/mcp/asset/cfe1ea24-9e23-4b7a-a10f-bb946ed9f748",
		badgeText: "ON SALE",
		badgeColor: "bg-[#1a1a1a] text-white",
		price: "$89.00",
		category: "MUSIC / TECHNO",
		date: "OCT 24",
		title: ["Digital Pulse:", "Berlin", "Underground"],
		location: "KRAFTWERK, BERLIN",
	},
	{
		id: 2,
		image:
			"https://www.figma.com/api/mcp/asset/1207d599-3e2e-4765-b1e7-50bb23f321cd",
		badgeText: "LIMITED",
		badgeColor: "bg-[#e63b2e] text-white",
		price: "$249.00",
		category: "CONFERENCE / AI",
		date: "NOV 12-14",
		title: ["Future", "Intelligence", "Summit 2024"],
		location: "THE HUB, LONDON",
	},
	{
		id: 3,
		image:
			"https://www.figma.com/api/mcp/asset/ccf75be9-b933-424f-aa3d-714655145fcc",
		badgeText: "NEW",
		badgeColor: "bg-[#05f] text-white",
		price: "FREE",
		category: "ARTS / EXHIBITION",
		date: "DEC 05",
		title: ["Form &", "Function:", "Bauhaus", "Today"],
		location: "MET MODERN, NYC",
	},
	{
		id: 4,
		image:
			"https://www.figma.com/api/mcp/asset/f05f1f65-e760-4104-9aa0-afc3a0341e05",
		badgeText: "LAST FEW",
		badgeColor: "bg-[#e63b2e] text-white",
		price: "$120.00",
		category: "SPORTS / BASKETBALL",
		date: "OCT 29",
		title: ["Urban Dunk", "Championship", "2024"],
		location: "CITY ARENA, CHICAGO",
	},
	{
		id: 5,
		image:
			"https://www.figma.com/api/mcp/asset/410604b3-7f25-4b2c-902c-cc20bcd202bc",
		badgeText: "ON SALE",
		badgeColor: "bg-[#1a1a1a] text-white",
		price: "$150.00",
		category: "MUSIC / FESTIVAL",
		date: "AUG 15-18",
		title: ["Solaris", "Soundscapes", "Festival"],
		location: "THE VALLEY, CALIFORNIA",
	},
	{
		id: 6,
		image:
			"https://www.figma.com/api/mcp/asset/1515f29b-478b-4209-aadc-0029a06978ab",
		badgeText: "NEW",
		badgeColor: "bg-[#05f] text-white",
		price: "$45.00",
		category: "NETWORKING / BIZ",
		date: "NOV 03",
		title: ["Creative", "Founders", "Meetup"],
		location: "SKYLINE LOUNGE, TOKYO",
	},
];

const categories = ["MUSIC", "TECH", "ARTS", "SPORTS"];
</script>

<template>
	<div class="bg-[#f5f0e8] min-h-screen flex flex-col font-['Space_Grotesk']">
		<Header />

		<div
			class="content-stretch flex items-start pt-24 relative shrink-0 w-full"
		>
			<!-- Sidebar (Filters) -->
			<aside
				class="bg-[#f5f0e8] border-[#1a1a1a] border-r-4 border-solid flex flex-col items-start justify-between pl-8 pr-9 py-8 relative shrink-0 w-80"
			>
				<div class="relative shrink-0 w-full">
					<div
						class="content-stretch flex flex-col items-start pb-10 relative w-full"
					>
						<div
							class="content-stretch flex flex-col gap-2 items-start relative shrink-0 w-full"
						>
							<h2
								class="font-bold leading-8 text-[#1a1a1a] text-2xl uppercase m-0"
							>
								Filters
							</h2>
							<p
								class="font-['Inter'] font-bold leading-4 text-[#4a4a4a] text-xs uppercase m-0"
							>
								Refine your search
							</p>
						</div>
					</div>

					<div
						class="content-stretch flex flex-col gap-8 items-start relative w-full"
					>
						<!-- Category Filter -->
						<div
							class="content-stretch flex flex-col gap-4 items-start relative shrink-0 w-full"
						>
							<div
								class="border-[#1a1a1a] border-b-2 border-solid content-stretch flex flex-col items-start pb-2.5 relative shrink-0 w-full"
							>
								<h3
									class="font-bold h-7 leading-7 text-[#1a1a1a] text-lg uppercase m-0"
								>
									Category
								</h3>
							</div>
							<div
								class="content-stretch flex flex-col gap-2 items-start relative shrink-0 w-full"
							>
								<label
									v-for="category in categories"
									:key="category"
									class="content-stretch flex gap-3 items-center relative shrink-0 w-full cursor-pointer"
								>
									<input
										type="checkbox"
										class="appearance-none bg-white border-2 border-[#1a1a1a] border-solid shrink-0 size-5 checked:bg-[#1a1a1a]"
									/>
									<span
										class="font-bold h-6 leading-6 text-[#1a1a1a] text-base"
										>{{ category }}</span
									>
								</label>
							</div>
						</div>

						<!-- Date Filter -->
						<div
							class="content-stretch flex flex-col gap-4 items-start relative shrink-0 w-full"
						>
							<div
								class="border-[#1a1a1a] border-b-2 border-solid content-stretch flex flex-col items-start pb-2.5 relative shrink-0 w-full"
							>
								<h3
									class="font-bold h-7 leading-7 text-[#1a1a1a] text-lg uppercase m-0"
								>
									Date
								</h3>
							</div>
							<div
								class="gap-x-2 gap-y-2 grid grid-cols-2 relative shrink-0 w-full"
							>
								<button
									class="border-2 border-[#1a1a1a] border-solid flex flex-col items-center justify-center py-2.5 relative font-bold text-[#1a1a1a] text-xs uppercase hover:bg-[#1a1a1a] hover:text-white transition-colors duration-200"
								>
									Today
								</button>
								<button
									class="border-2 border-[#1a1a1a] border-solid flex flex-col items-center justify-center py-2.5 relative font-bold text-[#1a1a1a] text-xs uppercase hover:bg-[#1a1a1a] hover:text-white transition-colors duration-200"
								>
									This Week
								</button>
								<button
									class="border-2 border-[#1a1a1a] border-solid flex flex-col items-center justify-center py-2.5 relative font-bold text-[#1a1a1a] text-xs uppercase hover:bg-[#1a1a1a] hover:text-white transition-colors duration-200"
								>
									Next Week
								</button>
								<button
									class="border-2 border-[#1a1a1a] border-solid flex flex-col items-center justify-center py-2.5 relative font-bold text-[#1a1a1a] text-xs uppercase hover:bg-[#1a1a1a] hover:text-white transition-colors duration-200"
								>
									Custom
								</button>
							</div>
						</div>

						<!-- Price Filter -->
						<div class="h-24 relative shrink-0 w-full">
							<div
								class="absolute border-[#1a1a1a] border-b-2 border-solid content-stretch flex flex-col items-start left-0 pb-2.5 right-0 top-0"
							>
								<h3
									class="font-bold h-7 leading-7 text-[#1a1a1a] text-lg uppercase m-0"
								>
									Price
								</h3>
							</div>
							<div
								class="absolute bg-[#eee9e0] border-2 border-[#1a1a1a] border-solid h-2 left-0 right-0 top-14"
							></div>
							<div
								class="absolute content-stretch flex h-6 items-start justify-between left-0 right-0 top-20"
							>
								<span class="font-bold h-6 leading-6 text-[#1a1a1a] text-base"
									>$0</span
								>
								<span class="font-bold h-6 leading-6 text-[#1a1a1a] text-base"
									>$500+</span
								>
							</div>
						</div>

						<!-- Location Filter -->
						<div
							class="content-stretch flex flex-col gap-4 items-start relative shrink-0 w-full"
						>
							<div
								class="border-[#1a1a1a] border-b-2 border-solid content-stretch flex flex-col items-start pb-2.5 relative shrink-0 w-full"
							>
								<h3
									class="font-bold h-7 leading-7 text-[#1a1a1a] text-lg uppercase m-0"
								>
									Location
								</h3>
							</div>
							<div
								class="bg-white border-2 border-[#1a1a1a] border-solid h-11 relative shrink-0 w-full flex items-center px-2"
							>
								<span
									class="font-bold h-6 leading-6 text-[#1a1a1a] text-base flex-1"
									>ALL CITIES</span
								>
								<MapPinIcon class="size-6 text-[#1a1a1a] ml-2 shrink-0" />
							</div>
						</div>
					</div>
				</div>

				<div class="flex-[1_0_0] min-h-14 relative w-full pt-6">
					<button
						class="bg-[#1a1a1a] flex flex-col items-center justify-center py-4 w-full font-bold text-base text-white uppercase hover:bg-black/80 transition-colors duration-200"
					>
						Clear All
					</button>
				</div>
			</aside>

			<!-- Main Content -->
			<main
				class="content-stretch flex flex-[1_0_0] flex-col items-start p-10 relative self-stretch"
			>
				<div
					class="content-stretch flex flex-col gap-12 items-start max-w-5xl relative shrink-0 w-full mx-auto"
				>
					<div
						class="content-stretch flex items-end justify-between relative shrink-0 w-full"
					>
						<div
							class="content-stretch flex flex-col gap-4 items-start relative shrink-0"
						>
							<h1
								class="font-bold leading-tight text-[#1a1a1a] text-8xl tracking-tighter uppercase m-0"
							>
								Events
							</h1>
							<p
								class="font-bold leading-7 text-[#e63b2e] text-xl uppercase underline m-0"
							>
								74 Active Experiences Found
							</p>
						</div>

						<button
							class="bg-transparent border-4 border-[#1a1a1a] border-solid flex gap-2 items-center px-7 py-4 shadow-[4px_4px_0px_0px_#1a1a1a] font-bold text-[#1a1a1a] text-base uppercase hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#1a1a1a] transition-all duration-200 active:translate-y-1 active:shadow-none"
						>
							<span class="leading-6">Sort: Relevant</span>
							<ChevronDownIcon class="h-5 w-5" stroke-width="2.5" />
						</button>
					</div>

					<!-- Events Bento Grid -->
					<div
						class="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative shrink-0 w-full"
					>
						<div
							v-for="event in events"
							:key="event.id"
							class="bg-white border-4 border-[#1a1a1a] border-solid content-stretch flex flex-col isolate items-start justify-self-stretch overflow-clip p-1 relative shadow-[8px_8px_0px_0px_#1a1a1a] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_#1a1a1a] transition-all duration-200 cursor-pointer group"
						>
							<!-- Event Image & Badges -->
							<div
								class="border-[#1a1a1a] border-b-4 border-solid h-64 relative shrink-0 w-full z-10 overflow-hidden"
							>
								<img
									:src="event.image"
									class="absolute h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
									alt="Event Cover"
								/>

								<div
									:class="['absolute left-4 top-4 px-3 py-1', event.badgeColor]"
								>
									<span class="font-bold leading-5 text-sm uppercase">{{
										event.badgeText
									}}</span>
								</div>

								<div
									class="absolute bg-[#fc0] border-2 border-[#1a1a1a] border-solid bottom-4 right-4 px-4.5 py-2.5"
								>
									<span class="font-bold leading-7 text-[#1a1a1a] text-xl">{{
										event.price
									}}</span>
								</div>
							</div>

							<!-- Event Details -->
							<div
								class="flex flex-col items-start justify-between p-4 relative w-full grow"
							>
								<div class="flex flex-col w-full">
									<div
										class="flex font-bold items-start justify-between text-sm uppercase w-full pb-4"
									>
										<span class="text-[#05f]">{{ event.category }}</span>
										<span class="text-[#1a1a1a]">{{ event.date }}</span>
									</div>

									<h3
										class="font-bold text-[#1a1a1a] text-2xl uppercase leading-tight pb-6 m-0"
									>
										<p
											v-for="(line, index) in event.title"
											:key="index"
											class="m-0"
										>
											{{ line }}
										</p>
									</h3>
								</div>

								<div class="flex flex-col w-full mt-auto">
									<div class="flex gap-2 items-center w-full pb-6">
										<MapPinIcon
											class="h-4.5 w-4.5 text-[#1a1a1a]"
											stroke-width="2"
										/>
										<span class="font-bold text-[#4a4a4a] text-sm uppercase">{{
											event.location
										}}</span>
									</div>

									<button
										class="w-full border-2 border-[#1a1a1a] border-solid py-3.5 font-bold text-[#1a1a1a] text-base uppercase hover:bg-[#1a1a1a] hover:text-white transition-colors duration-200"
									>
										Get Tickets
									</button>
								</div>
							</div>
						</div>
					</div>

					<!-- Pagination -->
					<div
						class="content-stretch flex gap-4 items-start justify-center pt-4 relative shrink-0 w-full pb-12"
					>
						<button
							class="bg-[#f5f0e8] border-4 border-[#1a1a1a] border-solid flex items-center justify-center p-1 size-14 hover:bg-[#1a1a1a] hover:text-white group transition-colors duration-200"
						>
							<ChevronLeftIcon
								class="size-6 text-[#1a1a1a] group-hover:text-white transition-colors duration-200"
								stroke-width="2.5"
							/>
						</button>
						<button
							class="bg-[#1a1a1a] border-4 border-[#1a1a1a] border-solid flex items-center justify-center size-14 font-bold text-base text-white"
						>
							1
						</button>
						<button
							class="bg-[#f5f0e8] border-4 border-[#1a1a1a] border-solid flex items-center justify-center size-14 font-bold text-[#1a1a1a] text-base hover:bg-[#1a1a1a] hover:text-white transition-colors duration-200"
						>
							2
						</button>
						<button
							class="bg-[#f5f0e8] border-4 border-[#1a1a1a] border-solid flex items-center justify-center size-14 font-bold text-[#1a1a1a] text-base hover:bg-[#1a1a1a] hover:text-white transition-colors duration-200"
						>
							3
						</button>
						<button
							class="bg-[#f5f0e8] border-4 border-[#1a1a1a] border-solid flex items-center justify-center p-1 size-14 hover:bg-[#1a1a1a] hover:text-white group transition-colors duration-200"
						>
							<ChevronRightIcon
								class="size-6 text-[#1a1a1a] group-hover:text-white transition-colors duration-200"
								stroke-width="2.5"
							/>
						</button>
					</div>
				</div>
			</main>
		</div>

		<Footer />
	</div>
</template>
