import { AssetStat } from "@assetbox/tools";
import React from "react";

import { cn } from "../../utils";
import { type AssetIconProps, AssetImageProps } from "../asset";
import { Box } from "./Box";
import { Button } from "./Button";
import { InlineSVG } from "./InlineSVG";
import { PathCard } from "./PathCard";

interface DupeCardProps {
  asset: AssetStat;
  paths: string[];
}

const AssetIcon = ({ asset }: AssetIconProps) => {
  return (
    <div>
      <Box
        className="flex items-center justify-center w-[122px] h-[84px] transition-shadow"
        key={`icon-${asset.filename}`}
      >
        <InlineSVG svgHtml={asset.data} className="w-8 h-8" />
      </Box>
    </div>
  );
};

const AssetImage = ({ asset }: AssetImageProps) => {
  return (
    <div>
      <Box
        className="flex items-center justify-center transition-shadow"
        key={`icon-${asset.filename}`}
      >
        <img
          src={asset.filepath}
          className="flex object-cover w-full h-full rounded-lg"
        />
      </Box>
    </div>
  );
};

export const DupeCard = ({ asset, paths }: DupeCardProps) => {
  return (
    <div className="flex max-w-[728px] min-h-[198px] bg-gray rounded-xl bg-opacity-10 py-8 px-10">
      <div
        className={cn(
          "flex-col space-y-4 mr-6",
          asset.type === "image" && "flex-1"
        )}
      >
        {asset.type === "icon" ? <AssetIcon asset={asset} /> : null}
        {asset.type === "image" ? <AssetImage asset={asset} /> : null}
        <Button className="w-full">Merge</Button>
      </div>
      <PathCard
        paths={paths}
        className={cn(asset.type === "image" && "flex-1")}
      />
    </div>
  );
};
