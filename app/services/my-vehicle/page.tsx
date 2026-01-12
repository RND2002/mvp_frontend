import Hero from '@/app/components/Hero/index';
import heroData from '@/app/json/my-vehicle.json';
import categoryData from '@/app/json/services.json';
import ConsultantCategorySection from '@/app/components/common/CategoryCards/index';

const Page = () => {
    return (
        <main>
            <Hero data={heroData} />
            <ConsultantCategorySection data={categoryData} />
        </main>
    );
};

export default Page;
