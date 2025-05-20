<script setup>
import { ref } from 'vue'
import NavbarDefault from "../../../examples/navbars/NavbarDefault.vue";
import DefaultFooter from "../../../examples/footers/FooterDefault.vue";

// Define headers for the table
const headers = ["Hotel", "Date & Timings", "Payment"];

const bookings = ref([
    {
        name: "Crystal Waters Resort",
        room: "Single Bed",
        location: "Night Sky Parkway, AZ, USA",
        guests: 2,
        total: 200,
        checkIn: "September 20, 2025",
        checkOut: "September 26, 2025",
        paid: true,
        image: "https://placehold.co/400", // replace with actual image
    },
    {
        name: "The Grand Resort",
        room: "Single Bed",
        location: "Los Angeles, California, USA",
        guests: 2,
        total: 299,
        checkIn: "September 20, 2025",
        checkOut: "September 26, 2025",
        paid: false,
        image: "https://placehold.co/400",
    },
    {
        name: "The Grand Resort",
        room: "Single Bed",
        location: "Los Angeles, California, USA",
        guests: 2,
        total: 299,
        checkIn: "September 20, 2025",
        checkOut: "September 26, 2025",
        paid: true,
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
                    <h2 class="text-2xl font-weight-bold mb-2">My Tickets</h2>
                    <p class="text-secondary mb-4">
                        Easily manage your past, current, and upcoming hotel reservations in one place.
                        Plan your trips seamlessly with just a few clicks
                    </p>

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
                                                <p class="text-xs mb-0">
                                                    <strong>Check-In:</strong> {{ booking.checkIn }}
                                                </p>
                                                <p class="text-xs text-secondary mb-0">
                                                    <strong>Check-Out:</strong> {{ booking.checkOut }}
                                                </p>
                                            </div>
                                        </td>
                                        <td class="align-middle text-center">
                                            <span class="badge badge-sm"
                                                :class="booking.paid ? 'bg-success text-white' : 'bg-danger text-white'">
                                                {{ booking.paid ? 'Paid' : 'Unpaid' }}
                                            </span>
                                            <br>
                                            <button v-if="!booking.paid" class="btn btn-sm bg-gradient-dark mt-2">
                                                Pay now
                                            </button>
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

    <DefaultFooter />
</template>