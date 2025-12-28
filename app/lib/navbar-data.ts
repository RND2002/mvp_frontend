
import { NavbarData } from "./types";


export const NAVBAR_DATA: NavbarData = {
    navItems: [
        { name: "Industries", visibleIn: "both", section: "industries" },
        { name: "Services", visibleIn: "both", section: "services" },
        { name: "About Us", visibleIn: "both", section: "about" },
        { name: "Resources", visibleIn: "both", section: "resources" }
    ],
    aiNavItems: [
        { name: "AI Chatbot", href: "/ai/semantix" }
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
            { name: "Blog", href: "/resources/blog" },
            { name: "Case Studies", href: "/resources/case-studies" }
        ]
    },
    industriesSection: {
        columns: [
            {
                title: "Healthcare",
                items: [{ name: "Hospitals", href: "/industries/healthcare/hospitals" }]
            },
            {
                title: "Fintech",
                items: [{ name: "Banking", href: "/industries/fintech/banking" }]
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
