<script setup>
import { RouterLink, useRouter } from "vue-router";
import { ref, watch } from "vue";
import { useWindowsWidth } from "../../assets/js/useWindowsWidth";

// images
import ArrDark from "@/assets/img/down-arrow-dark.svg";
import DownArrWhite from "@/assets/img/down-arrow-white.svg";
import { useClerk } from '@clerk/vue'
import { SignedIn, SignedOut, UserButton } from '@clerk/vue';

const clerk = useClerk();

const props = defineProps({
  action: {
    type: Object,
    route: String,
    color: String,
    label: String,
    default: () => ({
      route: "https://www.creative-tim.com/product/vue-material-kit",
      color: "bg-gradient-success",
      label: "Login"
    })
  },
  transparent: {
    type: Boolean,
    default: false
  },
  light: {
    type: Boolean,
    default: false
  },
  dark: {
    type: Boolean,
    default: false
  },
  sticky: {
    type: Boolean,
    default: false
  },
  darkText: {
    type: Boolean,
    default: false
  }
});

// set arrow  color
function getArrowColor() {
  if (props.transparent && textDark.value) {
    return ArrDark;
  } else if (props.transparent) {
    return DownArrWhite;
  } else {
    return ArrDark;
  }
}

// set text color
const getTextColor = () => {
  let color;
  if (props.transparent && textDark.value) {
    color = "text-dark";
  } else if (props.transparent) {
    color = "text-white";
  } else {
    color = "text-dark";
  }

  return color;
};

// set nav color on mobile && desktop

let textDark = ref(props.darkText);
const { type } = useWindowsWidth();

if (type.value === "mobile") {
  textDark.value = true;
} else if (type.value === "desktop" && textDark.value == false) {
  textDark.value = false;
}

watch(
  () => type.value,
  (newValue) => {
    if (newValue === "mobile") {
      textDark.value = true;
    } else {
      textDark.value = false;
    }
  }
);

const router = useRouter()

function openVenues() {
  router.push('/my-venues')
}

function openTickets() {
  router.push('/my-tickets')
}

function openEvents() {
  router.push('/my-events')
}
</script>

