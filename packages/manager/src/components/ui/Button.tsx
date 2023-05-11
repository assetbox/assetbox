import { cva } from "class-variance-authority";

import { cn } from "../../utils";

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "danger";
}

const buttonVariants = cva(
  [
    "text-white",
    "border",
    "rounded",
    "py-1",
    "px-9",
    "transition",
    "hover:bg-opacity-80",
    "active:bg-opacity-50",
  ],
  {
    variants: {
      variant: {
        primary: ["bg-blue"],
        danger: ["bg-red"],
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

export const Button = ({
  className,
  children,
  variant,
  ...rest
}: ButtonProps) => {
  return (
    <button className={cn(buttonVariants({ variant }), className)} {...rest}>
      {children}
    </button>
  );
};
