import { cn } from "../../utils";

interface AssetViewProps extends React.PropsWithChildren {
  children: React.ReactNode;
  type: "icon" | "image" | "animation";
}

export const AssetView = ({ children, type }: AssetViewProps) => {
  return (
    <div
      className={cn(
        "grid auto-cols-max auto-rows-auto",
        type === "icon" &&
          "grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-7",
        type === "image" &&
          "grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-7",
        type === "animation" &&
          "grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-7"
      )}
    >
      {children}
    </div>
  );
};
