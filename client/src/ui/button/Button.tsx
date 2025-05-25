import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

export function cn(...inputs: (string | undefined | null | false)[]) {
    return inputs.filter(Boolean).join(" ");
}

const buttonVariants = cva(
    `inline-flex cursor-pointer items-center justify-center font-medium 
        transition-colors focus-visible:outline-none focus-visible:ring-2 
        focus-visible:ring-offset-2 disabled:opacity-50 
        disabled:pointer-events-none`,
    {
        variants: {
            variant: {
                primary: `bg-stone-900 text-white hover:bg-stone-950 
                    focus-visible:ring-blue-600`,
                outline: `border border-stone-300 text-gray-300 hover:bg-stone-700 
                    focus-visible:ring-gray-300`,
                link: "underline-offset-4 hover:underline text-amber-400",
            },
            size: {
                sm: "h-8 px-3 text-sm",
                md: "h-10 px-4 text-sm",
                lg: "h-12 px-6 text-base",
                icon: "h-10 w-10",
            },
            round: {
                true: "rounded-full",
                false: "rounded-md",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
            round: false,
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, round, ...props }, ref) => (
        <button
            ref={ref}
            className={cn(buttonVariants({ variant, size, round }), className)}
            {...props}
        />
    )
);
