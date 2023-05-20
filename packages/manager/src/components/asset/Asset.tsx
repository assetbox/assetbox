import type { AssetStat } from "@assetbox/tools";

import { cn } from "../../utils";
import { Box, InlineSVG } from "../ui";

type AssetProps = {
  asset: AssetStat;
  disabled?: boolean;
} & React.ComponentProps<typeof Box>;

export const Asset = ({ asset, disabled, className }: AssetProps) => {
  return (
    <Box
      className={cn(
        "flex items-center justify-center cursor-pointer h-full",
        disabled && "opacity-40",
        className
      )}
    >
      {asset.type === "icon" ? (
        <InlineSVG svgHtml={asset.data} className="w-8 h-8" />
      ) : null}
      {asset.type === "image" ? (
        <img
          src={asset.filepath}
          className="flex object-cover w-full h-full rounded-lg"
        />
      ) : null}
    </Box>
  );
};
