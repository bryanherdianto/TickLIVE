<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const props = defineProps<{
	latitude: number;
	longitude: number;
	name: string;
}>();
const mapContainer = ref<HTMLElement | null>(null);
let map: L.Map | null = null;

const venueIcon = L.icon({
	iconRetinaUrl: markerIcon2x,
	iconUrl: markerIcon,
	shadowUrl: markerShadow,
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	tooltipAnchor: [16, -28],
	shadowSize: [41, 41],
});

onMounted(() => {
	if (!mapContainer.value) return;
	map = L.map(mapContainer.value, { scrollWheelZoom: false }).setView(
		[props.latitude, props.longitude],
		15,
	);
	L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
		maxZoom: 19,
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	}).addTo(map);
	L.marker([props.latitude, props.longitude], { icon: venueIcon })
		.addTo(map)
		.bindPopup(props.name)
		.openPopup();
});

onBeforeUnmount(() => {
	map?.remove();
	map = null;
});
</script>

<template>
	<div
		ref="mapContainer"
		class="h-72 w-full border-4 border-[#1a1a1a] shadow-[8px_8px_0_0_#1a1a1a] sm:h-96"
	/>
</template>
