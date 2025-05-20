<template>
  <section class="py-5">
    <div class="container">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-lg-8">
          <h2>Available Events</h2>
          <p class="text-muted">See and take advantage of our limited-time offers to create unforgettable memories.</p>
        </div>
      </div>
      <div class="row">
        <!-- Listings -->
        <div class="col-lg-8">
          <div v-for="room in filteredRooms" :key="room.id" class="card mb-4">
            <div class="row g-0">
              <div class="col-md-5">
                <img :src="room.image" class="img-fluid rounded-start" alt="room.name">
              </div>
              <div class="col-md-7">
                <div class="card-body">
                  <small class="text-uppercase text-muted">{{ room.location }}</small>
                  <h5 class="card-title">{{ room.name }}</h5>
                  <div class="mb-2">
                    <i class="fa fa-star text-warning" v-for="n in room.rating" :key="n"></i>
                    <i class="fa fa-star-o text-warning" v-for="n in 5 - room.rating" :key="n"></i>
                    <span class="ms-2 text-muted">{{ room.reviews }} reviews</span>
                  </div>
                  <p class="text-muted"><i class="fa fa-map-marker"></i> {{ room.address }}</p>
                  <div class="mb-3">
                    <span v-for="(amenity, idx) in room.amenities" :key="idx" class="badge bg-light text-dark me-2">
                      <i :class="amenity.icon"></i> {{ amenity.label }}
                    </span>
                  </div>
                  <h5 class="fw-bold">${{ room.price }} <small class="text-muted">/night</small></h5>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Sidebar Filters -->
        <div class="col-lg-4">
          <div class="card p-3">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="mb-0">Filters</h5>
              <button class="btn btn-sm btn-link">Clear</button>
            </div>
            <!-- Popular filters -->
            <div class="mb-4">
              <h6>Popular filters</h6>
              <div v-for="type in roomTypes" :key="type" class="form-check">
                <input class="form-check-input" type="checkbox" :id="type" :value="type" v-model="selectedTypes" />
                <label class="form-check-label" :for="type">{{ type }}</label>
              </div>
            </div>
            <!-- Price Range -->
            <div class="mb-4">
              <h6>Price Range</h6>
              <div v-for="range in priceRanges" :key="range.label" class="form-check">
                <input class="form-check-input" type="checkbox" :id="range.label" :value="range"
                  v-model="selectedRanges" />
                <label class="form-check-label" :for="range.label">
                  {{ range.label }}
                </label>
              </div>
            </div>
            <!-- Sort By -->
            <div>
              <h6>Sort By</h6>
              <div v-for="option in sortOptions" :key="option.value" class="form-check">
                <input class="form-check-input" type="radio" name="sort" :id="option.value" :value="option.value"
                  v-model="selectedSort" />
                <label class="form-check-label" :for="option.value">
                  {{ option.label }}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';

// Example room data
const rooms = ref([
  {
    id: 1,
    image: "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/material-design-system/presentation/sections/headers.jpg",
    location: 'New York',
    name: 'Urbanza Suites',
    rating: 4,
    reviews: 200,
    address: 'Main Road 123 Street, 23 Colony',
    amenities: [
      { icon: 'fa fa-concierge-bell', label: 'Room Service' },
      { icon: 'fa fa-mountain', label: 'Mountain View' },
      { icon: 'fa fa-swimmer', label: 'Pool Access' },
    ],
    price: 399,
    type: 'Family Suite'
  },
  // Add more room objects here
]);

// Filters state
const roomTypes = ['Single Bed', 'Double Bed', 'Luxury Room', 'Family Suite'];
const selectedTypes = ref([]);
const priceRanges = [
  { label: '$0 to 500', min: 0, max: 500 },
  { label: '$500 to 1000', min: 500, max: 1000 },
  { label: '$1000 to 2000', min: 1000, max: 2000 },
  { label: '$2000 to 3000', min: 2000, max: 3000 },
];
const selectedRanges = ref([]);
const sortOptions = [
  { label: 'Price Low to High', value: 'low-high' },
  { label: 'Price High to Low', value: 'high-low' },
  { label: 'Newest First', value: 'newest' },
];
const selectedSort = ref('low-high');

// Computed filtered and sorted rooms
const filteredRooms = computed(() => {
  let list = rooms.value;
  // Filter by type
  if (selectedTypes.value.length) {
    list = list.filter(r => selectedTypes.value.includes(r.type));
  }
  // Filter by price
  if (selectedRanges.value.length) {
    list = list.filter(r =>
      selectedRanges.value.some(range => r.price >= range.min && r.price <= range.max)
    );
  }
  // Sort
  if (selectedSort.value === 'low-high') list = list.slice().sort((a, b) => a.price - b.price);
  if (selectedSort.value === 'high-low') list = list.slice().sort((a, b) => b.price - a.price);
  if (selectedSort.value === 'newest') list = list; // assume default order
  return list;
});
</script>

<style scoped>
.card img {
  object-fit: cover;
  height: 100%;
}
</style>
