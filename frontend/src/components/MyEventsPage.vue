<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useAuth } from "@clerk/vue";
import { RouterLink } from "vue-router";
import Footer from "./Footer.vue";
import Header from "./Header.vue";
import { useApi } from "@/lib/api";
import { formatCurrency, formatEventDate } from "@/lib/format";

type Summary = { totalEvents: number; ticketsSold: number; revenue: string };
type OrganizerEvent = {
	id: string;
	title: string;
	slug: string;
	status: string;
	starts_at: string;
	venueName: string;
	ticketsSold: number;
	revenue: string;
};
type Venue = { id: string; name: string };
const api = useApi();
const { isLoaded, isSignedIn } = useAuth();
const summary = ref<Summary>({ totalEvents: 0, ticketsSold: 0, revenue: "0" });
const events = ref<OrganizerEvent[]>([]);
const venues = ref<Venue[]>([]);
const isLoading = ref(false);
const isSaving = ref(false);
const errorMessage = ref("");
const showForm = ref(false);
type EventImage = { id: number; file: File | null; altText: string };
type LineupArtist = {
	id: number;
	name: string;
	role: string;
	file: File | null;
};
let rowId = 0;
function emptyForm() {
	return {
		title: "",
		venueId: venues.value[0]?.id || "",
		category: "Music",
		badgeText: "",
		summary: "",
		description: "",
		heroImage: null as File | null,
		startsAt: "",
		endsAt: "",
		doorsAt: "",
		currency: "IDR",
		ticketPrice: 150000,
		seatCount: 20,
		status: "draft",
		images: [] as EventImage[],
		lineup: [] as LineupArtist[],
	};
}
const form = ref(emptyForm());
function pickFile(payload: globalThis.Event) {
	const input = payload.target as HTMLInputElement;
	return input.files?.[0] || null;
}
function addImage() {
	form.value.images.push({ id: ++rowId, file: null, altText: "" });
}
function removeImage(index: number) {
	form.value.images.splice(index, 1);
}
function addArtist() {
	form.value.lineup.push({ id: ++rowId, name: "", role: "", file: null });
}
function removeArtist(index: number) {
	form.value.lineup.splice(index, 1);
}
function toIsoString(value: string) {
	return value ? new Date(value).toISOString() : null;
}
// Mirrors the CHECK constraints on the events table so an ordering mistake is caught in the
// form instead of coming back as a database rejection.
const scheduleError = computed(() => {
	const { startsAt, endsAt, doorsAt } = form.value;
	if (!startsAt) return "";
	if (endsAt && new Date(endsAt) <= new Date(startsAt))
		return "The end time must be after the start time.";
	if (doorsAt && new Date(doorsAt) > new Date(startsAt))
		return "Doors must open at or before the start time.";
	return "";
});
async function loadEvents() {
	if (!isSignedIn.value) return;
	isLoading.value = true;
	errorMessage.value = "";
	try {
		const [summaryData, eventsData, venuesData] = await Promise.all([
			api<Summary>("/me/organizer/summary"),
			api<OrganizerEvent[]>("/me/events"),
			api<Venue[]>("/me/venues"),
		]);
		summary.value = summaryData;
		events.value = eventsData;
		venues.value = venuesData;
		if (!form.value.venueId && venuesData[0])
			form.value.venueId = venuesData[0].id;
	} catch (error) {
		errorMessage.value =
			error instanceof Error ? error.message : "Unable to load your events.";
	} finally {
		isLoading.value = false;
	}
}
async function createEvent() {
	if (scheduleError.value) {
		errorMessage.value = scheduleError.value;
		return;
	}
	const seats = Array.from(
		{ length: Math.min(Math.max(Number(form.value.seatCount), 1), 250) },
		(_, index) => ({
			zoneCode: "GA",
			label: `GA-${index + 1}`,
			price: Number(form.value.ticketPrice),
		}),
	);
	// Rows without a file / name are dropped first so the surviving indexes line up with the
	// galleryImage_<i> / lineupImage_<i> field names the backend matches on.
	const images = form.value.images.filter((image) => image.file);
	const lineup = form.value.lineup.filter((artist) => artist.name.trim());
	const body = new FormData();
	const append = (key: string, value: string | null) => {
		if (value) body.append(key, value);
	};
	append("title", form.value.title);
	append("venueId", form.value.venueId);
	append("category", form.value.category);
	append("badgeText", form.value.badgeText);
	append("summary", form.value.summary);
	append("description", form.value.description);
	append("startsAt", toIsoString(form.value.startsAt));
	append("endsAt", toIsoString(form.value.endsAt));
	append("doorsAt", toIsoString(form.value.doorsAt));
	append("currency", form.value.currency);
	append("status", form.value.status);
	body.append("seats", JSON.stringify(seats));
	body.append(
		"images",
		JSON.stringify(
			images.map((image) => ({ altText: image.altText.trim() || null })),
		),
	);
	body.append(
		"lineup",
		JSON.stringify(
			lineup.map((artist) => ({
				name: artist.name.trim(),
				role: artist.role.trim() || null,
			})),
		),
	);
	if (form.value.heroImage) body.append("image", form.value.heroImage);
	images.forEach((image, index) => {
		if (image.file) body.append(`galleryImage_${index}`, image.file);
	});
	lineup.forEach((artist, index) => {
		if (artist.file) body.append(`lineupImage_${index}`, artist.file);
	});
	isSaving.value = true;
	errorMessage.value = "";
	try {
		await api<OrganizerEvent>("/me/events", { method: "POST", body });
		form.value = emptyForm();
		showForm.value = false;
		await loadEvents();
	} catch (error) {
		errorMessage.value =
			error instanceof Error ? error.message : "Unable to create your event.";
	} finally {
		isSaving.value = false;
	}
}
onMounted(loadEvents);
watch(isSignedIn, loadEvents);
</script>

