import { User } from '@supabase/supabase-js'

declare global {
    namespace Express {
        interface Request {
            user?: User
        }
    }

    interface PartnerSectionItem {
        title: string;
        subtitle: string;
        content: {
            heading: string;
            description: string;
        };
        techExpertise: {
            name: string;
            icon?: string;
            preserveColor?: boolean;
        }[];
        futureProducts?: any[];
    }

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
}




// export { }


