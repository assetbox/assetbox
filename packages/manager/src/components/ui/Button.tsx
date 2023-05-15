import { cva } from "class-variance-authority";

import { cn } from "../../utils";

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "danger" | "group";
}

const buttonVariants = cva(
  [
    "text-white",
    "border",
    "rounded",
    "transition",
    "hover:bg-opacity-80",
    "active:bg-opacity-50",
  ],
  {
    variants: {
      variant: {
        primary: ["bg-blue", "py-1", "px-9"],
        danger: ["bg-red", "py-1", "px-9"],
        group: ["p-0", "border-none", "rounded-none"],
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
