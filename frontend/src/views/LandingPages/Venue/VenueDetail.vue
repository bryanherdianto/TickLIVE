<script setup>
import { ref } from 'vue'
import NavbarDefault from "../../../examples/navbars/NavbarDefault.vue";
import DefaultFooter from "../../../examples/footers/FooterDefault.vue";

const room = {
    name: 'Urbanza Suites',
    type: 'Double Bed',
    discount: '20% OFF',
    rating: 4.5,
    reviews: 200,
    location: 'Main Road 123 Street, 23 Colony',
    price: 399, images: [
        "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/material-design-system/presentation/sections/headers.jpg",
        "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/material-design-system/presentation/sections/features.jpg",
        "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/material-design-system/presentation/sections/pricing.jpg",
        "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/material-design-system/presentation/sections/testimonials.jpg",
        "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/material-design-system/presentation/sections/content.jpg"
    ],
    features: [
        { icon: 'fa fa-concierge-bell', label: 'Room Service' },
        { icon: 'fa fa-mountain', label: 'Mountain View' },
        { icon: 'fa fa-swimmer', label: 'Pool Access' }
    ],
    highlights: [
        { icon: 'fa fa-home', title: 'Clean & Safe Stay', description: 'A well-maintained and hygienic space just for you.' },
        { icon: 'fa fa-soap', title: 'Enhanced Cleaning', description: 'Follows Staybnb’s strict cleaning standards.' },
        { icon: 'fa fa-map-marker', title: 'Excellent Location', description: '90% rated the location 5 stars.' },
        { icon: 'fa fa-bell', title: 'Smooth Check-In', description: '100% rated check-in as 5-star.' }
    ],
    description: `Guests will be allocated on the ground floor according to availability...`,
    host: {
        name: 'Urbanza Suites',
        reviews: 200
    }
}

const checkIn = ref('')
const checkOut = ref('')
const guests = ref(1)
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
        <!-- Title and Info -->
        <div class="row">
            <div class="col-lg-8">
                <h1 class="mb-1">{{ room.name }} <span class="badge bg-light text-dark">{{ room.type }}</span></h1>
                <div class="d-flex align-items-center mb-2">
                    <span class="badge bg-gradient-success me-2">{{ room.discount }}</span>
                    <span class="text-warning me-1"><i class="fa fa-star"></i> {{ room.rating }}</span>
                    <span class="text-muted small">{{ room.reviews }}+ reviews</span>
                </div>
                <p class="text-muted mb-3"><i class="fa fa-map-marker"></i> {{ room.location }}</p>
            </div>
            <div class="col-lg-4 text-end">
                <h4 class="fw-bold">${{ room.price }} <small class="text-muted">/night</small></h4>
            </div>
        </div> <!-- Images -->
        <div class="row mt-4">
            <div class="col-lg-8 mb-4">
                <img :src="room.images[0]" class="w-100 rounded-3 shadow" style="height: 400px; object-fit: cover;" />
            </div>
            <div class="col-lg-4">
                <div class="row">
                    <div class="col-6 col-lg-12 mb-3" v-for="(img, i) in room.images.slice(1, 3)" :key="i">
                        <img :src="img" class="w-100 rounded-3 shadow" style="height: 190px; object-fit: cover;" />
                    </div>
                </div>
            </div>
        </div> <!-- Features -->
        <div class="row mt-4">
            <div class="col-12">
                <div class="d-flex flex-wrap">
                    <span v-for="feature in room.features" :key="feature.label"
                        class="badge bg-light text-dark p-2 me-2 mb-2">
                        <i :class="feature.icon"></i> {{ feature.label }}
                    </span>
                </div>
            </div>
        </div> <!-- Check-in Form -->
        <div class="row mt-5">
            <div class="col-12">
                <div class="card shadow-lg">
                    <div class="card-body p-4">
                        <h5 class="mb-4">Book this venue</h5>
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
                        </div>
                    </div>
                </div>
            </div>
        </div> <!-- Highlights -->
        <div class="row mt-5">
            <div class="col-12">
                <h4 class="mb-4">Highlights</h4>
            </div>
            <div class="col-lg-6" v-for="h in room.highlights" :key="h.title">
                <div class="card card-plain mb-4">
                    <div class="card-body p-3">
                        <div class="d-flex">
                            <div class="icon d-flex align-items-center justify-content-center">
                                <i :class="h.icon" class="text-success fs-4"></i>
                            </div>
                            <div class="ms-3">
                                <h5 class="mb-1">{{ h.title }}</h5>
                                <p class="text-sm text-muted">{{ h.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> <!-- Description -->
        <div class="row mt-5">
            <div class="col-12">
                <div class="card">
                    <div class="card-header p-3">
                        <h5 class="mb-0">About this venue</h5>
                    </div>
                    <div class="card-body p-3">
                        <p class="text-muted">{{ room.description }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Host Info -->
        <div class="row mt-5">
            <div class="col-12">
                <div class="card shadow-sm">
                    <div class="card-body p-4">
                        <div class="row g-3 align-items-center">
                            <div class="col-12 col-md-8 mb-3 mb-md-0">
                                <div class="d-flex align-items-center flex-wrap">
                                    <div class="avatar-container me-3 mb-2 mb-sm-0">
                                        <img src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/material-design-system/assets/img/team-2.jpg"
                                            class="avatar-image rounded-circle" alt="Host avatar">
                                    </div>
                                    <div>
                                        <h5 class="mb-1">Hosted by {{ room.host.name }}</h5>
                                        <p class="mb-0 text-sm text-muted">{{ room.host.reviews }}+ reviews</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-md-4 text-center text-md-end">
                                <button class="btn bg-gradient-success">Contact Now</button>
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

/* Additional styling for Material Kit Pro compatibility */
.badge {
    font-size: 0.75rem;
    text-transform: uppercase;
    font-weight: 600;
}

/* Responsive styles */
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
