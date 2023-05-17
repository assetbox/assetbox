import { cn } from "../../utils";

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  rate: number;
}

export const ProgressBar = ({
  rate,
  className,
  children,
  ...props
}: ProgressBarProps) => {
  return (
    <div className={cn("h-6", className)} {...props}>
      <div className="relative inline-flex items-center w-full h-full bg-opacity-50 rounded bg-gray">
        <div
          style={{ width: `${rate}%` }}
          className={"absolute h-full bg-blue rounded"}
        />
        <div className="absolute w-full px-2 text-xs text-white">
          {children}
        </div>
      </div>
    </div>
  );
};
