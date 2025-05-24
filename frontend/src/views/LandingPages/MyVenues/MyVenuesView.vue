<script setup>
import { ref } from 'vue'
import NavbarDefault from "../../../examples/navbars/NavbarDefault.vue";
import DefaultFooter from "../../../examples/footers/FooterDefault.vue";

// Define headers for the table
const headers = ["Hotel", "Description"];

// New venue form data
const showAddVenueModal = ref(false);
const newVenue = ref({
    name: "",
    room: "",
    location: "",
    guests: 1,
    total: 0,
    description: "",
    image: "https://placehold.co/400"
});

// Function to handle form submission
const addVenue = () => {
    bookings.value.push({ ...newVenue.value });
    // Reset form
    newVenue.value = {
        name: "",
        room: "",
        location: "",
        guests: 1,
        total: 0,
        description: "",
        image: "https://placehold.co/400"
    };
    // Close modal
    showAddVenueModal.value = false;
};

const bookings = ref([
    {
        name: "Crystal Waters Resort",
        room: "Single Bed",
        location: "Night Sky Parkway, AZ, USA",
        guests: 2,
        total: 200,
        description: "Enjoy a relaxing stay in our luxury resort with breathtaking views and exceptional service.",
        image: "https://placehold.co/400", // replace with actual image
    },
    {
        name: "The Grand Resort",
        room: "Single Bed",
        location: "Los Angeles, California, USA",
        guests: 2,
        total: 299,
        description: "Experience the vibrant city life with our centrally located accommodations and world-class amenities.",
        image: "https://placehold.co/400",
    },
    {
        name: "The Grand Resort",
        room: "Single Bed",
        location: "Los Angeles, California, USA",
        guests: 2,
        total: 299,
        description: "Urban retreat with stunning skyline views, perfect for business or leisure travelers.",
        image: "https://placehold.co/400",
    },
])
</script>

<template>
    <div class="container position-sticky z-index-sticky top-0">
        <div class="row">
            <div class="col-12">
                <NavbarDefault :sticky="true" />
            </div>
        </div>
    </div>
    <section class="pt-5 mt-7">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h2 class="text-2xl font-weight-bold mb-2">My Venues</h2>
                            <p class="text-secondary mb-0">
                                Easily manage your past, current, and upcoming hotel reservations in one place.
                                Plan your trips seamlessly with just a few clicks
                            </p>
                        </div>
                        <button class="btn bg-gradient-primary" @click="showAddVenueModal = true">
                            <i class="fa fa-plus me-2"></i>Add Venue
                        </button>
                    </div>

                    <div class="card">
                        <div class="table-responsive">
                            <table class="table align-items-center mb-0">
                                <thead>
                                    <tr>
                                        <th v-for="header in headers" :key="header"
                                            class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                                            :class="{ 'ps-2': header === 'Date & Timings', 'text-center': header === 'Payment' }">
                                            {{ header }}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(booking, index) in bookings" :key="index">
                                        <td>
                                            <div class="d-flex px-2 py-1">
                                                <div>
                                                    <img :src="booking.image" alt="Hotel" class="avatar-lg me-3 rounded"
                                                        style="width: 90px; height: 70px; object-fit: cover;" />
                                                </div>
                                                <div class="d-flex flex-column justify-content-center">
                                                    <h6 class="mb-0 text-sm">{{ booking.name }} <span
                                                            class="text-xs text-secondary">({{ booking.room }})</span>
                                                    </h6>
                                                    <p class="text-xs text-secondary mb-0">
                                                        <i class="fa fa-map-marker-alt me-1"></i>{{ booking.location }}
                                                    </p>
                                                    <p class="text-xs text-secondary mb-0">
                                                        <i class="fa fa-users me-1"></i>Guests: {{ booking.guests }}
                                                    </p>
                                                    <p class="text-xs text-dark font-weight-bold mb-0">
                                                        Total: ${{ booking.total }}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="align-middle">
                                            <div class="d-flex flex-column justify-content-center">
                                                <p class="text-xs mb-0 text-wrap" style="max-width: 250px;">
                                                    {{ booking.description }}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    
    <!-- Modal backdrop -->
    <div class="fixed-top h-100 w-100" v-if="showAddVenueModal"
        style="background-color: rgba(0,0,0,0.6); z-index: 1050;" @click.self="showAddVenueModal = false"></div>

    <!-- Modal -->
    <div v-if="showAddVenueModal" class="modal d-block" style="z-index: 1051;" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content shadow">
                <div class="modal-header">
                    <h5 class="modal-title" id="addVenueModalLabel">Add New Venue</h5>
                    <button type="button" class="close" @click="showAddVenueModal = false" aria-label="Close">x
                    </button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="addVenue">
                        <div class="mb-3">
                            <label for="venueName" class="form-label">Venue Name</label>
                            <input type="text" class="form-control border border-dark ps-2" id="venueName"
                                v-model="newVenue.name" required>
                        </div>
                        <div class="mb-3">
                            <label for="venueRoom" class="form-label">Room</label>
                            <input type="text" class="form-control border border-dark ps-2" id="venueRoom"
                                v-model="newVenue.room" required>
                        </div>
                        <div class="mb-3">
                            <label for="venueLocation" class="form-label">Location</label>
                            <input type="text" class="form-control border border-dark ps-2" id="venueLocation"
                                v-model="newVenue.location" required>
                        </div>
                        <div class="mb-3">
                            <label for="venueGuests" class="form-label">Guests</label>
                            <input type="number" class="form-control border border-dark ps-2" id="venueGuests"
                                v-model="newVenue.guests" required>
                        </div>
                        <div class="mb-3">
                            <label for="venueTotal" class="form-label">Total</label>
                            <input type="number" class="form-control border border-dark ps-2" id="venueTotal"
                                v-model="newVenue.total" required>
                        </div>
                        <div class="mb-3">
                            <label for="venueDescription" class="form-label">Description</label>
                            <textarea class="form-control border border-dark ps-2" id="venueDescription"
                                v-model="newVenue.description" required></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="venueImage" class="form-label">Image URL</label>
                            <input type="text" class="form-control border border-dark ps-2" id="venueImage"
                                v-model="newVenue.image" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Add Venue</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <DefaultFooter />
</template>