<template>
  <nav class="navbar navbar-expand-lg top-0" :class="{
    'z-index-3 w-100 shadow-none navbar-transparent position-absolute my-3':
      props.transparent,
    'my-3 blur border-radius-lg z-index-3 py-2 shadow py-2 start-0 end-0 mx-4 position-absolute mt-4':
      props.sticky,
    'navbar-light bg-white py-3': props.light,
    ' navbar-dark bg-gradient-dark z-index-3 py-3': props.dark
  }">
    <div :class="props.transparent || props.light || props.dark
      ? 'container'
      : 'container-fluid px-0'
      ">
      <RouterLink class="navbar-brand d-none d-md-block fs-5" :class="[
        (props.transparent && textDark.value) || !props.transparent
          ? 'text-dark font-weight-bolder ms-sm-3'
          : 'text-white font-weight-bolder ms-sm-3'
      ]" :to="{ name: 'presentation' }" rel="tooltip" title="Designed and Coded by Creative Tim"
        data-placement="bottom">
        TickLIVE
      </RouterLink>
      <RouterLink class="navbar-brand d-block d-md-none fs-6" :class="props.transparent || props.dark
        ? 'text-white'
        : 'font-weight-bolder ms-sm-3'
        " to="/" rel="tooltip" title="Designed and Coded by Creative Tim" data-placement="bottom">
        TickLIVE
      </RouterLink>
      <div class="ms-auto d-lg-none d-block">
        <SignedOut>
          <button @click="clerk.openSignIn()" class="btn btn-sm bg-gradient-success mb-0">Login</button>
        </SignedOut>
        <SignedIn>
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action label="My tickets" @click="openTickets">
                <template #labelIcon>
                  <i class="fa fa-ticket-alt"></i>
                </template>
              </UserButton.Action>
              <UserButton.Action label="My venues" @click="openVenues">
                <template #labelIcon>
                  <i class="fa fa-building"></i>
                </template>
              </UserButton.Action>
              <UserButton.Action label="My events" @click="openEvents">
                <template #labelIcon>
                  <i class="fa fa-calendar-alt"></i>
                </template>
              </UserButton.Action>
            </UserButton.MenuItems>
          </UserButton>
        </SignedIn>
      </div>
      <button class="navbar-toggler border-0 shadow-none ms-2" type="button" data-bs-toggle="collapse"
        data-bs-target="#navigation" aria-controls="navigation" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon mt-2">
          <span class="navbar-toggler-bar bar1"></span>
          <span class="navbar-toggler-bar bar2"></span>
          <span class="navbar-toggler-bar bar3"></span>
        </span>
      </button>
      <div class="collapse navbar-collapse w-100 pt-3 pb-2 py-lg-0" id="navigation">
        <ul class="navbar-nav navbar-nav-hover ms-auto">
          <li class="nav-item dropdown dropdown-hover mx-2">
            <a role="button" class="nav-link ps-2 d-flex cursor-pointer align-items-center" href="/events"
              :class="getTextColor()" aria-expanded="false">
              <i class="material-icons opacity-6 me-2 text-md" :class="getTextColor()">dashboard</i>
              Events
            </a>
          </li>
          <li class="nav-item dropdown dropdown-hover mx-2">
            <a role="button" class="nav-link ps-2 d-flex cursor-pointer align-items-center" href="/venues"
              :class="getTextColor()" aria-expanded="false">
              <i class="material-icons opacity-6 me-2 text-md" :class="getTextColor()">view_day</i>
              Venues
            </a>
          </li>
          <li class="nav-item dropdown dropdown-hover mx-2">
            <a role="button" class="nav-link ps-2 d-flex cursor-pointer align-items-center" :class="getTextColor()"
              id="dropdownMenuDocs" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="material-icons opacity-6 me-2 text-md" :class="getTextColor()">article</i>
              Docs
              <img :src="getArrowColor()" alt="down-arrow" class="arrow ms-2 d-lg-block d-none" />
              <img :src="getArrowColor()" alt="down-arrow" class="arrow ms-1 d-lg-none d-block ms-auto" />
            </a>
            <div
              class="dropdown-menu dropdown-menu-end dropdown-menu-animation dropdown-md mt-0 mt-lg-3 p-3 border-radius-lg"
              aria-labelledby="dropdownMenuDocs">
              <div class="d-none d-lg-block">
                <ul class="list-group">
                  <li class="nav-item list-group-item border-0 p-0">
                    <a class="dropdown-item py-2 ps-3 border-radius-md"
                      href=" https://www.creative-tim.com/learning-lab/vue/overview/material-kit/">
                      <h6
                        class="dropdown-header text-dark font-weight-bolder d-flex justify-content-cente align-items-center p-0">
                        Getting Started
                      </h6>
                      <span class="text-sm">All about overview, quick start, license and
                        contents</span>
                    </a>
                  </li>
                  <li class="nav-item list-group-item border-0 p-0">
                    <a class="dropdown-item py-2 ps-3 border-radius-md"
                      href=" https://www.creative-tim.com/learning-lab/vue/colors/material-kit/">
                      <h6
                        class="dropdown-header text-dark font-weight-bolder d-flex justify-content-cente align-items-center p-0">
                        Foundation
                      </h6>
                      <span class="text-sm">See our colors, icons and typography</span>
                    </a>
                  </li>
                  <li class="nav-item list-group-item border-0 p-0">
                    <a class="dropdown-item py-2 ps-3 border-radius-md"
                      href=" https://www.creative-tim.com/learning-lab/vue/alerts/material-kit/">
                      <h6
                        class="dropdown-header text-dark font-weight-bolder d-flex justify-content-cente align-items-center p-0">
                        Components
                      </h6>
                      <span class="text-sm">Explore our collection of fully designed
                        components</span>
                    </a>
                  </li>
                </ul>
              </div>
              <div class="row d-lg-none">
                <div class="col-md-12 g-0">
                  <a class="dropdown-item py-2 ps-3 border-radius-md" href="./pages/about-us.html">
                    <h6
                      class="dropdown-header text-dark font-weight-bolder d-flex justify-content-cente align-items-center p-0">
                      Getting Started
                    </h6>
                    <span class="text-sm">All about overview, quick start, license and
                      contents</span>
                  </a>
                  <a class="dropdown-item py-2 ps-3 border-radius-md" href="./pages/about-us.html">
                    <h6
                      class="dropdown-header text-dark font-weight-bolder d-flex justify-content-cente align-items-center p-0">
                      Foundation
                    </h6>
                    <span class="text-sm">See our colors, icons and typography</span>
                  </a>
                  <a class="dropdown-item py-2 ps-3 border-radius-md" href="./pages/about-us.html">
                    <h6
                      class="dropdown-header text-dark font-weight-bolder d-flex justify-content-cente align-items-center p-0">
                      Components
                    </h6>
                    <span class="text-sm">Explore our collection of fully designed components</span>
                  </a>
                  <a class="dropdown-item py-2 ps-3 border-radius-md" href="./pages/about-us.html">
                    <h6
                      class="dropdown-header text-dark font-weight-bolder d-flex justify-content-cente align-items-center p-0">
                      Plugins
                    </h6>
                    <span class="text-sm">Check how you can integrate our plugins</span>
                  </a>
                  <a class="dropdown-item py-2 ps-3 border-radius-md" href="./pages/about-us.html">
                    <h6
                      class="dropdown-header text-dark font-weight-bolder d-flex justify-content-cente align-items-center p-0">
                      Utility Classes
                    </h6>
                    <span class="text-sm">For those who want flexibility, use our utility
                      classes</span>
                  </a>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <ul class="navbar-nav d-lg-block d-none">
          <li class="nav-item">
            <SignedOut>
              <button @click="clerk.openSignIn()" class="btn btn-sm mb-0" :class="action.color">
                {{ action.label }}
              </button>
            </SignedOut>
            <SignedIn>
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action label="My tickets" @click="openTickets">
                    <template #labelIcon>
                      <i class="fa fa-ticket-alt"></i>
                    </template>
                  </UserButton.Action>
                  <UserButton.Action label="My venues" @click="openVenues">
                    <template #labelIcon>
                      <i class="fa fa-building"></i>
                    </template>
                  </UserButton.Action>
                  <UserButton.Action label="My events" @click="openEvents">
                    <template #labelIcon>
                      <i class="fa fa-calendar-alt"></i>
                    </template>
                  </UserButton.Action>
                </UserButton.MenuItems>
              </UserButton>
            </SignedIn>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
