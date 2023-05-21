import { AssetStat } from "@assetbox/tools";
import { useMemo } from "react";

import BlueCheckIcon from "../assets/blue-check.svg";
import { DupeCard } from "../components/ui/DupeCard";
import { useAssetBoxStore } from "../store";

export const DupePage = () => {
  const { dupeFiles, categories, isLoaded } = useAssetBoxStore();

  const mapAsset = useMemo(
    () =>
      Object.values(categories)
        .flat()
        .reduce((acc, asset) => {
          return { ...acc, [asset.filepath]: asset };
        }, {} as Record<string, AssetStat>),
    [categories]
  );

  const primaryFiles = dupeFiles.map((dupeFile) => dupeFile[0]);

  const assets = primaryFiles.map((primaryFile) => mapAsset[primaryFile]);

  if (isLoaded && dupeFiles?.length === 0) {
    return (
      <div className="px-14 py-11">
        <p className="text-4xl font-bold pb-9">Duplicated Assets</p>
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
    <div className="px-14 py-11">
      <p className="text-4xl font-bold pb-9">Duplicated Assets</p>
      <div className="grid grid-cols-2 gap-8">
        {assets.map((asset, index) => (
          <DupeCard
            paths={dupeFiles[index]}
            key={`card-${asset.filename}`}
            asset={asset}
          />
        ))}
      </div>
    </div>
  );
};
