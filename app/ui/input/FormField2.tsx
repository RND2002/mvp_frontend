import React from "react";

interface FormFieldInsideLabelProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    color?: "white" | "dark";
    as?: "input" | "textarea";
    rows?: number;
}

const FormFieldInsideLabel: React.FC<FormFieldInsideLabelProps> = ({
    label,
    as = "input",
    color = "dark",
    rows = 3,
    ...props
}) => {
    const baseClass = `
  w-full rounded-md px-6 py-3 text-sm
  ${color === "white"
            ? "bg-transparent border border-white/30 text-white placeholder:text-white/70 focus:border-white"
            : "bg-text-field text-text-dark placeholder:text-gray-500 focus:border-primary-dark"
        }
  focus:ring-2 focus:ring-primary-dark focus:outline-none transition-all
`;


    return (
        <div className="relative w-full">
            {as === "textarea" ? (
                <textarea
                    rows={rows}
                    placeholder={label}
                    {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                    className={`${baseClass} resize-none`}
                />
            ) : (
                <input {...props} placeholder={label} className={baseClass} />
            )}
        </div>
    );
};

export default FormFieldInsideLabel;
