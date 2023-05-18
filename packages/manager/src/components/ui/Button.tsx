import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../utils";

type ButtonVariantProps = VariantProps<typeof buttonVariants>;
type ButtonProps = React.HTMLAttributes<HTMLButtonElement> & ButtonVariantProps;

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
  ...props
}: ButtonProps) => {
  return (
    <button className={cn(buttonVariants({ variant }), className)} {...props}>
      {children}
    </button>
  );
};
