import { cn } from "../../utils";

interface ProgressBarProps {
  rate: number;
  format: string;
  className: string;
}

export const ProgressBar = ({ rate, format, className }: ProgressBarProps) => {
  return (
    <div className={cn("h-6 ", className)}>
      <div className="relative inline-flex items-center w-full h-full bg-opacity-50 rounded bg-gray">
        <div
          style={{ width: `${rate}%` }}
          className={`absolute h-full bg-blue rounded`}
        />
        <p className="absolute ml-2 text-xs text-white">
          {format.replace("{rate}", String(rate))}
        </p>
      </div>
    </div>
  );
};
