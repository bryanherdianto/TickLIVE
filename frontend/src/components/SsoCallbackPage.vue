<script setup>
import { AuthenticateWithRedirectCallback } from "@clerk/vue";
</script>

<template>
	<main
		class="min-h-screen bg-[#f5f0e8] flex items-center justify-center p-6 font-['Space_Grotesk']"
	>
		<div
			class="bg-white border-4 border-[#1a1a1a] shadow-[8px_8px_0_0_#1a1a1a] p-8 text-center"
		>
			<p class="font-bold uppercase tracking-widest">Completing sign in...</p>
			<AuthenticateWithRedirectCallback />
		</div>
	</main>
</template>
