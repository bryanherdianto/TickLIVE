<script setup>
import Footer from "./Footer.vue";
import Header from "./Header.vue";
import { LockClosedIcon, LifebuoyIcon } from "@heroicons/vue/24/outline";
</script>

<template>
	<div class="min-h-screen bg-[#f5f0e8] flex flex-col font-sans">
		<Header />

		<!-- Main Content -->
		<main class="grow py-12 px-6">
			<div class="max-w-7xl mx-auto">
				<!-- Progress Indicator -->
				<div class="mb-16 relative">
					<div
						class="flex items-center justify-between max-w-3xl mx-auto relative"
					>
						<!-- Progress Line Background -->
						<div
							class="absolute w-full h-1 bg-[#1a1a1a] top-6 left-0 -z-10"
						></div>

						<!-- Step 1: Active -->
						<div class="flex flex-col items-center z-10 bg-[#f5f0e8] px-2">
							<div
								class="w-12 h-12 bg-[#ffcc00] border-2 border-[#1a1a1a] shadow-[4px_4px_0_0_#1a1a1a] rounded-none flex items-center justify-center"
							>
								<span class="text-xl font-bold text-[#1a1a1a]">1</span>
							</div>
							<p
								class="font-['Space_Grotesk'] font-medium text-sm text-[#1a1a1a] mt-4"
							>
								User Info
							</p>
						</div>

						<!-- Step 2: Upcoming -->
						<div class="flex flex-col items-center z-10 bg-[#f5f0e8] px-2">
							<div
								class="w-12 h-12 bg-white border-2 border-[#1a1a1a] rounded-none flex items-center justify-center"
							>
								<span class="text-xl font-bold text-[#1a1a1a]">2</span>
							</div>
							<p
								class="font-['Space_Grotesk'] font-medium text-sm text-gray-500 mt-4"
							>
								Payment
							</p>
						</div>

						<!-- Step 3: Upcoming -->
						<div class="flex flex-col items-center z-10 bg-[#f5f0e8] px-2">
							<div
								class="w-12 h-12 bg-white border-2 border-[#1a1a1a] rounded-none flex items-center justify-center"
							>
								<span class="text-xl font-bold text-[#1a1a1a]">3</span>
							</div>
							<p
								class="font-['Space_Grotesk'] font-medium text-sm text-gray-500 mt-4"
							>
								Confirm
							</p>
						</div>
					</div>
				</div>

				<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<!-- Left Section: Form & Info Cards -->
					<div class="lg:col-span-2 space-y-8">
						<!-- User Info Form -->
						<div
							class="bg-white border-2 border-[#1a1a1a] shadow-[8px_8px_0_0_#1a1a1a] p-8"
						>
							<h2
								class="text-3xl font-bold text-[#1a1a1a] mb-8 uppercase font-['Space_Grotesk']"
							>
								User Information
							</h2>

							<form class="space-y-6">
								<!-- Full Name -->
								<div>
									<label
										class="block font-['Space_Grotesk'] font-semibold text-sm text-[#1a1a1a] mb-2"
										>Full Name</label
									>
									<input
										type="text"
										placeholder="Enter your full name"
										class="w-full px-4 py-3 border-2 border-[#1a1a1a] bg-white text-[#1a1a1a] placeholder-gray-400 font-['Space_Grotesk'] focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
									/>
								</div>

								<!-- Email & Phone -->
								<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<label
											class="block font-['Space_Grotesk'] font-semibold text-sm text-[#1a1a1a] mb-2"
											>Email Address</label
										>
										<input
											type="email"
											placeholder="your@email.com"
											class="w-full px-4 py-3 border-2 border-[#1a1a1a] bg-white text-[#1a1a1a] placeholder-gray-400 font-['Space_Grotesk'] focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
										/>
									</div>

									<div>
										<label
											class="block font-['Space_Grotesk'] font-semibold text-sm text-[#1a1a1a] mb-2"
											>Phone Number</label
										>
										<input
											type="tel"
											placeholder="+1 (555) 000-0000"
											class="w-full px-4 py-3 border-2 border-[#1a1a1a] bg-white text-[#1a1a1a] placeholder-gray-400 font-['Space_Grotesk'] focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
										/>
									</div>
								</div>

								<!-- Address -->
								<div>
									<label
										class="block font-['Space_Grotesk'] font-semibold text-sm text-[#1a1a1a] mb-2"
										>Address</label
									>
									<input
										type="text"
										placeholder="Street address"
										class="w-full px-4 py-3 border-2 border-[#1a1a1a] bg-white text-[#1a1a1a] placeholder-gray-400 font-['Space_Grotesk'] focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
									/>
								</div>

								<!-- City & Zip -->
								<div class="grid grid-cols-2 gap-6">
									<div>
										<label
											class="block font-['Space_Grotesk'] font-semibold text-sm text-[#1a1a1a] mb-2"
											>City</label
										>
										<input
											type="text"
											placeholder="City"
											class="w-full px-4 py-3 border-2 border-[#1a1a1a] bg-white text-[#1a1a1a] placeholder-gray-400 font-['Space_Grotesk'] focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
										/>
									</div>
									<div>
										<label
											class="block font-['Space_Grotesk'] font-semibold text-sm text-[#1a1a1a] mb-2"
											>Postal Code</label
										>
										<input
											type="text"
											placeholder="12345"
											class="w-full px-4 py-3 border-2 border-[#1a1a1a] bg-white text-[#1a1a1a] placeholder-gray-400 font-['Space_Grotesk'] focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
										/>
									</div>
								</div>

								<button
									type="submit"
									class="w-full mt-6 bg-[#ffcc00] hover:bg-yellow-400 font-['Space_Grotesk'] text-[#1a1a1a] uppercase font-bold text-lg py-4 border-2 border-[#1a1a1a] shadow-[4px_4px_0_0_#1a1a1a] transition-all active:translate-y-1 active:translate-x-1 active:shadow-none"
								>
									Continue to Payment
								</button>
							</form>
						</div>

						<!-- Secondary Info Cards -->
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
							<!-- Secure Checkout -->
							<div
								class="bg-[#ffdad6] border-2 border-[#1a1a1a] shadow-[4px_4px_0_0_#1a1a1a] p-6 flex flex-col items-start"
							>
								<LockClosedIcon class="h-10 w-10 text-[#1a1a1a]" />
								<h4
									class="font-['Space_Grotesk'] pt-4 font-bold text-[#1a1a1a] text-lg uppercase"
								>
									Secure Checkout
								</h4>
								<p class="font-sans text-sm text-[#1a1a1a] mt-1 font-normal">
									Your data is protected by industry-standard encryption. We
									never store raw payment details on our servers.
								</p>
							</div>

							<!-- 24/7 Support -->
							<div
								class="bg-[#d6e3ff] border-2 border-[#1a1a1a] shadow-[4px_4px_0_0_#1a1a1a] p-6 flex flex-col items-start"
							>
								<LifebuoyIcon class="h-10 w-10 text-[#1a1a1a]" />
								<h4
									class="font-['Space_Grotesk'] pt-4 font-bold text-[#1a1a1a] text-lg uppercase"
								>
									24/7 Support
								</h4>
								<p class="font-sans text-sm text-[#1a1a1a] mt-1 font-normal">
									Need help with your booking? Our Bauhaus-trained support team
									is ready to assist you any time.
								</p>
							</div>
						</div>
					</div>

					<!-- Right Section: Sidebar / Order Summary -->
					<div class="lg:col-span-1">
						<div
							class="bg-white border-2 border-[#1a1a1a] shadow-[8px_8px_0_0_#1a1a1a] p-8 mb-8 sticky top-28"
						>
							<h3
								class="text-2xl font-bold text-[#1a1a1a] font-['Space_Grotesk'] uppercase mb-6 border-b-2 border-[#1a1a1a] pb-4"
							>
								Order Summary
							</h3>

							<div class="space-y-4 font-['Space_Grotesk'] mb-6">
								<!-- Ticket Item -->
								<div class="flex justify-between items-start text-sm">
									<div>
										<span class="block font-bold text-[#1a1a1a]"
											>VIP Ticket x2</span
										>
										<span class="text-gray-500 text-xs mt-1 block"
											>Summer Music Festival</span
										>
									</div>
									<span class="font-bold text-[#1a1a1a]">$299.98</span>
								</div>

								<!-- Fees -->
								<div class="flex justify-between text-sm text-gray-600">
									<span>Service Fee</span>
									<span>$15.00</span>
								</div>
								<div class="flex justify-between text-sm text-gray-600">
									<span>Processing Fee</span>
									<span>$5.00</span>
								</div>
							</div>

							<!-- Total -->
							<div
								class="bg-[#1a1a1a] text-[#ffcc00] p-4 border-2 border-[#1a1a1a]"
							>
								<div
									class="flex justify-between font-['Space_Grotesk'] text-lg font-bold"
								>
									<span>Total</span>
									<span>$345.58</span>
								</div>
							</div>

							<!-- Promo Code -->
							<div class="mt-8 border-t-2 border-[#1a1a1a] pt-6">
								<label
									class="block font-['Space_Grotesk'] font-bold text-sm text-[#1a1a1a] mb-2"
									>Promo Code</label
								>
								<div class="flex gap-2">
									<input
										type="text"
										placeholder="TEST123"
										class="w-full px-3 py-2 border-2 border-[#1a1a1a] bg-white text-[#1a1a1a] placeholder-gray-400 font-['Space_Grotesk'] focus:outline-none"
									/>
									<button
										type="button"
										class="bg-[#1a1a1a] text-white uppercase px-4 py-2 font-['Space_Grotesk'] border-2 border-[#1a1a1a] font-bold text-sm hover:bg-gray-800 transition-colors"
									>
										Apply
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>

		<Footer />
	</div>
</template>
