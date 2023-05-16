import { cn } from "../../utils";

export const Box = ({
  className,
  children,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => {
  return (
    <div className={cn("bg-white shadow rounded-lg", className)} {...props}>
      {children}
    </div>
  );
};
