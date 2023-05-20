import { AssetStat } from "@assetbox/tools";

import BlueCheckIcon from "../assets/blue-check.svg";
import { AssetIconProps, AssetImageProps, Box, InlineSVG } from "../components";
import { DupeCard } from "../components/ui/DupeCard";
import { useAssetBoxStore } from "../store";

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

export const DupePage = () => {
  const { dupeFiles, categories, isLoaded } = useAssetBoxStore();

  const mapAsset = Object.values(categories)
    .flat()
    .reduce((acc, asset) => {
      return { ...acc, [asset.filepath]: asset };
    }, {} as Record<string, AssetStat>);

  const primaryFiles = dupeFiles.map((dupeFile) => dupeFile[0]);

  const assets = primaryFiles.map((primaryFile) => mapAsset[primaryFile]);

  if (isLoaded && dupeFiles.length === 0) {
    return (
      <div className="px-14 pt-11">
        <p className="pb-9 font-bold text-4xl">Duplicated Assets</p>
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center justify-center">
            <BlueCheckIcon className="mb-5 w-28 h-28" />
            <p className="text-3xl font-normal">All files are unique</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-14 pt-11">
      <p className="pb-9 font-bold text-4xl">Duplicated Assets</p>
      <div className="grid grid-cols-2  gap-8">
        {assets.map((asset, index) => {
          switch (asset.type) {
            case "icon": {
              return (
                <DupeCard paths={dupeFiles[index]} type={asset.type}>
                  <AssetIcon asset={asset} />
                </DupeCard>
              );
            }
            case "image":
              return (
                <DupeCard paths={dupeFiles[index]} type={asset.type}>
                  <AssetImage asset={asset} />
                </DupeCard>
              );
          }
        })}
      </div>
    </div>
  );
};
