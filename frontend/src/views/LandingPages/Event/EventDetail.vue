<script setup>
import { ref, onMounted } from 'vue'
import NavbarDefault from "../../../examples/navbars/NavbarDefault.vue";
import DefaultFooter from "../../../examples/footers/FooterDefault.vue";

// State for events and locations
const events = ref([])
const locations = ref([])
const loading = ref(true)
const error = ref(null)

const checkIn = ref('')
const checkOut = ref('')
const guests = ref(1)

// Fetch events and locations from backend
const fetchData = async () => {
    loading.value = true
    try {
        const [eventRes, locationRes] = await Promise.all([
            fetch('http://localhost:4000/event/'),
            fetch('http://localhost:4000/location/')
        ])
        if (!eventRes.ok || !locationRes.ok) throw new Error('Failed to fetch data')
        events.value = await eventRes.json()
        locations.value = await locationRes.json()

        console.log('Event Data:', events.value)
        console.log('Location Data:', locations.value)
    } catch (err) {
        error.value = err.message
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchData()
})

// Helper to get location by id
const getLocation = (location_id) => {
    return locations.value.find(loc => loc.id === location_id)
}
</script>

<template>
    <div class="container position-sticky z-index-sticky top-0">
        <div class="row">
            <div class="col-12">
                <NavbarDefault :sticky="true" />
            </div>
        </div>
    </div>
    <div class="container mt-7 py-5">
        <div v-if="loading" class="text-center my-5">
            <span>Loading event details...</span>
        </div>
        <div v-else-if="error" class="alert alert-danger">
            {{ error }}
        </div>
        <div v-else>
            <div v-for="event in events" :key="event.id" class="mb-5">
                <!-- Title and Info -->
                <div class="row">
                    <div class="col-lg-8">
                        <h1 class="mb-1">{{ event.name }}</h1>
                        <div class="d-flex align-items-center mb-2">
                            <span class="badge bg-gradient-success me-2">{{ new Date(event.date).toLocaleDateString() }}</span>
                        </div>
                        <p class="text-muted mb-3">
                            <i class="fa fa-map-marker"></i>
                            {{ getLocation(event.location_id)?.name || 'Unknown Location' }}
                        </p>
                    </div>
                </div>
                <!-- Images -->
                <div class="row mt-4">
                    <div class="col-lg-8 mb-4">
                        <img :src="event.thumbnail ? event.thumbnail : 'https://via.placeholder.com/800x400?text=No+Image'" class="w-100 rounded-3 shadow" style="height: 400px; object-fit: cover;" />
                    </div>
                    <div class="col-lg-4">
                        <div v-if="getLocation(event.location_id)">
                            <img :src="getLocation(event.location_id).image" class="w-100 rounded-3 shadow mb-3" style="height: 190px; object-fit: cover;" />
                            <div class="card card-plain">
                                <div class="card-body p-2">
                                    <h6 class="mb-1">{{ getLocation(event.location_id).name }}</h6>
                                    <p class="text-sm text-muted mb-0">{{ getLocation(event.location_id).address }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Check-in Form -->
                <div class="row mt-5">
                    <div class="col-12">
                        <div class="card shadow-lg">
                            <div class="card-body p-4">
                                <h5 class="mb-4">Book this event</h5>
                                <div class="row g-3">
                                    <div class="col-md-4">
                                        <label class="form-label">Check-In</label>
                                        <div class="input-group input-group-outline">
                                            <input v-model="checkIn" type="date" class="form-control" />
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label">Check-Out</label>
                                        <div class="input-group input-group-outline">
                                            <input v-model="checkOut" type="date" class="form-control" />
                                        </div>
                                    </div>
                                    <div class="col-md d-flex align-items-end">
                                        <button class="btn bg-gradient-success w-100">Check Availability</button>
                                    </div>
                                    <div class="col-md d-flex align-items-end">
                                        <button class="btn bg-gradient-success w-100">Book Now</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Description -->
                <div class="row mt-5">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header p-3">
                                <h5 class="mb-0">About this event</h5>
                            </div>
                            <div class="card-body p-3">
                                <p class="text-muted">{{ event.description_ }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Location Description -->
                <div class="row mt-5" v-if="getLocation(event.location_id)">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header p-3">
                                <h5 class="mb-0">About the location</h5>
                            </div>
                            <div class="card-body p-3">
                                <p class="text-muted">{{ getLocation(event.location_id).description }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <DefaultFooter />
</template>

<style scoped>
.icon {
    min-width: 48px;
    height: 48px;
}

.avatar-container {
    width: 60px;
    height: 60px;
    min-width: 60px;
    overflow: hidden;
}

.avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.badge {
    font-size: 0.75rem;
    text-transform: uppercase;
    font-weight: 600;
}

@media (max-width: 575px) {
    .avatar-container {
        width: 50px;
        height: 50px;
        min-width: 50px;
    }
}

@media (max-width: 360px) {
    .avatar-container {
        width: 45px;
        height: 45px;
        min-width: 45px;
    }
}
</style>