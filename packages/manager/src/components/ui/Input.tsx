import { cva } from "class-variance-authority";

import { cn } from "../../utils";

interface InputProps extends React.HTMLAttributes<HTMLInputElement> {
  noOutline?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

const inputVariants = cva(
  [
    "flex",
    "items-center",
    "px-[10px]",
    "text-gray",
    "rounded",
    "bg-white",
    "border-gray",
    "border",
    "focus-within:border-blue",
    "outline-none",
  ],
  {
    variants: {
      noOutline: {
        true: ["border-none"],
      },
    },
    defaultVariants: { noOutline: false },
  }
);

export const Input = ({
  className,
  noOutline,
  endAdornment,
  ...rest
}: InputProps) => {
  return (
    <div className={cn(inputVariants({ noOutline }), className)}>
      <input
        className="w-full outline-none"
        placeholder="Search assets"
        {...rest}
      />
      {endAdornment}
    </div>
  );
};
