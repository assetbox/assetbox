import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../utils";

type InputVariantProps = VariantProps<typeof inputVariants>;
type InputProp = React.AllHTMLAttributes<HTMLInputElement> & InputVariantProps;

interface InputProps extends InputProp {
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

const inputVariants = cva(
  [
    "inline-flex",
    "items-center",
    "px-[10px]",
    "rounded",
    "bg-white",
    "border-gray",
    "focus-within:border-blue",
    "outline-none",
  ],
  {
    variants: {
      noOutline: {
        true: ["border-none"],
        false: ["border", "transition-all"],
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
  ...props
}: InputProps) => {
  return (
    <div className={cn(inputVariants({ noOutline }), className)}>
      {startAdornment}
      <input
        className="w-full outline-none"
        placeholder={placeholder}
        value={value}
        {...props}
      />
      {endAdornment}
    </div>
  );
};
