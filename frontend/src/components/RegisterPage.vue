<script setup>
import Footer from "./Footer.vue";
import Header from "./Header.vue";
import { ref } from "vue";
import { useSignUp } from "@clerk/vue";
import { useRouter, RouterLink } from "vue-router";

const { isLoaded, signUp, setActive } = useSignUp();
const router = useRouter();

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");

const handleRegister = async () => {
	if (!isLoaded.value) return;
	if (password.value !== confirmPassword.value) {
		errorMessage.value = "PASSWORDS_DO_NOT_MATCH";
		return;
	}

	try {
		await signUp.value.create({
			firstName: firstName.value,
			lastName: lastName.value,
			emailAddress: email.value,
			password: password.value,
		});

		// Start configuration for email verification if needed
		if (signUp.value.status === "complete") {
			await setActive({ session: signUp.value.createdSessionId });
			router.push("/");
		} else {
			// If verification is required, you'd handle it here
			console.log("Verification required", signUp.value.status);
		}
	} catch (error) {
		console.error(error);
		if (error.errors && error.errors.length > 0) {
			errorMessage.value = (
				error.errors[0].longMessage || error.errors[0].message
			).toUpperCase();
		}
	}
};

const handleGoogleLogin = async () => {
	if (!isLoaded.value) return;

	signUp.value.authenticateWithRedirect({
		strategy: "oauth_google",
		redirectUrl: "/sso-callback",
		redirectUrlComplete: "/",
	});
};
</script>

