import type { AssetIconStat } from "@assetbox/tools";

import { Box, InlineSVG } from "../ui";

interface AssetIconProps {
  asset: AssetIconStat;
}

export const AssetDupeIcon = ({ asset }: AssetIconProps) => {
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
