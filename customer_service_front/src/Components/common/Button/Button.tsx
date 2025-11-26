// src/Components/common/Button/Button.tsx
import { ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { cva, VariantProps } from "class-variance-authority";

const buttonStyles = cva(
  [
    "flex",
    "items-center",
    "justify-center",
    "font-semibold",
    "rounded-lg",
    "shadow-sm",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-offset-2",
    "transition-colors",
    "disabled:opacity-50",
    "disabled:cursor-not-allowed",
  ],
  {
    variants: {
      variant: {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
        outline: "bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-blue-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        ghost: "bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700",
      },
      size: {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

type ButtonProps = ComponentProps<"button"> & VariantProps<typeof buttonStyles> & {
  fullWidth?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, fullWidth, className, ...props }, ref) => {
    const widthStyle = fullWidth ? "w-full" : "";
    return (
      <button
        ref={ref}
        className={twMerge(buttonStyles({ variant, size }), widthStyle, className)}
        {...props}
      />
    );
  }
);
