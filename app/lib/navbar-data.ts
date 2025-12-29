
import { NavbarData } from "@/app/lib/types";


export const NAVBAR_DATA: NavbarData = {
    navItems: [
        { name: "RideVision Studio", visibleIn: "both", section: "studio", href: "/studio" },
        { name: "About Us", visibleIn: "both", section: "about", href: "/about" },
        { name: "Our Services", visibleIn: "both", section: "our-services" }
    ],
    foodNavItems: [
        { name: "Food Delivery", href: "/food/delivery" }
    ],
    navSlideItems: [
        "Innovation",
        "Technology",
        "Future"
    ],
    aboutUsSection: {
        items: [
            { name: "Our Story", href: "/about/story" },
            { name: "Team", href: "/about/team" }
        ]
    },
    resourcesSection: {
        items: [
            { name: "Service Now", href: "/services/now" },
            { name: "Upgrade My Ride", href: "/services/upgrade" },
            { name: "Auto Parts Store", href: "/services/parts" },
            { name: "My Vehicle", href: "/services/my-vehicle" }
        ]
    },
    studioSection: {
        items: [
            { name: "Bike Studio", href: "/studio/bike" },
            { name: "Car Studio", href: "/studio/car" },
            { name: "Van Studio", href: "/studio/van" },
            { name: "Truck Studio", href: "/studio/truck" }
        ]
    },
    industriesSection: {
        columns: [
            {
                title: "Healthcare",
                items: [{ name: "Hospitals", href: "/studio/healthcare/hospitals" }]
            },
            {
                title: "Fintech",
                items: [{ name: "Banking", href: "/studio/fintech/banking" }]
            }
        ]
    },
    servicesSection: {
        categories: [
            {
                title: "App Development",
                items: [{ name: "iOS", href: "/services/ios" }, { name: "Android", href: "/services/android" }]
            }
        ],
        branding: {
            sliderItems: ["Innovate", "Create", "Deploy"],
            contactTitle: "Ready to Start?",
            helpingText: "Let's build something amazing.",
            buttonText: "Contact Us"
        }
    }
};
