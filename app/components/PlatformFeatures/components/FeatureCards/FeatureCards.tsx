import { FeatureCardProps } from "../../config";

const accentMap = {
    blue: "border-blue-500 text-blue-400",
    red: "border-red-500 text-red-400",
    green: "border-emerald-500 text-emerald-400",
    gold: "border-yellow-400 text-yellow-400",
};

const iconBg = {
    blue: "bg-[#357ABD]/20",
    red: "bg-[#C41E3A]/20 ",
    green: "bg-[#00CC66]/20 ",
    gold: "bg-[#FFA500]/20 ",
};



export const FeatureCard = ({
    title,
    subtitle,
    accent,
    icon,
    features,
}: FeatureCardProps) => {
    const Icon = icon;

    return (
        <div
            className={`rounded-xl border-2 bg-slate-800/90 p-3 shadow-xl backdrop-blur ${accentMap[accent]}`}
        >
            <div className="flex gap-2">
                <div className={`flex h-14 w-14 items-center justify-center rounded-full ${iconBg[accent]}`}>
                    <Icon width={52} height={52} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">{title}</h3>
                    <p className="text-[12px] font-medium">{subtitle}</p>
                </div>
            </div>



            <ul className="mt-4 space-y-1 text-sm text-gray-300">
                {features.map((item) => (
                    <li key={item}>• {item}</li>
                ))}
            </ul>
        </div>
    );
};
