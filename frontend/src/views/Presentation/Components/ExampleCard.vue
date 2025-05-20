<script setup>
import { onMounted } from "vue";
import setTooltip from "@/assets/js/tooltip";
import { useAppStore } from "@/stores";

const store = useAppStore();

defineProps({
  route: { type: String, required: true },
  image: { type: String, required: true },
  title: { type: String, default: "" },
  price: { type: Number, default: 0 }
});

onMounted(() => {
  setTooltip(store.bootstrap);
});
</script>

<script>
export default {
  inheritAttrs: false,
};
</script>

<template>
  <RouterLink :to="{ name: route }" class="text-decoration-none text-dark">
    <div class="card shadow-sm position-relative border-0 overflow-hidden rounded-4" v-bind="$attrs">
      <!-- Image -->
      <img class="w-100" :src="image" :alt="title" loading="lazy" style="height: 200px; object-fit: cover" />

      <!-- Card Body -->
      <div class="card-body">
        <h6 class="card-title mb-1">{{ title }}</h6>
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="mb-0">${{ price }}</h5>
          <button class="btn btn-outline-primary btn-sm">Book Now</button>
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.card:hover {
  transform: translateY(-5px);
  transition: 0.3s ease;
}
</style>
