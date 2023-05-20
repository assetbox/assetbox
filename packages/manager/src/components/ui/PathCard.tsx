import { cn } from "../../utils";

interface PathCardProps extends React.HTMLAttributes<HTMLDivElement> {
  paths: string[];
}

export const PathCard = ({ paths, className, ...props }: PathCardProps) => {
  return (
    <div
      className={cn(
        "grow bg-[#F7F9Fb] rounded-lg p-6 overflow-auto",
        className
      )}
      {...props}
    >
      {paths.map((path, index) => (
        <div className="flex flex-nowrap" key={`path-${path}`}>
          <p className="text-sm w-6 min-w-[24px] text-gray-dark text-opacity-20">
            {index + 1}
          </p>
          <p className="text-sm">{path}</p>
        </div>
      ))}
    </div>
  );
};
