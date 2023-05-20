import { AssetStat } from "@assetbox/tools";

import { cn } from "../../utils";
import { Asset } from "../asset";
import { Button } from "./Button";
import { PathCard } from "./PathCard";

interface DupeCardProps {
  asset: AssetStat;
  paths: string[];
}

export const DupeCard = ({ asset, paths }: DupeCardProps) => {
  return (
    <div className="flex max-w-[728px] min-h-[198px] bg-gray rounded-xl bg-opacity-10 py-8 px-10 gap-6">
      <div
        className={cn("flex flex-col gap-3", asset.type !== "icon" && "flex-1")}
      >
        <Asset asset={asset} />
        <Button className="w-full">Merge</Button>
      </div>
      <PathCard
        paths={paths}
        className={cn(asset.type === "image" && "flex-1")}
      />
    </div>
  );
};
