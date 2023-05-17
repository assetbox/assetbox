import { cn } from "../../utils";

export const Box = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("bg-white shadow rounded-lg", className)} {...props} />
  );
};
