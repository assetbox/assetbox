import { cva } from "class-variance-authority";

import { cn } from "../../utils";

interface InputProps extends React.HTMLAttributes<HTMLInputElement> {
  noOutline?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  value: string;
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
  startAdornment,
  endAdornment,
  placeholder,
  value,
  ...rest
}: InputProps) => {
  return (
    <div className={cn(inputVariants({ noOutline }), className)}>
      {startAdornment}
      <input
        className="w-full outline-none"
        placeholder={placeholder}
        value={value}
        {...rest}
      />
      {endAdornment}
    </div>
  );
};
