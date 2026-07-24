<script setup>
import { RouterLink } from "vue-router";
const currentYear = new Date().getFullYear();
</script>

<template>
	<footer
		class="bg-[#1a1a1a] border-t-8 border-[#e63b2e] font-['Space_Grotesk']"
	>
		<div
			class="max-w-360 mx-auto w-full px-6 py-12 flex flex-col lg:flex-row justify-between gap-12 lg:gap-8"
		>
			<div class="max-w-xs flex flex-col gap-6">
				<RouterLink
					to="/"
					class="font-bold font-['Space_Grotesk'] text-4xl text-[#fc0] uppercase cursor-pointer"
				>
					TICKIFY
				</RouterLink>
				<p class="font-bold text-sm text-[#f5f0e8] uppercase leading-relaxed">
					A platform built for those who find beauty in the raw, the loud, and
					the authentic.
				</p>
				<div class="flex gap-4">
					<a
						href="https://x.com/herdiantob48589"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Visit our X profile"
						class="bg-[#f5f0e8] p-2 border-2 border-[#1a1a1a] hover:bg-gray-300 transition-colors"
					>
						<svg
							class="w-6 h-6 text-[#1a1a1a]"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
							/>
						</svg>
					</a>
					<a
						href="https://www.instagram.com/bryan_herdianto"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Visit our Instagram profile"
						class="bg-[#f5f0e8] p-2 border-2 border-[#1a1a1a] hover:bg-gray-300 transition-colors"
					>
						<svg
							class="w-6 h-6 text-[#1a1a1a]"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
							/>
						</svg>
					</a>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-12 xl:gap-24">
				<div class="flex flex-col gap-4">
					<h4 class="font-bold text-lg text-[#e63b2e] uppercase mb-1">Explore</h4>
					<RouterLink
						to="/events"
						class="font-bold text-sm text-[#f5f0e8] uppercase hover:underline"
						>Events</RouterLink
					>
					<RouterLink
						to="/venues"
						class="font-bold text-sm text-[#f5f0e8] uppercase hover:underline"
						>Venues</RouterLink
					>
					<RouterLink
						to="/tickets"
						class="font-bold text-sm text-[#f5f0e8] uppercase hover:underline"
						>Tickets</RouterLink
					>
					<RouterLink
						to="/my-venues"
						class="font-bold text-sm text-[#f5f0e8] uppercase hover:underline"
						>My Venues</RouterLink
					>
					<RouterLink
						to="/my-events"
						class="font-bold text-sm text-[#f5f0e8] uppercase hover:underline"
						>My Events</RouterLink
					>
				</div>
				<div class="flex flex-col gap-4">
					<h4 class="font-bold text-lg text-[#05f] uppercase mb-1">Account</h4>
					<RouterLink
						to="/login"
						class="font-bold text-sm text-[#f5f0e8] uppercase hover:underline"
						>Sign In</RouterLink
					>
					<RouterLink
						to="/register"
						class="font-bold text-sm text-[#f5f0e8] uppercase hover:underline"
						>Create Account</RouterLink
					>
				</div>
			</div>
		</div>

		<div class="border-t-4 border-white/10 mt-4 px-6 py-8 flex justify-center">
			<p
				class="font-bold text-sm text-[#f5f0e8]/50 uppercase tracking-widest text-center"
			>
				© {{ currentYear }} TICKIFY. FORM FOLLOWS FUNCTION.
			</p>
		</div>
	</footer>
</template>
