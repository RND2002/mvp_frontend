
export interface NavItem {
    name: string;
    href?: string;
    description?: string;
    visibleIn?: "mobile" | "desktop" | "both";
    icon?: string;
    logo?: string;
    label?: string;
    section?: string;
}

export interface NavSection {
    items: NavItem[];
}

export type Column = IndustryColumn;

export interface IndustryColumn {
    title: string;
    items: NavItem[];
}

export interface IndustriesSection {
    columns: IndustryColumn[];
}

export interface Category {
    title: string;
    description?: string;
    items?: NavItem[];
    link?: NavItem;
}

export interface ServicesSectionData {
    categories: Category[];
    branding?: any;
}

export interface NavbarData {
    navItems: NavItem[];
    aiNavItems: NavItem[];
    foodNavItems: NavItem[];
    navSlideItems: string[];
    aboutUsSection: NavSection;
    resourcesSection: NavSection;
    industriesSection: IndustriesSection;
    servicesSection: ServicesSectionData;
    whoWeServe?: NavSection;
}

export interface ContactData {
    email: string;
    uae: { country: string; phone: string };
    india: { country: string; phone: string };
}
