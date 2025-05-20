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
          <div v-for="eventArray in filteredRooms" :key="eventArray.id" class="card mb-4">
            <div class="row g-0">
              
              <div class="col-md-7">
                <div class="card-body">
                  <h5 class="card-title">{{ eventArray.name }}</h5>
                  <p class="text-muted"><i class="fa fa-map-marker"></i> {{ eventArray.location }}</p>
                  <p class="card-text">{{ eventArray.image }}</p>
                  <h5 class="fw-bold">{{ eventArray.date }} <small class="text-muted"></small></h5>
                </div>
              </div>

            </div>
          </div>
        </div>
        
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Events state
const events = ref([]);
const loading = ref(true);
const error = ref(null);

// Filters state
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


// Fetch events from backend using fetch
const fetchEvents = async () => {
  try {
    // Fetch all data in parallel
    const [eventRes, locationRes] = await Promise.all([
      fetch('http://localhost:4000/event/'),
      fetch('http://localhost:4000/location/')
    ]);

    if (!eventRes.ok || !locationRes.ok) {
      throw new Error('Failed to fetch one or more resources');
    }

    const eventData = await eventRes.json();
    const locationData = await locationRes.json();

    console.log('Event Data:', eventData);
    console.log('Location Data:', locationData);

    const eventsArr = Array.isArray(eventData.payload) ? eventData.payload : [];
    const locationsArr = Array.isArray(locationData.payload) ? locationData.payload : [];

    // Map for quick lookup
    const locationMap = Object.fromEntries(locationsArr.map(l => [l.id, l.name]));
    const locationImage = Object.fromEntries(locationsArr.map(l => [l.id, l.image]));

    events.value = eventsArr.map(event => ({
      id: event.id,
      name: event.name,
      date: event.date || 'Unknown Date',
      location: locationMap[event.location_id] || 'Unknown Location',
      image: locationImage[event.location_id] || 'https://via.placeholder.com/150',
    }));

    loading.value = false;
  } catch (err) {
    console.error('Error fetching events:', err);
    error.value = 'Failed to load events.';
    loading.value = false;
  }
};


onMounted(() => {
  fetchEvents();
});

// Computed filtered and sorted events
const filteredRooms = computed(() => events.value);
</script>

<style scoped>
.card img {
  object-fit: cover;
  height: 100%;
}
</style>