<template>
	<div class="min-h-screen bg-[#f5f0e8] font-['Space_Grotesk'] text-[#1a1a1a]">
		<Header />
		<main class="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
			<section
				class="mb-10 flex flex-col gap-6 lg:mb-12 lg:flex-row lg:items-end lg:justify-between"
			>
				<div>
					<p class="mb-2 font-bold uppercase tracking-widest text-[#e63b2e]">
						Organizer dashboard
					</p>
					<h1
						class="text-5xl font-bold uppercase leading-none sm:text-7xl md:text-[96px]"
					>
						My Events
					</h1>
					<p
						class="mt-5 max-w-2xl border-l-4 border-[#1a1a1a] pl-4 font-['Inter'] sm:pl-6 sm:text-xl"
					>
						Create and manage your events, track ticket sales, and monitor your
						revenue.
					</p>
				</div>
				<button
					v-if="isSignedIn"
					type="button"
					class="bg-[#e63b2e] px-6 py-4 font-bold uppercase text-white shadow-[4px_4px_0_0_#1a1a1a]"
					@click="showForm = !showForm"
				>
					{{ showForm ? "Close form" : "+ Create event" }}
				</button>
			</section>
			<div
				v-if="!isLoaded"
				class="border-2 border-[#1a1a1a] bg-white p-6 font-bold uppercase"
			>
				Loading account…
			</div>
			<section
				v-else-if="!isSignedIn"
				class="border-4 border-[#1a1a1a] bg-white p-8"
			>
				<h2 class="mb-4 text-2xl font-bold uppercase">
					Sign in to manage events
				</h2>
				<RouterLink
					:to="{ name: 'login', query: { redirect: '/my-events' } }"
					class="inline-block bg-[#e63b2e] px-5 py-3 font-bold uppercase text-white"
					>Sign in</RouterLink
				>
			</section>
			<template v-else
				><form
					v-if="showForm"
					class="mb-10 grid gap-4 border-4 border-[#1a1a1a] bg-white p-5 shadow-[6px_6px_0_0_#1a1a1a] sm:grid-cols-2 sm:p-6"
					@submit.prevent="createEvent"
				>
					<h2 class="sm:col-span-2 text-2xl font-bold uppercase">
						Create event
					</h2>
					<p
						v-if="venues.length === 0"
						class="sm:col-span-2 border-2 border-[#e63b2e] bg-[#ffdad6] p-3 font-bold"
					>
						Create a venue before you create an event.
					</p>
					<p
						v-else-if="scheduleError"
						class="sm:col-span-2 border-2 border-[#e63b2e] bg-[#ffdad6] p-3 font-bold"
					>
						{{ scheduleError }}
					</p>
					<template v-else
						><label class="sm:col-span-2 font-bold uppercase"
							>Title<input
								v-model.trim="form.title"
								required
								class="mt-2 w-full border-2 border-[#1a1a1a] p-3 font-normal" /></label
						><label class="font-bold uppercase"
							>Venue<select
								v-model="form.venueId"
								required
								class="mt-2 w-full border-2 border-[#1a1a1a] bg-white p-3 font-normal"
							>
								<option
									v-for="venue in venues"
									:key="venue.id"
									:value="venue.id"
								>
									{{ venue.name }}
								</option>
							</select></label
						><label class="font-bold uppercase"
							>Category<input
								v-model.trim="form.category"
								required
								class="mt-2 w-full border-2 border-[#1a1a1a] p-3 font-normal" /></label
						><label class="font-bold uppercase"
							>Badge text<input
								v-model.trim="form.badgeText"
								placeholder="Selling fast"
								class="mt-2 w-full border-2 border-[#1a1a1a] p-3 font-normal" /></label
						><label class="font-bold uppercase"
							>Currency<input
								:value="form.currency"
								readonly
								aria-readonly="true"
								class="mt-2 w-full cursor-not-allowed border-2 border-[#1a1a1a] bg-gray-100 p-3 font-normal uppercase" /><span
								class="mt-1 block text-xs font-normal normal-case text-gray-500"
								>Midtrans settles in rupiah only.</span
							></label
						><label class="font-bold uppercase"
							>Starts at<input
								v-model="form.startsAt"
								required
								type="datetime-local"
								class="mt-2 w-full border-2 border-[#1a1a1a] p-3 font-normal" /></label
						><label class="font-bold uppercase"
							>Ends at<input
								v-model="form.endsAt"
								:min="form.startsAt"
								type="datetime-local"
								class="mt-2 w-full border-2 border-[#1a1a1a] p-3 font-normal" /></label
						><label class="font-bold uppercase"
							>Doors open<input
								v-model="form.doorsAt"
								:max="form.startsAt"
								type="datetime-local"
								class="mt-2 w-full border-2 border-[#1a1a1a] p-3 font-normal" /></label
						><label class="font-bold uppercase"
							>Status<select
								v-model="form.status"
								class="mt-2 w-full border-2 border-[#1a1a1a] bg-white p-3 font-normal"
							>
								<option value="draft">Draft</option>
								<option value="published">Published</option>
							</select></label
						><label class="font-bold uppercase"
							>Ticket price (IDR)<input
								v-model.number="form.ticketPrice"
								min="1"
								step="1"
								required
								type="number"
								class="mt-2 w-full border-2 border-[#1a1a1a] p-3 font-normal" /><span
								class="mt-1 block text-xs font-normal normal-case text-gray-500"
								>Whole rupiah, no decimals.</span
							></label
						><label class="font-bold uppercase"
							>Seat count<input
								v-model.number="form.seatCount"
								min="1"
								max="250"
								required
								type="number"
								class="mt-2 w-full border-2 border-[#1a1a1a] p-3 font-normal" /></label
						><label class="sm:col-span-2 font-bold uppercase"
							>Hero image<input
								type="file"
								accept="image/*"
								class="mt-2 w-full border-2 border-[#1a1a1a] p-3 font-normal"
								@change="form.heroImage = pickFile($event)"
							/><span
								class="mt-1 block text-xs font-normal normal-case text-gray-500"
								>PNG or JPG, up to 5 MB.</span
							></label
						><label class="sm:col-span-2 font-bold uppercase"
							>Summary<textarea
								v-model.trim="form.summary"
								rows="2"
								placeholder="One-line hook shown in the hero"
								class="mt-2 w-full border-2 border-[#1a1a1a] p-3 font-normal font-['Inter']"
							/></label
						><label class="sm:col-span-2 font-bold uppercase"
							>Description<textarea
								v-model.trim="form.description"
								rows="5"
								placeholder="Full event overview"
								class="mt-2 w-full border-2 border-[#1a1a1a] p-3 font-normal font-['Inter']"
							/>
						</label>
						<fieldset class="sm:col-span-2 border-2 border-[#1a1a1a] p-4">
							<legend class="px-2 font-bold uppercase">Gallery images</legend>
							<div
								v-for="(image, index) in form.images"
								:key="image.id"
								class="mb-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
							>
								<input
									type="file"
									accept="image/*"
									class="w-full border-2 border-[#1a1a1a] p-3"
									@change="image.file = pickFile($event)"
								/><input
									v-model.trim="image.altText"
									placeholder="Alt text (optional)"
									class="w-full border-2 border-[#1a1a1a] p-3"
								/><button
									type="button"
									class="border-2 border-[#1a1a1a] px-4 py-2 text-sm font-bold uppercase"
									@click="removeImage(index)"
								>
									Remove
								</button>
							</div>
							<button
								type="button"
								class="border-2 border-[#1a1a1a] bg-[#ffcc00] px-4 py-2 text-sm font-bold uppercase"
								@click="addImage"
							>
								+ Add image
							</button>
						</fieldset>
						<fieldset class="sm:col-span-2 border-2 border-[#1a1a1a] p-4">
							<legend class="px-2 font-bold uppercase">Lineup</legend>
							<div
								v-for="(artist, index) in form.lineup"
								:key="artist.id"
								class="mb-3 grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto]"
							>
								<input
									v-model.trim="artist.name"
									placeholder="Name"
									class="w-full border-2 border-[#1a1a1a] p-3"
								/><input
									v-model.trim="artist.role"
									placeholder="Role (optional)"
									class="w-full border-2 border-[#1a1a1a] p-3"
								/><input
									type="file"
									accept="image/*"
									class="w-full border-2 border-[#1a1a1a] p-3"
									@change="artist.file = pickFile($event)"
								/><button
									type="button"
									class="border-2 border-[#1a1a1a] px-4 py-2 text-sm font-bold uppercase"
									@click="removeArtist(index)"
								>
									Remove
								</button>
							</div>
							<button
								type="button"
								class="border-2 border-[#1a1a1a] bg-[#0055ff] px-4 py-2 text-sm font-bold uppercase text-white"
								@click="addArtist"
							>
								+ Add artist
							</button>
						</fieldset>
						<button
							:disabled="isSaving"
							class="sm:col-span-2 bg-[#e63b2e] px-5 py-3 font-bold uppercase text-white disabled:opacity-50"
						>
							{{ isSaving ? "Creating…" : "Create event" }}
						</button></template
					>
				</form>
				<p
					v-if="errorMessage"
					class="mb-6 border-2 border-[#e63b2e] bg-white p-4 font-bold text-[#e63b2e]"
				>
					{{ errorMessage }}
				</p>
				<section class="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-3 sm:mb-12">
					<div
						class="border-2 border-[#1a1a1a] bg-[#ffcc00] p-5 shadow-[4px_4px_0_0_#1a1a1a]"
					>
						<p class="mb-2 text-sm font-bold uppercase">Total events</p>
						<p class="text-4xl font-bold">{{ summary.totalEvents }}</p>
					</div>
					<div
						class="border-2 border-[#1a1a1a] bg-white p-5 shadow-[4px_4px_0_0_#1a1a1a]"
					>
						<p class="mb-2 text-sm font-bold uppercase">Tickets sold</p>
						<p class="text-4xl font-bold">{{ summary.ticketsSold }}</p>
					</div>
					<div
						class="border-2 border-[#1a1a1a] bg-[#05f] p-5 text-white shadow-[4px_4px_0_0_#1a1a1a]"
					>
						<p class="mb-2 text-sm font-bold uppercase">Total revenue</p>
						<p class="text-4xl font-bold">
							{{ formatCurrency(summary.revenue) }}
						</p>
					</div>
				</section>
				<section
					class="overflow-hidden border-2 border-[#1a1a1a] bg-white shadow-[8px_8px_0_0_#1a1a1a]"
				>
					<div v-if="isLoading" class="p-8 font-bold uppercase">
						Loading events…
					</div>
					<div v-else-if="events.length === 0" class="p-8 font-bold uppercase">
						No events yet. Create one above.
					</div>
					<div v-else class="divide-y-2 divide-[#1a1a1a]">
						<article
							v-for="event in events"
							:key="event.id"
							class="grid grid-cols-1 gap-4 p-5 md:grid-cols-[1fr_auto_auto] md:items-center"
						>
							<div>
								<h2 class="text-xl font-bold uppercase">{{ event.title }}</h2>
								<span
									:class="[
										'mt-1 inline-block border border-[#1a1a1a] px-2 py-0.5 text-xs font-bold uppercase',
										event.status === 'published'
											? 'bg-[#ffcc00]'
											: 'bg-gray-200',
									]"
									>{{ event.status }}</span
								>
								<p class="mt-2 font-['Inter'] text-sm">
									{{ formatEventDate(event.starts_at) }} · {{ event.venueName }}
								</p>
							</div>
							<div class="font-bold md:text-center">
								{{ event.ticketsSold }} sold<br /><span class="text-sm">{{
									formatCurrency(event.revenue)
								}}</span>
							</div>
							<RouterLink
								:to="{
									name: 'event-details',
									params: { id: event.slug || event.id },
								}"
								class="bg-[#1a1a1a] px-4 py-2 text-center text-sm font-bold uppercase text-white"
								>Manage event</RouterLink
							>
						</article>
					</div>
				</section></template
			>
		</main>
		<Footer />
	</div>
</template>
