import { AssetStat } from "@assetbox/tools";
import React from "react";

import { cn } from "../../utils";
import { Button } from "./Button";
import { PathCard } from "./PathCard";

interface DupeCardProps {
  children: React.ReactNode;
  type: AssetStat["type"];
  paths: string[];
}

export const DupeCard = ({ children, type, paths }: DupeCardProps) => {
  return (
    <div className="flex max-w-[728px] min-h-[198px] bg-gray rounded-xl bg-opacity-10 py-8 px-10">
      <div
        className={cn("flex-col space-y-4 mr-6", type === "image" && "flex-1")}
      >
        {children}
        <Button className="w-full">Merge</Button>
      </div>
      <PathCard paths={paths} type={type} />
    </div>
  );
};
