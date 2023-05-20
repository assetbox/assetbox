import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../utils";

type ButtonVariantProps = VariantProps<typeof buttonVariants>;
type ButtonProps = React.HTMLAttributes<HTMLDivElement> & ButtonVariantProps;

const buttonVariants = cva(
  [
    "flex",
    "items-center",
    "justify-center",
    "text-white",
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
        group: ["p-0", "rounded-none"],
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

export const Button = ({ className, variant, ...props }: ButtonProps) => {
  return (
    <div className={cn(buttonVariants({ variant }), className)} {...props} />
  );
};
