<script setup>
import { ref } from "vue";
import { useSignIn } from "@clerk/vue";
import { RouterLink, useRouter } from "vue-router";
import Footer from "./Footer.vue";
import Header from "./Header.vue";

const { isLoaded, signIn, setActive } = useSignIn();
const router = useRouter();

const email = ref("");
const code = ref("");
const password = ref("");
const confirmPassword = ref("");
const resetStarted = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref("");

const getClerkErrorMessage = (error) =>
	error?.errors?.[0]?.longMessage ||
	error?.errors?.[0]?.message ||
	"Unable to reset your password. Please try again.";

const requestResetCode = async () => {
	if (!isLoaded.value || !signIn.value) return;
	errorMessage.value = "";
	isSubmitting.value = true;

	try {
		await signIn.value.create({
			strategy: "reset_password_email_code",
			identifier: email.value,
		});
		resetStarted.value = true;
	} catch (error) {
		errorMessage.value = getClerkErrorMessage(error);
	} finally {
		isSubmitting.value = false;
	}
};

const resetPassword = async () => {
	if (!isLoaded.value || !signIn.value || !setActive.value) return;
	if (password.value !== confirmPassword.value) {
		errorMessage.value = "Passwords do not match.";
		return;
	}
	errorMessage.value = "";
	isSubmitting.value = true;

	try {
		const result = await signIn.value.attemptFirstFactor({
			strategy: "reset_password_email_code",
			code: code.value,
			password: password.value,
		});

		if (result.status === "complete") {
			await setActive.value({ session: result.createdSessionId });
			router.push("/");
		} else {
			errorMessage.value = "Additional verification is required to reset your password.";
		}
	} catch (error) {
		errorMessage.value = getClerkErrorMessage(error);
	} finally {
		isSubmitting.value = false;
	}
};
</script>

<template>
	<div class="min-h-screen bg-[#f5f0e8] flex flex-col font-['Space_Grotesk']">
		<Header />
		<main class="grow flex items-center justify-center p-4 sm:p-8">
			<section class="w-full max-w-md bg-white border-4 border-[#1a1a1a] shadow-[8px_8px_0_0_#1a1a1a] p-6 sm:p-10">
				<p class="text-[#e63b2e] text-xs font-bold tracking-widest uppercase mb-3">Account recovery</p>
				<h1 class="text-4xl sm:text-5xl font-bold uppercase tracking-tighter leading-none mb-4">
					{{ resetStarted ? "Set new password" : "Forgot access?" }}
				</h1>
				<p class="font-['Inter'] text-sm text-gray-600 mb-6">
					{{ resetStarted ? `Enter the code sent to ${email}, then choose a new password.` : "Enter your email address and we will send you a password-reset code." }}
				</p>

				<form v-if="!resetStarted" class="space-y-5" @submit.prevent="requestResetCode">
					<div>
						<label for="resetEmail" class="block text-xs font-bold tracking-wider uppercase mb-2">Email address</label>
						<input v-model="email" id="resetEmail" type="email" autocomplete="email" required class="w-full border-2 border-[#1a1a1a] px-3 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00]" placeholder="USER@DOMAIN.COM" />
					</div>
					<button type="submit" :disabled="isSubmitting || !isLoaded" class="w-full bg-[#1a1a1a] text-white border-2 border-[#1a1a1a] px-4 py-3 font-bold uppercase tracking-wider hover:bg-black disabled:opacity-60">
						{{ isSubmitting ? "Sending code..." : "Send reset code" }}
					</button>
				</form>

				<form v-else class="space-y-5" @submit.prevent="resetPassword">
					<div>
						<label for="resetCode" class="block text-xs font-bold tracking-wider uppercase mb-2">Verification code</label>
						<input v-model="code" id="resetCode" type="text" inputmode="numeric" autocomplete="one-time-code" required class="w-full border-2 border-[#1a1a1a] px-3 py-3 font-mono tracking-[0.3em] text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00]" placeholder="123456" />
					</div>
					<div>
						<label for="newPassword" class="block text-xs font-bold tracking-wider uppercase mb-2">New password</label>
						<input v-model="password" id="newPassword" type="password" autocomplete="new-password" required class="w-full border-2 border-[#1a1a1a] px-3 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00]" />
					</div>
					<div>
						<label for="confirmNewPassword" class="block text-xs font-bold tracking-wider uppercase mb-2">Confirm new password</label>
						<input v-model="confirmPassword" id="confirmNewPassword" type="password" autocomplete="new-password" required class="w-full border-2 border-[#1a1a1a] px-3 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00]" />
					</div>
					<button type="submit" :disabled="isSubmitting || !isLoaded" class="w-full bg-[#ffcc00] text-[#1a1a1a] border-2 border-[#1a1a1a] px-4 py-3 font-bold uppercase tracking-wider hover:bg-yellow-300 disabled:opacity-60">
						{{ isSubmitting ? "Updating password..." : "Update password" }}
					</button>
				</form>

				<p v-if="errorMessage" role="alert" class="mt-5 border-2 border-[#e63b2e] bg-red-50 px-3 py-2 text-[#b42318] text-xs font-bold uppercase">
					{{ errorMessage }}
				</p>
				<RouterLink to="/login" class="mt-6 inline-block text-[#0055ff] text-xs font-bold uppercase tracking-widest hover:text-[#003399]">Return to sign in</RouterLink>
			</section>
		</main>
		<Footer />
	</div>
</template>