<template>
	<div class="min-h-screen bg-[#f5f0e8] flex flex-col font-sans">
		<Header />

		<main class="grow flex flex-col lg:flex-row relative">
			<!-- Left Side: Aesthetic/Brand Section -->
			<div
				class="w-full lg:w-1/2 bg-[#ffcc00] border-b-[3px] lg:border-b-0 lg:border-r-[3px] border-[#1a1a1a] p-8 md:p-16 xl:p-24 flex flex-col relative overflow-hidden"
			>
				<!-- Abstract Background Graphics -->
				<div
					class="absolute bottom-[-10%] right-[15%] w-[80%] h-[120%] border-8 border-[#1a1a1a] opacity-[0.08] pointer-events-none transform rotate-15"
				></div>

				<!-- Content -->
				<div class="relative z-10 w-full xl:w-4/5 pt-8 font-['Space_Grotesk']">
					<div
						class="inline-block bg-[#f5f0e8] border-2 border-[#1a1a1a] text-[#1a1a1a] text-[10px] font-bold px-3 py-1.5 mb-14 tracking-widest uppercase"
					>
						REGISTRATION_MODULE.V01
					</div>

					<h1
						class="text-5xl sm:text-6xl md:text-[92px] font-black text-[#1a1a1a] leading-[0.9] tracking-tighter"
					>
						JOIN THE<br />
						COLLECTIVE
					</h1>
				</div>
			</div>

			<!-- Right Side: Form Section -->
			<div
				class="w-full lg:w-1/2 bg-[#f5f0e8] p-8 md:p-16 xl:p-24 flex flex-col justify-center font-['Space_Grotesk']"
			>
				<div class="mb-14">
					<h2
						class="text-4xl md:text-[40px] font-bold text-[#1a1a1a] tracking-tighter mb-2 uppercase"
					>
						CREATE ACCOUNT
					</h2>
					<div class="w-20 h-1.5 bg-[#e63b2e] border-y border-[#e63b2e]"></div>
				</div>

				<form action="#" method="POST" class="space-y-6 w-full max-w-xl">
					<div class="flex flex-col sm:flex-row gap-6">
						<div class="flex-1">
							<label
								for="firstName"
								class="block text-[#1a1a1a] text-[10px] font-bold tracking-widest uppercase mb-2"
								>FIRST NAME</label
							>
							<div class="border-[1.5px] border-[#1a1a1a] bg-transparent p-0.5">
								<input
									v-model="firstName"
									type="text"
									id="firstName"
									name="firstName"
									placeholder="FIRST NAME"
									class="w-full px-3 py-2.5 bg-transparent text-[#1a1a1a] placeholder-gray-400 text-sm focus:outline-none focus:ring-0 font-mono tracking-wider"
								/>
							</div>
						</div>

						<div class="flex-1">
							<label
								for="lastName"
								class="block text-[#1a1a1a] text-[10px] font-bold tracking-widest uppercase mb-2"
								>LAST NAME</label
							>
							<div class="border-[1.5px] border-[#1a1a1a] bg-transparent p-0.5">
								<input
									v-model="lastName"
									type="text"
									id="lastName"
									name="lastName"
									placeholder="LAST NAME"
									class="w-full px-3 py-2.5 bg-transparent text-[#1a1a1a] placeholder-gray-400 text-sm focus:outline-none focus:ring-0 font-mono tracking-wider"
								/>
							</div>
						</div>
					</div>

					<div>
						<label
							for="email"
							class="block text-[#1a1a1a] text-[10px] font-bold tracking-widest uppercase mb-2"
							>EMAIL ADDRESS</label
						>
						<div class="border-[1.5px] border-[#1a1a1a] bg-transparent p-0.5">
							<input
								v-model="email"
								type="email"
								id="email"
								name="email"
								placeholder="NAME@DOMAIN.COM"
								class="w-full px-3 py-2.5 bg-transparent text-[#1a1a1a] placeholder-gray-400 text-sm focus:outline-none focus:ring-0 font-mono tracking-wider"
							/>
						</div>
					</div>

					<div class="flex flex-col sm:flex-row gap-6">
						<div class="flex-1">
							<label
								for="password"
								class="block text-[#1a1a1a] text-[10px] font-bold tracking-widest uppercase mb-2"
								>PASSWORD</label
							>
							<div class="border-[1.5px] border-[#1a1a1a] bg-transparent p-0.5">
								<input
									v-model="password"
									type="password"
									id="password"
									name="password"
									placeholder="••••••••"
									class="w-full px-3 py-2.5 bg-transparent text-[#1a1a1a] placeholder-gray-400 text-sm focus:outline-none focus:ring-0 font-mono tracking-wider"
								/>
							</div>
						</div>

						<div class="flex-1">
							<label
								for="confirmPassword"
								class="block text-[#1a1a1a] text-[10px] font-bold tracking-widest uppercase mb-2"
								>CONFIRM PASSWORD</label
							>
							<div class="border-[1.5px] border-[#1a1a1a] bg-transparent p-0.5">
								<input
									v-model="confirmPassword"
									type="password"
									id="confirmPassword"
									name="confirmPassword"
									placeholder="••••••••"
									class="w-full px-3 py-2.5 bg-transparent text-[#1a1a1a] placeholder-gray-400 text-sm focus:outline-none focus:ring-0 font-mono tracking-wider"
								/>
							</div>
						</div>
					</div>

					<p
						v-if="errorMessage"
						class="text-[#e63b2e] text-[10px] font-bold uppercase"
					>
						{{ errorMessage }}
					</p>

					<button
						type="submit"
						class="w-full bg-[#ffcc00] text-[#1a1a1a] text-[16px] font-bold py-4 uppercase tracking-widest hover:bg-[#e6b800] transition-colors mt-8 border-[3px] border-[#1a1a1a] shadow-[6px_6px_0px_0px_#1a1a1a] active:translate-y-1.5 active:translate-x-1.5 active:shadow-none"
						@click.prevent="handleRegister"
					>
						INITIATE_ACCOUNT
					</button>
				</form>

				<div class="mt-8 flex items-center justify-center space-x-3 opacity-30">
					<div class="h-px bg-[#1a1a1a] grow"></div>
					<span
						class="text-[#1a1a1a] text-[10px] font-semibold uppercase tracking-widest whitespace-nowrap font-['Space_Grotesk']"
						>OR CONNECT WITH</span
					>
					<div class="h-px bg-[#1a1a1a] grow"></div>
				</div>

				<button
					class="w-full mt-6 flex items-center justify-center space-x-2 border-[3px] border-[#1a1a1a] bg-[#f5f0e8] text-[#1a1a1a] py-3.5 hover:bg-gray-100 transition-colors shadow-[4px_4px_0px_0px_#1a1a1a] active:translate-y-1 active:translate-x-1 active:shadow-none"
					@click.prevent="handleGoogleLogin"
				>
					<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z"
						/>
					</svg>
					<span
						class="text-[12px] font-extrabold uppercase tracking-widest font-['Space_Grotesk']"
						>SIGN UP WITH GOOGLE</span
					>
				</button>

				<div
					class="mt-14 border-t border-[#1a1a1a]/20 pt-8 flex items-center justify-between w-full max-w-xl"
				>
					<span
						class="text-[#1a1a1a] text-[10px] font-semibold uppercase tracking-widest opacity-60 font-['Inter']"
						style="opacity: 0.6"
						>EXISTING MEMBER?</span
					>
					<RouterLink
						to="/login"
						class="text-[#0055ff] hover:text-[#003399] text-[12px] font-bold uppercase tracking-widest inline-flex items-center"
					>
						RETURN_TO_LOGIN
					</RouterLink>
				</div>
			</div>
		</main>

		<Footer />
	</div>
</template>
