import type { AssetStat } from "@assetbox/tools";
import camelCase from "camelcase";

import { isLibraryMode } from "../../env";
import { Asset } from "./Asset";
export interface AssetItemProps extends React.HTMLAttributes<HTMLDivElement> {
  asset: AssetStat;
  disabled?: boolean;
}

export const AssetItem = ({ asset, disabled, ...props }: AssetItemProps) => {
  const [filename] = asset.filename.split(".");

  return (
    <div className="pb-2 group" {...props}>
      <Asset
        asset={asset}
        disabled={disabled}
        className="transition-shadow cursor-pointer group-hover:shadow-hover"
      />
      <p className="pt-3 text-sm text-center cursor-pointer text-gray-dark group-hover:text-blue">
        {!isLibraryMode
          ? filename
          : camelCase(filename, {
              pascalCase: true,
            })}
      </p>
    </div>
  );
};
