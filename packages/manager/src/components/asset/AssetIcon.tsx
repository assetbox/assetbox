import type { AssetIconStat } from "@assetbox/tools";

import { Box, InlineSVG } from "../ui";

export interface AssetIconProps extends React.HTMLAttributes<HTMLDivElement> {
  asset: AssetIconStat;
}

export const AssetIcon = ({ asset, ...props }: AssetIconProps) => {
  const [filename] = asset.filename.split(".");

  return (
    <div className="group" {...props}>
      <Box
        className="flex items-center justify-center h-16 transition-shadow cursor-pointer group-hover:shadow-hover"
        key={`icon-${asset.filename}`}
      >
        <InlineSVG svgHtml={asset.data} className="w-8 h-8" />
      </Box>
      <p className="pt-3 text-sm text-center cursor-pointer text-gray-dark group-hover:text-blue">
        {filename}
      </p>
    </div>
  );
};
