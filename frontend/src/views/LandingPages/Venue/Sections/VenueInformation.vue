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
      <!-- Mobile Filters (visible only on small screens) -->
      <div class="d-lg-none mb-4">
        <div class="card shadow-lg">
          <div class="card-header p-3 pb-0">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Filters</h5>
              <button class="btn btn-link text-gradient text-primary p-0 mb-0">Clear</button>
            </div>
            <p class="text-sm mb-0">Find your perfect venue</p>
          </div>
          <div class="card-body p-3 pt-0">
            <!-- Mobile filters content -->
            <div class="row">
              <div class="col-6">
                <!-- Venue Types -->
                <div class="mt-3 mb-4">
                  <h6 class="mb-3">Venue Types</h6>
                  <div class="input-group input-group-outline">
                    <div v-for="type in roomTypes" :key="'mobile-' + type" class="form-check mb-2">
                      <input class="form-check-input" type="checkbox" :id="'mobile-' + type" :value="type"
                        v-model="selectedTypes" />
                      <label class="form-check-label ms-2" :for="'mobile-' + type">{{ type }}</label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <!-- Price Range -->
                <div class="mb-4">
                  <h6 class="mb-3">Price Range</h6>
                  <div class="input-group input-group-outline">
                    <div v-for="range in priceRanges" :key="'mobile-' + range.label" class="form-check mb-2">
                      <input class="form-check-input" type="checkbox" :id="'mobile-' + range.label" :value="range"
                        v-model="selectedRanges" />
                      <label class="form-check-label ms-2" :for="'mobile-' + range.label">
                        {{ range.label }}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12">
                <!-- Sort By -->
                <div>
                  <h6 class="mb-3">Sort By</h6>
                  <div class="input-group input-group-outline d-flex flex-wrap">
                    <div v-for="option in sortOptions" :key="'mobile-' + option.value" class="form-check mb-2 me-3">
                      <input class="form-check-input" type="radio" name="sort-mobile" :id="'mobile-' + option.value"
                        :value="option.value" v-model="selectedSort" />
                      <label class="form-check-label ms-2" :for="'mobile-' + option.value">
                        {{ option.label }}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-4">
              <button class="btn bg-gradient-success w-100">Apply Filters</button>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- Listings -->
        <div class="col-lg-8">
          <router-link v-for="room in filteredRooms" :key="room.id" :to="`/venues/${room.id}`"
            class="text-decoration-none text-dark">
            <div class="card card-plain mb-4 overflow-hidden hover-shadow">
              <div class="row g-0">
                <div class="col-md-5 position-relative">
                  <div class="position-absolute top-0 start-0 p-2">
                    <span class="badge bg-gradient-success">Available</span>
                  </div>
                  <img :src="room.image" class="w-100 rounded-start" alt="room.name"
                    style="height: 100%; object-fit: cover;" />
                </div>
                <div class="col-md-7">
                  <div class="card-body p-3 p-md-4">
                    <small class="text-uppercase text-muted">{{ room.location }}</small>
                    <h5 class="mt-2 mb-2 font-weight-bold">{{ room.name }}</h5>
                    <div class="mb-2">
                      <i class="fa fa-star text-warning" v-for="n in room.rating" :key="'s' + n"></i>
                      <i class="fa fa-star-o text-warning" v-for="n in 5 - room.rating" :key="'o' + n"></i>
                      <span class="ms-2 text-muted small">{{ room.reviews }} reviews</span>
                    </div>
                    <p class="text-muted small"><i class="fa fa-map-marker me-1"></i> {{ room.address }}</p>
                    <div class="mb-3">
                      <span v-for="(amenity, idx) in room.amenities" :key="idx"
                        class="badge bg-light text-dark me-2 mb-1">
                        <i :class="amenity.icon"></i> {{ amenity.label }}
                      </span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-4">
                      <h5 class="font-weight-bold mb-0">${{ room.price }} <small class="text-muted">/night</small></h5>
                      <div class="btn bg-gradient-success btn-sm mb-0">View Details</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </router-link>
        </div>
        <!-- Desktop Sidebar Filters (visible only on large screens) -->
        <div class="col-lg-4 d-none d-lg-block">
          <div class="card shadow-lg">
            <div class="card-header p-3 pb-0">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Filters</h5>
                <button class="btn btn-link text-gradient text-primary p-0 mb-0">Clear</button>
              </div>
              <p class="text-sm mb-0">Find your perfect venue</p>
            </div>
            <div class="card-body p-3 pt-0">
              <!-- Popular filters -->
              <div class="mt-3 mb-4">
                <h6 class="mb-3">Venue Types</h6>
                <div class="input-group input-group-outline">
                  <div v-for="type in roomTypes" :key="type" class="form-check mb-2">
                    <input class="form-check-input" type="checkbox" :id="type" :value="type" v-model="selectedTypes" />
                    <label class="form-check-label ms-2" :for="type">{{ type }}</label>
                  </div>
                </div>
              </div>
              <!-- Price Range -->
              <div class="mb-4">
                <h6 class="mb-3">Price Range</h6>
                <div class="input-group input-group-outline">
                  <div v-for="range in priceRanges" :key="range.label" class="form-check mb-2">
                    <input class="form-check-input" type="checkbox" :id="range.label" :value="range"
                      v-model="selectedRanges" />
                    <label class="form-check-label ms-2" :for="range.label">
                      {{ range.label }}
                    </label>
                  </div>
                </div>
              </div>
              <!-- Sort By -->
              <div>
                <h6 class="mb-3">Sort By</h6>
                <div class="input-group input-group-outline">
                  <div v-for="option in sortOptions" :key="option.value" class="form-check mb-2">
                    <input class="form-check-input" type="radio" name="sort" :id="option.value" :value="option.value"
                      v-model="selectedSort" />
                    <label class="form-check-label ms-2" :for="option.value">
                      {{ option.label }}
                    </label>
                  </div>
                </div>
              </div>
              <div class="mt-4">
                <button class="btn bg-gradient-success w-100">Apply Filters</button>
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
  {
    id: 2,
    image: "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/material-design-system/presentation/sections/features.jpg",
    location: 'Chicago',
    name: 'Downtown Luxury',
    rating: 5,
    reviews: 124,
    address: '456 State Street, Downtown',
    amenities: [
      { icon: 'fa fa-wifi', label: 'Free WiFi' },
      { icon: 'fa fa-parking', label: 'Free Parking' },
      { icon: 'fa fa-coffee', label: 'Breakfast' },
    ],
    price: 599,
    type: 'Luxury Room'
  },
  {
    id: 3,
    image: "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/material-design-system/presentation/sections/testimonials.jpg",
    location: 'San Francisco',
    name: 'Bay View Hotel',
    rating: 4,
    reviews: 78,
    address: '789 Harbor Drive, Bay Area',
    amenities: [
      { icon: 'fa fa-utensils', label: 'Restaurant' },
      { icon: 'fa fa-dumbbell', label: 'Fitness Center' },
      { icon: 'fa fa-hot-tub', label: 'Hot Tub' },
    ],
    price: 299,
    type: 'Double Bed'
  }
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

.hover-shadow:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  transform: translateY(-2px);
}

.badge {
  font-size: 0.65rem;
  font-weight: 600;
}

.font-weight-bold {
  font-weight: 600 !important;
}
</style>
