import type { ReactElement } from "react";

interface ButtonProps {
  variant: "primary" | "secondary";
  text: string;
  startIcon?: ReactElement; // made optional for flexibility
}

const variantClasses: Record<ButtonProps["variant"], string> = {
  primary: "bg-[#7164c0] text-white",
  secondary: "bg-[#d9ddee] text-[#3730a3]",
};

const defaultStyles = "px-4 py-2 rounded-md font-light flex items-center";

export function Button({ variant, text, startIcon }: ButtonProps) {
  return (
    <button className={`${variantClasses[variant]} ${defaultStyles}`}>
      {startIcon && <span className="pr-1.5">{startIcon}</span>}
      {text}
    </button>
  );
}