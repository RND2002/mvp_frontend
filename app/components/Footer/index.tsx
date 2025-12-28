import Link from "next/link";

export const Footer = () => {
    return (

        <footer
            className={`bg-card `}
        >
            <div className="border-t border-white/80 py-6 container mx-auto flex flex-col-reverse lg:flex-row items-center gap-6 justify-between text-sm 2xl:text-base text-white">
                <p>© 2025 Smart Auto Solutions. All rights reserved.</p>
                <div className="flex flex-col lg:flex-row items-center lg:space-x-6">
                    <Link href="/terms">Terms of Use</Link>
                    <Link href="/privacy">Privacy Policy</Link>
                    <Link href="/cookies">Cookie Policy</Link>
                </div>
            </div>
        </footer>
    );
};
