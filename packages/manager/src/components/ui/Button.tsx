import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../utils";

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
type ButtonProps = React.HTMLAttributes<HTMLDivElement> & ButtonVariantProps;

const buttonVariants = cva(
  "flex cursor-pointer select-none items-center justify-center text-white rounded transition hover:bg-opacity-80 active:bg-opacity-50 py-1 px-9 text-sm",
  {
    variants: {
      variant: {
        primary: ["bg-blue"],
        danger: ["bg-red"],
        gray: ["bg-gray"],
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
