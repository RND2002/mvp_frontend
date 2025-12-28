"use client";

// import { Navbar } from "@/app/components/navbar";
import { ContactUsPopupProvider, usePopup } from "../components/Providers/ContactUsPopupProvider";
import CustomButton from "../ui/button/CustomButton";
import SecondaryButton from "../ui/button/SecondaryButton";
import WhiteButton from "../ui/button/WhiteButton";
import PrimaryButton from "../components/common/PrimaryButton";
import FormField from "../ui/input/FormField";
import FormFieldInsideLabel from "../ui/input/FormField2";
import PopupFormField from "../ui/input/PopupFormField";
import MathCaptcha from "../components/common/MathCaptcha";
import { useMathCaptcha } from "@/app/hooks/useMathCaptcha";
import { useForm } from "react-hook-form";

function DashboardContent() {
    const { showPopup, hideCta } = usePopup();
    const captcha = useMathCaptcha();
    const { register } = useForm();

    return (
        // <div className="min-h-screen bg-gray-50">
        //     {/* <Navbar /> Moved to layout.tsx */}
        //     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        //         <h1 className="text-3xl font-bold text-gray-900 mb-8">UI Component Showcase</h1>

        //         <div className="grid gap-8">
        //             {/* Buttons Section */}
        //             <section className="bg-white rounded-2xl shadow-sm p-8">
        //                 <h2 className="text-xl font-semibold mb-6 border-b pb-2">Buttons</h2>
        //                 <div className="flex flex-wrap gap-4 items-center">
        //                     <CustomButton onClick={() => alert("Custom Button Clicked")}>
        //                         Custom Button
        //                     </CustomButton>

        //                     <PrimaryButton onClick={() => alert("Primary Button Clicked")}>
        //                         Primary Button
        //                     </PrimaryButton>

        //                     <SecondaryButton onClick={() => alert("Secondary Button Clicked")}>
        //                         Secondary Button
        //                     </SecondaryButton>

        //                     <div className="p-4 bg-gray-900 rounded-lg">
        //                         <WhiteButton onClick={() => alert("White Button Clicked")}>
        //                             White Button
        //                         </WhiteButton>
        //                     </div>
        //                 </div>
        //             </section>

        //             {/* Inputs Section */}
        //             <section className="bg-white rounded-2xl shadow-sm p-8">
        //                 <h2 className="text-xl font-semibold mb-6 border-b pb-2">Inputs</h2>
        //                 <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
        //                     <div>
        //                         <h3 className="text-sm font-medium text-gray-500 mb-4">Standard Form Field</h3>
        //                         <FormField
        //                             label="Username"
        //                             placeholder="Enter username"
        //                         />
        //                         <FormField
        //                             label="Bio"
        //                             as="textarea"
        //                             placeholder="Tell us about yourself"
        //                         />
        //                     </div>

        //                     <div>
        //                         <h3 className="text-sm font-medium text-gray-500 mb-4">Inside Label Field (FormField2)</h3>
        //                         <div className="space-y-4">
        //                             <FormFieldInsideLabel
        //                                 label="Email Address"
        //                             />
        //                             <FormFieldInsideLabel
        //                                 label="Comments"
        //                                 as="textarea"
        //                             />
        //                         </div>
        //                     </div>

        //                     <div>
        //                         <h3 className="text-sm font-medium text-gray-500 mb-4">Popup Form Field (With Icon)</h3>
        //                         <PopupFormField
        //                             label="Full Name"
        //                             placeholder="John Doe"
        //                             iconSrc="/icons/contact-us/pop-up/user.svg"
        //                             {...register("mockName")}
        //                         />
        //                     </div>
        //                 </div>
        //             </section>

        //             {/* Logic Components */}
        //             <section className="bg-white rounded-2xl shadow-sm p-8">
        //                 <h2 className="text-xl font-semibold mb-6 border-b pb-2">Logic Components</h2>
        //                 <div className="grid md:grid-cols-2 gap-8">
        //                     <div>
        //                         <h3 className="text-sm font-medium text-gray-500 mb-4">Math Captcha</h3>
        //                         <div className="border p-4 rounded-xl">
        //                             <MathCaptcha captcha={captcha} />
        //                             <div className="mt-2 text-xs text-gray-500">
        //                                 Answer: {captcha.answer} (Internal State)
        //                             </div>
        //                             <button
        //                                 onClick={captcha.refresh}
        //                                 className="text-primary text-sm mt-2 hover:underline"
        //                             >
        //                                 Refresh Captcha
        //                             </button>
        //                         </div>
        //                     </div>

        //                     <div>
        //                         <h3 className="text-sm font-medium text-gray-500 mb-4">Popup Integration</h3>
        //                         <p className="text-gray-600 mb-4 text-sm">
        //                             Click below to test the full contact popup flow.
        //                         </p>
        //                         <CustomButton onClick={showPopup}>
        //                             Open Contact Popup
        //                         </CustomButton>
        //                     </div>
        //                 </div>
        //             </section>
        //         </div>
        //     </div>
        // </div>
        <>
        </>
    );
}

export default function DashboardPage() {
    const contactData = {};
    const ctaData = {
        title: "Get in Touch",
        description: "Leave your number and we'll call you back.",
    }

    return (
        <ContactUsPopupProvider contactData={contactData} ctaContactData={ctaData}>
            <DashboardContent />
        </ContactUsPopupProvider>
    );
}
