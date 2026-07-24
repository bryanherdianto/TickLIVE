<script setup>
import Footer from "./Footer.vue";
import Header from "./Header.vue";
</script>

<template>
	<div class="min-h-screen bg-[#f5f0e8] text-[#1a1a1a] font-['Space_Grotesk']">
		<Header />

		<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
			<!-- Header Section -->
			<section class="mb-8 sm:mb-12">
				<h1 class="text-5xl sm:text-7xl md:text-[96px] font-bold leading-none mb-4 sm:mb-6">
					My Tickets
				</h1>
				<div class="border-l-4 border-[#1a1a1a] pl-4 sm:pl-6 max-w-2xl">
					<p class="text-base sm:text-xl font-['Inter']">
						Manage your upcoming experiences, download receipts, and view
						digital entry passes.
					</p>
				</div>
			</section>

			<!-- Filters & Summary Section -->
			<section class="flex flex-col lg:flex-row gap-5 sm:gap-6 mb-8 sm:mb-12 justify-between">
				<!-- Summary Cards -->
				<div class="flex gap-4 sm:gap-6 w-full lg:w-auto">
					<div
						class="bg-[#ffcc00] border border-[#1a1a1a] p-4 sm:p-6 w-full sm:w-53 shadow-[4px_4px_0px_0px_#1a1a1a]"
					>
						<h3 class="text-3xl sm:text-4xl font-bold mb-1 sm:mb-2">12</h3>
						<p class="text-xs sm:text-sm font-bold uppercase tracking-wider">
							Total Tickets
						</p>
					</div>
					<div
						class="bg-white border border-[#1a1a1a] p-4 sm:p-6 w-full sm:w-53 shadow-[4px_4px_0px_0px_#1a1a1a]"
					>
						<h3 class="text-3xl sm:text-4xl font-bold mb-1 sm:mb-2">03</h3>
						<p class="text-xs sm:text-sm font-bold uppercase tracking-wider">Upcoming</p>
					</div>
				</div>

				<!-- Action Buttons -->
				<div class="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-end">
					<div class="relative w-full sm:w-auto">
						<input
							type="text"
							placeholder="Search tickets..."
							class="w-full sm:w-64 bg-white border border-[#1a1a1a] px-4 py-3 shadow-[4px_4px_0px_0px_#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
						/>
					</div>
					<button
						class="w-full sm:w-auto bg-[#1a1a1a] text-white px-6 py-3 font-bold border border-[#1a1a1a] hover:bg-black transition-colors shadow-[4px_4px_0px_0px_#ffcc00]"
					>
						Filter By Date
					</button>
				</div>
			</section>

			<!-- Tickets List -->
			<section
				class="border border-[#1a1a1a] bg-white shadow-[8px_8px_0px_0px_#1a1a1a] overflow-hidden"
			>
				<!-- Table Header -->
				<div
					class="hidden md:grid grid-cols-12 gap-4 bg-[#faf7f2] border-b border-[#1a1a1a] p-6 font-bold uppercase tracking-wider text-sm"
				>
					<div class="col-span-5">Event Details</div>
					<div class="col-span-1 text-center">Qty</div>
					<div class="col-span-2 text-center">Price</div>
					<div class="col-span-2 text-center">Status</div>
					<div class="col-span-2 text-center">Actions</div>
				</div>

				<!-- Table Body -->
				<div class="divide-y divide-[#1a1a1a]">
					<!-- Row 1: Confirmed -->
					<div
					class="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 p-4 sm:p-6 items-center hover:bg-[#faf7f2] transition-colors"
					>
						<div class="col-span-1 md:col-span-5 flex gap-3 sm:gap-6 items-center">
							<div
								class="w-16 h-16 sm:w-24 sm:h-24 bg-gray-200 border border-[#1a1a1a] shrink-0"
							>
								<img
									src="https://placehold.co/96"
									alt="Neon Nights Festival"
									class="w-full h-full object-cover"
								/>
							</div>
							<div>
								<h3 class="text-lg sm:text-xl font-bold mb-1">Neon Nights Festival</h3>
								<p class="text-xs sm:text-sm font-['Inter'] text-gray-600">
									Aug 24, 2024 • Wembley Stadium
								</p>
							</div>
						</div>
						<div
							class="col-span-1 flex justify-between md:justify-center items-center"
						>
							<span class="md:hidden font-bold">Quantity:</span>
							<span class="font-bold">x2</span>
						</div>
						<div
							class="col-span-1 md:col-span-2 flex justify-between md:justify-center items-center"
						>
							<span class="md:hidden font-bold">Price:</span>
							<span class="font-bold">$240.00</span>
						</div>
						<div
							class="col-span-1 md:col-span-2 flex justify-between md:justify-center items-center"
						>
							<span class="md:hidden font-bold">Status:</span>
							<span
								class="bg-[#ffcc00] border border-[#1a1a1a] px-3 py-1 text-sm font-bold shadow-[2px_2px_0px_0px_#1a1a1a]"
								>Confirmed</span
							>
						</div>
						<div
							class="col-span-1 md:col-span-2 flex flex-col sm:flex-row xl:flex-row gap-2 justify-center"
						>
							<button
								class="w-full sm:w-auto bg-[#1a1a1a] text-white px-4 py-2 text-sm font-bold border border-[#1a1a1a] hover:bg-black transition-colors"
							>
								View Ticket
							</button>
							<button
								class="w-full sm:w-auto bg-white text-[#1a1a1a] px-4 py-2 text-sm font-bold border border-[#1a1a1a] hover:bg-gray-50 transition-colors"
							>
								Receipt
							</button>
						</div>
					</div>

					<!-- Row 2: Used -->
					<div
					class="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 p-4 sm:p-6 items-center bg-[#faf7f2] hover:bg-white transition-colors"
					>
						<div class="col-span-1 md:col-span-5 flex gap-3 sm:gap-6 items-center">
							<div
								class="w-16 h-16 sm:w-24 sm:h-24 bg-gray-200 border border-[#1a1a1a] shrink-0"
							>
								<img
									src="https://placehold.co/96"
									alt="The Underground Jazz"
									class="w-full h-full object-cover grayscale opacity-80"
								/>
							</div>
							<div class="opacity-80">
								<h3 class="text-lg sm:text-xl font-bold mb-1">The Underground Jazz</h3>
								<p class="text-xs sm:text-sm font-['Inter'] text-gray-600">
									Jul 12, 2024 • Blue Note Lounge
								</p>
							</div>
						</div>
						<div
							class="col-span-1 flex justify-between md:justify-center items-center opacity-80"
						>
							<span class="md:hidden font-bold">Quantity:</span>
							<span class="font-bold">x1</span>
						</div>
						<div
							class="col-span-1 md:col-span-2 flex justify-between md:justify-center items-center opacity-80"
						>
							<span class="md:hidden font-bold">Price:</span>
							<span class="font-bold">$45.00</span>
						</div>
						<div
							class="col-span-1 md:col-span-2 flex justify-between md:justify-center items-center"
						>
							<span class="md:hidden font-bold">Status:</span>
							<span
								class="bg-gray-200 border border-[#1a1a1a] px-3 py-1 text-sm font-bold text-gray-600 shadow-[2px_2px_0px_0px_#1a1a1a]"
								>Used</span
							>
						</div>
						<div
							class="col-span-1 md:col-span-2 flex flex-col sm:flex-row xl:flex-row gap-2 justify-center"
						>
							<button
								class="w-full sm:w-auto bg-white text-gray-500 px-4 py-2 text-sm font-bold border border-gray-300 cursor-not-allowed"
							>
								View Ticket
							</button>
							<button
								class="w-full sm:w-auto bg-white text-[#1a1a1a] px-4 py-2 text-sm font-bold border border-[#1a1a1a] hover:bg-gray-50 transition-colors"
							>
								Receipt
							</button>
						</div>
					</div>
				</div>
			</section>
		</main>

		<Footer />
	</div>
</template>
