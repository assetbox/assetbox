import { cn } from "../../utils";

interface PathCardProps extends React.HTMLAttributes<HTMLDivElement> {
  paths: string[];
}

export const PathCard = ({ paths, className, ...props }: PathCardProps) => {
  return (
    <div
      className={cn(
        "grow bg-[#F7F9Fb] rounded-lg p-6 overflow-y-scroll",
        className
      )}
      {...props}
    >
      {paths.map((path, index) => (
        <div className="text-gray-dark" key={`path-${path}`}>
          <span className="text-black text-opacity-20 mr-6">{index + 1}</span>
          {path}
        </div>
      ))}
    </div>
  );
};
