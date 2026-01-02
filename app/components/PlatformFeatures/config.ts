import { FC, SVGProps } from "react";
import {
  DoorstepIcon,
  VisualizationIcon,
  TrackingIcon,
  MechanicsIcon,
  PricingIcon,
  PartsIcon,
  EmergencyIcon,
  GuaranteeIcon,
  BookingIcon,
  ModificationIcon,
  ReportsIcon,
  MembershipIcon,
} from "../../assets/platformFeatureIcons/featureIcons";

export enum CardTypes {
  BLUE = "blue",
  RED = "red",
  GREEN = "green",
  GOLD = "gold",
}

export interface FeatureCardProps {
  title: string;
  subtitle: string;
  icon: FC<SVGProps<SVGSVGElement>>; // component type
  accent: CardTypes;
  features: readonly string[];
}

export const FEATURES: FeatureCardProps[] = [
  {
    title: "Doorstep Service",
    subtitle: "Free Pickup & Delivery",
    icon: DoorstepIcon,
    accent: CardTypes.BLUE,
    features: [
      "Free within 10 miles",
      "Scheduled at your convenience",
      "Real-time driver tracking",
      "Safe & insured transport",
    ],
  },
  {
    title: "3D Visualization",
    subtitle: "See Before You Buy",
    icon: VisualizationIcon,
    accent: CardTypes.RED,
    features: [
      "Interactive 3D car models",
      "Preview modifications live",
      "360° rotation & zoom",
      "AR view on mobile",
    ],
  },
  {
    title: "Real-time Tracking",
    subtitle: "Always Know the Status",
    icon: TrackingIcon,
    accent: CardTypes.GREEN,
    features: [
      "Live service progress",
      "Photo/video updates",
      "SMS & push notifications",
      "Estimated completion time",
    ],
  },
  {
    title: "Certified Mechanics",
    subtitle: "Trusted Professionals",
    icon: MechanicsIcon,
    accent: CardTypes.GOLD,
    features: [
      "Factory-trained",
      "Background verified",
      "4.8+ ratings",
      "5+ years experience",
    ],
  },
  {
    title: "Transparent Pricing",
    subtitle: "No Hidden Charges",
    icon: PricingIcon,
    accent: CardTypes.BLUE,
    features: [
      "Instant online quotes",
      "Detailed cost breakdown",
      "Price match guarantee",
      "Digital invoicing",
    ],
  },
  {
    title: "Parts Marketplace",
    subtitle: "OEM & Aftermarket",
    icon: PartsIcon,
    accent: CardTypes.RED,
    features: [
      "Genuine OEM parts",
      "Quality aftermarket options",
      "Warranty included",
      "Expert installation",
    ],
  },
  {
    title: "24/7 Emergency",
    subtitle: "Always There for You",
    icon: EmergencyIcon,
    accent: CardTypes.RED,
    features: [
      "Roadside assistance",
      "Towing services",
      "Battery jumpstart",
      "Flat tire help",
    ],
  },
  {
    title: "Quality Guarantee",
    subtitle: "Satisfaction Assured",
    icon: GuaranteeIcon,
    accent: CardTypes.GREEN,
    features: [
      "30-day warranty",
      "Satisfaction assured",
      "Free re-inspection",
      "Money-back option",
    ],
  },
  {
    title: "Smart Booking",
    subtitle: "Book in 60 Seconds",
    icon: BookingIcon,
    accent: CardTypes.BLUE,
    features: [
      "Online & call booking",
      "Flexible scheduling",
      "Calendar integration",
      "Auto reminders",
    ],
  },
  {
    title: "Modification Studio",
    subtitle: "Custom Build Your Ride",
    icon: ModificationIcon,
    accent: CardTypes.GOLD,
    features: [
      "Performance upgrades",
      "Body kit installation",
      "Interior customization",
      "Paint & wrap services",
    ],
  },
  {
    title: "Digital Reports",
    subtitle: "Complete Documentation",
    icon: ReportsIcon,
    accent: CardTypes.BLUE,
    features: [
      "Before/after photos",
      "Service history tracking",
      "Vehicle health card",
      "Email & app access",
    ],
  },
  {
    title: "Membership Plans",
    subtitle: "Exclusive Benefits",
    icon: MembershipIcon,
    accent: CardTypes.GOLD,
    features: [
      "Up to 20% off",
      "Free services",
      "Priority booking",
      "Exclusive perks",
    ],
  },
];
