interface PartnerSection {
    title: {
        line1: string;
        line2: string;
    };
    labels: {
        techExpertise: string;
        futureProducts: string;
    };
    items: PartnerSectionItem[];
}

interface GenerativeAiSolution {
    title: string;
    description: string;
    logo?: string;
    image: string;
}

type NavItem = {
    name: string;
    href?: string;
    visibleIn?: string;
};