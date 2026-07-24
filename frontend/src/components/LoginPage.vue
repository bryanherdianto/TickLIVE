<script setup>
import Footer from "./Footer.vue";
import Header from "./Header.vue";
import { ref } from "vue";
import { useSignIn } from "@clerk/vue";
import { useRouter, RouterLink } from "vue-router";

const { isLoaded, signIn, setActive } = useSignIn();
const router = useRouter();

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const isSubmitting = ref(false);

const getClerkErrorMessage = (error) =>
	error?.errors?.[0]?.longMessage ||
	error?.errors?.[0]?.message ||
	"Unable to sign in. Please try again.";

const handleLogin = async () => {
	if (!isLoaded.value || !signIn.value || !setActive.value) return;
	errorMessage.value = "";
	isSubmitting.value = true;

	try {
		const result = await signIn.value.create({
			identifier: email.value,
			password: password.value,
		});

		if (result.status === "complete") {
			await setActive.value({ session: result.createdSessionId });
			router.push("/");
		} else {
			errorMessage.value = "Additional verification is required to sign in.";
		}
	} catch (error) {
		errorMessage.value = getClerkErrorMessage(error);
	} finally {
		isSubmitting.value = false;
	}
};

const handleGoogleLogin = async () => {
	if (!isLoaded.value || !signIn.value) return;
	errorMessage.value = "";

	try {
		await signIn.value.authenticateWithRedirect({
			strategy: "oauth_google",
			redirectUrl: "/sso-callback",
			redirectUrlComplete: "/",
		});
	} catch (error) {
		errorMessage.value = getClerkErrorMessage(error);
	}
};
</script>

<template>
	<div class="min-h-screen bg-[#f5f0e8] flex flex-col font-sans">
		<Header />

		<main
			class="grow flex items-center justify-center p-6 md:p-12 relative overflow-hidden"
		>
			<!-- Main Card Container -->
			<div
				class="w-full max-w-6xl flex flex-col lg:flex-row bg-[#faf7f2] border-[3px] border-black shadow-[6px_6px_0px_0px_#1a1a1a]"
			>
				<!-- Left Side: Visual/Branding -->
				<div
					class="lg:w-[58%] bg-[#ffcc00] border-b-[3px] lg:border-b-0 lg:border-r-[3px] border-black p-4 sm:p-8 md:p-12 flex flex-col justify-between relative overflow-hidden"
				>
					<!-- Abstract Background borders -->
					<div
						class="absolute top-60 right-[10%] w-64 h-64 border-18 border-black opacity-[0.08]"
					></div>
					<div
						class="absolute bottom-12 left-16 w-0 h-0 border-l-120 border-l-transparent border-r-120 border-r-transparent border-b-200 border-b-black opacity-[0.08]"
					></div>

					<!-- Content -->
					<div class="relative z-10 w-full sm:pt-4 font-['Space_Grotesk']">
						<div
							class="inline-block bg-[#1a1a1a] text-[#ffcc00] text-xs font-bold px-3 py-1 mb-8 tracking-widest uppercase"
						>
							ACCESS PROTOCOL
						</div>

						<h1
							class="text-[45px] sm:text-6xl md:text-[88px] font-black text-[#1a1a1a] leading-[0.9] tracking-tighter mb-40"
						>
							FORM<br />
							FOLLOWS<br />
							FUNCTION.
						</h1>

						<div
							class="border-l-4 border-[#1a1a1a] pl-6 mt-16 max-w-md absolute bottom-0"
						>
							<p
								class="text-[#1a1a1a] text-lg font-bold uppercase tracking-wide leading-tight"
							>
								TICKETING REDEFINED THROUGH ARCHITECTURAL PRECISION AND
								GEOMETRIC CLARITY.
							</p>
						</div>
					</div>
				</div>

				<!-- Right Side: Form Section -->
				<div
					class="lg:w-[42%] bg-[#f5f0e8] p-4 sm:p-8 md:p-16 flex flex-col justify-center font-['Space_Grotesk']"
				>
					<div class="mb-10">
						<h2
							class="text-5xl md:text-[40px] font-bold text-[#1a1a1a] tracking-tighter mb-2 uppercase"
						>
							SIGN IN
						</h2>
						<p
							class="text-gray-500 text-xs uppercase font-medium tracking-widest font-['Inter']"
						>
							ENTER YOUR CREDENTIALS TO PROCEED
						</p>
					</div>

					<form class="space-y-6" @submit.prevent="handleLogin">
						<div>
							<label
								for="email"
								class="block text-[#1a1a1a] text-xs font-bold tracking-wider uppercase mb-2"
								>EMAIL ADDRESS</label
							>
							<div class="border-[1.5px] border-[#1a1a1a] bg-transparent p-0.5">
								<input
									v-model="email"
									type="email"
									id="email"
									name="email"
									placeholder="USER@DOMAIN.COM"
									class="w-full px-3 py-2.5 bg-transparent text-[#1a1a1a] placeholder-gray-400 text-sm focus:outline-none focus:ring-0 font-mono tracking-wider"
								/>
							</div>
						</div>

						<div>
							<div class="flex flex-row mb-2 items-end justify-between">
								<label
									for="password"
									class="block text-[#1a1a1a] text-xs font-bold tracking-wider uppercase"
									>PASSWORD</label
								>
								<RouterLink
									to="/forgot-password"
									class="text-[#e63b2e] text-[10px] font-bold hover:text-[#cc2a1e] tracking-widest uppercase"
								>
									FORGOT ACCESS?
								</RouterLink>
							</div>
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

						<p
							v-if="errorMessage"
							role="alert"
							class="border-2 border-[#e63b2e] bg-red-50 px-3 py-2 text-[#b42318] text-xs font-bold uppercase"
						>
							{{ errorMessage }}
						</p>

						<button
							type="submit"
							:disabled="isSubmitting || !isLoaded"
							class="w-full bg-[#1a1a1a] text-white text-[15px] font-bold py-4 uppercase tracking-widest hover:bg-[#333333] transition-colors mt-4"
						>
							{{ isSubmitting ? "AUTHENTICATING..." : "AUTHENTICATE" }}
						</button>
					</form>

					<div
						class="mt-8 flex items-center justify-center space-x-3 opacity-30"
					>
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
							>SIGN IN WITH GOOGLE</span
						>
					</button>

					<div class="mt-10 text-center">
						<span
							class="text-[#1a1a1a] text-[11px] font-semibold uppercase tracking-widest font-['Inter']"
							>NEW TO THE SYSTEM?
						</span>
						<RouterLink
							to="/register"
							class="text-[#0055ff] text-[11px] font-bold uppercase hover:text-[#003399] tracking-widest ml-1"
							>JOIN_TICKIFY</RouterLink
						>
					</div>
				</div>
			</div>
		</main>

		<Footer />
	</div>
</template>
