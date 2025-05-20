/*
=========================================================
* Vue Material Kit 2 - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vue-material-kit-pro
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

const imagesPrefix =
  "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/material-design-system/presentation/sections";

import imgPricing from "@/assets/img/pricing.png";
import imgFeatures from "@/assets/img/features.png";
import imgBlogPosts from "@/assets/img/blog-posts.png";
import imgTestimonials from "@/assets/img/testimonials.png";
import imgTeam from "@/assets/img/team.png";
import imgStat from "@/assets/img/stat.png";
import imgContent from "@/assets/img/content.png";
import imgPagination from "@/assets/img/pagination.png";
import imgAlert from "@/assets/img/alerts.jpg";
import imgPopover from "@/assets/img/popovers.jpg";
import imgModal from "@/assets/img/modals.jpg";
import imgDropdowns from "@/assets/img/dropdowns.jpg";

export default [
  {
    heading: "Design Blocks",
    description:
      "A selection of 45 page sections that fit perfectly in any combination",
    items: [
      {
        image: `${imagesPrefix}/headers.jpg`,
        title: "Page Headers",
        route: "presentation",
        price: 149
      },
      {
        image: imgFeatures,
        title: "Features",
        route: "presentation",
        price: 199
      },
      {
        image: imgPricing,
        title: "Pricing",
        route: "presentation",
        price: 249
      },
      {
        image: `${imagesPrefix}/faq.jpg`,
        title: "FAQ",
        route: "presentation",
        price: 129
      },
      {
        image: imgBlogPosts,
        title: "Blog Posts",
        route: "presentation",
        price: 179
      },
      {
        image: imgTestimonials,
        title: "Testimonials",
        route: "presentation",
        price: 159
      },
      {
        image: imgTeam,
        title: "Teams",
        route: "presentation",
        price: 199
      },
      {
        image: imgStat,
        title: "Stats",
        route: "presentation",
        price: 149
      },
      {
        image: `${imagesPrefix}/call-to-action.jpg`,
        title: "Call to Actions",
        route: "presentation",
        price: 169
      },
      {
        image: `${imagesPrefix}/projects.jpg`,
        title: "Applications",
        route: "presentation",
        price: 299
      },
      {
        image: `${imagesPrefix}/logo-area.jpg`,
        title: "Logo Areas",
        route: "presentation",
        price: 119
      },
      {
        image: `${imagesPrefix}/footers.jpg`,
        title: "Footers",
        route: "presentation",
        price: 139
      },
      {
        image: `${imagesPrefix}/general-cards.jpg`,
        title: "General Cards",
        route: "presentation",
        price: 189
      },
      {
        image: imgContent,
        title: "Content Sections",
        route: "presentation",
        price: 159
      }
    ]
  },
  {
    heading: "Navigation",
    description: "30+ components that will help go through the pages",
    items: [
      {
        image: `${imagesPrefix}/navbars.jpg`,
        title: "Navbars",
        route: "presentation",
        price: 129
      },
      {
        image: `${imagesPrefix}/nav-tabs.jpg`,
        title: "Nav Tabs",
        route: "presentation",
        price: 99
      },
      {
        image: imgPagination,
        title: "Pagination",
        route: "presentation",
        price: 79
      }
    ]
  },
  {
    heading: "Input Areas",
    description:
      "50+ elements that you need for text manipulation and insertion",
    items: [
      {
        image: `${imagesPrefix}/newsletters.jpg`,
        title: "Newsletters",
        route: "presentation",
        price: 149
      },
      {
        image: `${imagesPrefix}/contact-sections.jpg`,
        title: "Contact Sections",
        route: "presentation",
        price: 179
      },
      {
        image: `${imagesPrefix}/forms.jpg`,
        title: "Forms",
        route: "presentation",
        price: 119
      },
      {
        image: `${imagesPrefix}/inputs.jpg`,
        title: "Inputs",
        route: "presentation",
        price: 99
      }
    ]
  },
  {
    heading: "Attention Catchers",
    description:
      "20+ Fully coded components that popup from different places of the screen",
    items: [
      {
        image: imgAlert,
        title: "Alerts",
        route: "presentation",
        price: 89
      },
      {
        image: `${imagesPrefix}/toasts.jpg`,
        title: "Notifications",
        route: "presentation",
        price: 119
      },
      {
        image: imgPopover,
        title: "Tooltips & Popovers",
        route: "presentation",
        price: 79
      },
      {
        image: imgModal,
        title: "Modals",
        route: "presentation",
        price: 99
      }
    ]
  }
];
