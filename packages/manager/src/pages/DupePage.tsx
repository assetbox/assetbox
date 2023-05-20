import { AssetStat } from "@assetbox/tools";
import { AssetDupeIcon } from "src/components/asset/AssetDupeIcon";
import { AssetDupeImage } from "src/components/asset/AssetDupeImage";

import BlueCheckIcon from "../assets/blue-check.svg";
import { DupeCard } from "../components/ui/DupeCard";
import { useAssetBoxStore } from "../store";

export const DupePage = () => {
  const { dupeFiles, categories, isLoaded } = useAssetBoxStore();

  const assetsList = Object.values(categories)
    .flat()
    .reduce((acc, asset) => {
      return { ...acc, [asset.filepath]: asset };
    }, {} as Record<string, AssetStat>);

  const DupeList = dupeFiles.map((file) => file[0]);

  const DupeFile = DupeList.map((v) => assetsList[v]);

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
        {DupeFile.map((asset, index) => {
          switch (asset.type) {
            case "icon": {
              return (
                <DupeCard path={dupeFiles[index]} type={asset.type}>
                  <AssetDupeIcon asset={asset} />
                </DupeCard>
              );
            }
            case "image":
              return (
                <DupeCard path={dupeFiles[index]} type={asset.type}>
                  <AssetDupeImage asset={asset} />
                </DupeCard>
              );
          }
        })}
      </div>
    </div>
  );
};
