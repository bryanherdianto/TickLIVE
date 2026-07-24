<script setup>
import Footer from "./Footer.vue";
import Header from "./Header.vue";

const events = [
	{
		name: "Neon Nights Festival",
		date: "Aug 24, 2026",
		venue: "Wembley Stadium",
		tickets: "842 / 1,200",
		revenue: "$31,580",
		status: "Live",
	},
	{
		name: "The Underground Jazz",
		date: "Sep 12, 2026",
		venue: "Blue Note Lounge",
		tickets: "230 / 320",
		revenue: "$10,350",
		status: "Scheduled",
	},
	{
		name: "Street Cup Finals",
		date: "Oct 18, 2026",
		venue: "City Arena",
		tickets: "1,145 / 2,000",
		revenue: "$28,625",
		status: "Draft",
	},
];
</script>

<template>
	<div class="min-h-screen bg-[#f5f0e8] text-[#1a1a1a] font-['Space_Grotesk']">
		<Header />

		<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
			<section class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
				<div>
					<p class="text-[#e63b2e] font-bold uppercase tracking-widest mb-2">
						Organizer dashboard
					</p>
					<h1 class="text-5xl sm:text-7xl md:text-[96px] font-bold leading-none uppercase">
						My Events
					</h1>
					<div class="border-l-4 border-[#1a1a1a] pl-4 sm:pl-6 mt-5 max-w-2xl">
						<p class="text-base sm:text-xl font-['Inter']">
							Create and manage your events, track ticket sales, and monitor the revenue you earn.
						</p>
					</div>
				</div>
				<button
					type="button"
					class="bg-[#e63b2e] text-white px-6 py-4 font-bold uppercase border-2 border-[#1a1a1a] shadow-[4px_4px_0px_0px_#1a1a1a] hover:-translate-y-0.5 transition-transform"
				>
					+ Create Event
				</button>
			</section>

			<section class="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10 sm:mb-12">
				<div class="bg-[#ffcc00] border-2 border-[#1a1a1a] p-5 sm:p-6 shadow-[4px_4px_0px_0px_#1a1a1a]">
					<p class="text-sm font-bold uppercase tracking-wider mb-2">Total events</p>
					<h2 class="text-4xl font-bold">12</h2>
				</div>
				<div class="bg-white border-2 border-[#1a1a1a] p-5 sm:p-6 shadow-[4px_4px_0px_0px_#1a1a1a]">
					<p class="text-sm font-bold uppercase tracking-wider mb-2">Tickets sold</p>
					<h2 class="text-4xl font-bold">2,217</h2>
				</div>
				<div class="bg-[#05f] text-white border-2 border-[#1a1a1a] p-5 sm:p-6 shadow-[4px_4px_0px_0px_#1a1a1a]">
					<p class="text-sm font-bold uppercase tracking-wider mb-2">Total revenue</p>
					<h2 class="text-4xl font-bold">$70,555</h2>
				</div>
			</section>

			<section class="flex flex-col sm:flex-row gap-4 justify-between mb-6">
				<input
					type="search"
					placeholder="Search your events"
					aria-label="Search your events"
					class="w-full sm:max-w-sm bg-white border-2 border-[#1a1a1a] px-4 py-3 font-bold shadow-[4px_4px_0px_0px_#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
				/>
				<select
					aria-label="Filter events by status"
					class="bg-white border-2 border-[#1a1a1a] px-4 py-3 font-bold shadow-[4px_4px_0px_0px_#1a1a1a] focus:outline-none"
				>
					<option>All statuses</option>
					<option>Live</option>
					<option>Scheduled</option>
					<option>Draft</option>
				</select>
			</section>

			<section class="border-2 border-[#1a1a1a] bg-white shadow-[8px_8px_0px_0px_#1a1a1a] overflow-hidden">
				<div class="hidden md:grid grid-cols-12 gap-4 bg-[#faf7f2] border-b-2 border-[#1a1a1a] p-5 font-bold uppercase tracking-wider text-sm">
					<div class="col-span-4">Event</div>
					<div class="col-span-2">Date & venue</div>
					<div class="col-span-2 text-center">Tickets sold</div>
					<div class="col-span-2 text-center">Revenue</div>
					<div class="col-span-2 text-center">Actions</div>
				</div>
				<div class="divide-y-2 divide-[#1a1a1a]">
					<div
						v-for="event in events"
						:key="event.name"
						class="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5 p-5 items-center hover:bg-[#faf7f2] transition-colors"
					>
						<div class="md:col-span-4">
							<div class="flex items-center gap-3">
								<div class="w-12 h-12 shrink-0 bg-[#e63b2e] border-2 border-[#1a1a1a]"></div>
								<div>
									<h3 class="text-lg font-bold uppercase">{{ event.name }}</h3>
									<span class="inline-block mt-1 px-2 py-0.5 text-xs font-bold uppercase border border-[#1a1a1a]" :class="event.status === 'Live' ? 'bg-[#ffcc00]' : event.status === 'Draft' ? 'bg-gray-200' : 'bg-white'">{{ event.status }}</span>
								</div>
							</div>
						</div>
						<div class="md:col-span-2 flex md:block justify-between gap-4 text-sm font-['Inter']">
							<span class="md:hidden font-bold uppercase">Date & venue</span>
							<span>{{ event.date }}<br />{{ event.venue }}</span>
						</div>
						<div class="md:col-span-2 flex md:justify-center justify-between font-bold">
							<span class="md:hidden uppercase">Tickets sold</span><span>{{ event.tickets }}</span>
						</div>
						<div class="md:col-span-2 flex md:justify-center justify-between font-bold">
							<span class="md:hidden uppercase">Revenue</span><span>{{ event.revenue }}</span>
						</div>
						<div class="md:col-span-2">
							<button type="button" class="w-full bg-[#1a1a1a] text-white px-4 py-2 text-sm font-bold uppercase hover:bg-black transition-colors">Manage event</button>
						</div>
					</div>
				</div>
			</section>
		</main>

		<Footer />
	</div>
</template>
