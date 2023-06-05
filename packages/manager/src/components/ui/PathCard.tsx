import { cn } from "../../utils";

interface PathCardProps extends React.HTMLAttributes<HTMLDivElement> {
  paths: string[];
  fallback?: string;
}

const PathCardItem = ({ index, path }: { index: number; path: string }) => {
  return (
    <div className="flex flex-nowrap" key={`path-${path}`}>
      <p className="text-sm w-6 min-w-[24px] text-gray-dark text-opacity-20">
        {index}
      </p>
      <p className="text-sm">{path}</p>
    </div>
  );
};

export const PathCard = ({
  paths,
  fallback,
  className,
  ...props
}: PathCardProps) => {
  return (
    <div
      className={cn(
        "grow bg-gray-light rounded-lg p-6 overflow-auto",
        className
      )}
      {...props}
    >
      {fallback && paths.length === 0 ? (
        <div className="flex flex-nowrap">
          <p className="text-sm text-gray-dark">{fallback}</p>
        </div>
      ) : (
        paths.map((path, index) => (
          <PathCardItem index={index + 1} path={path} />
        ))
      )}
    </div>
  );
};
