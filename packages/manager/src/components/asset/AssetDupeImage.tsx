import type { AssetImageStat } from "@assetbox/tools";

import { Box } from "../ui";

interface AssetImageProps {
  asset: AssetImageStat;
}

export const AssetDupeImage = ({ asset }: AssetImageProps) => {
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
