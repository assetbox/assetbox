import { AssetStat } from "@assetbox/tools";
import React from "react";

import { cn } from "../../utils";

interface PathCardProps {
  type: AssetStat["type"];
  paths: string[];
}

export const PathCard = ({ paths, type }: PathCardProps) => {
  return (
    <div
      className={cn(
        "grow bg-[#F7F9Fb] rounded-lg p-6 overflow-y-scroll",
        type === "image" && "flex-1"
      )}
    >
      {paths.map((path, index) => (
        <div className="text-gray-dark ">
          <span className="text-black text-opacity-20 mr-6">{index + 1}</span>
          {path}
        </div>
      ))}
    </div>
  );
};
