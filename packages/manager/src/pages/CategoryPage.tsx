import { AssetStat } from "@assetbox/tools";
import type { RadioGroupProps } from "@radix-ui/react-radio-group";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { AssetIcon, AssetImage, AssetView, ListBox } from "../components";
import { ButtonGroup } from "../components/ui/ButtonGroup";
import { useAssetBoxStore } from "../store";
import { cn } from "../utils";
import { compareByName } from "../utils/sort";

type AssetViewType = "Icons" | "Images" | "Animations";
type FilterOption = "All" | "Used" | "Not Used";

const filterOptions: FilterOption[] = ["All", "Used", "Not Used"];

const mapAssetType: Record<AssetViewType, AssetStat["type"]> = {
  Icons: "icon",
  Images: "image",
  Animations: "animation",
};

export const CategoryPage = () => {
  const { category } = useParams();

  const { categories, usedFiles } = useAssetBoxStore();
  const [filterOption, setFilterOption] = useState<FilterOption>(
    filterOptions[0]
  );
  const [assetType, setAssetType] = useState<AssetViewType>("Icons");

  if (!category) {
    return <div>Category not found</div>;
  }

  const assets = useMemo(() => {
    const sortedAssets = categories[category]
      ?.sort(compareByName("ASC"))
      .filter((asset) => asset.type === mapAssetType[assetType]);

    switch (filterOption) {
      case "Used": {
        return sortedAssets.filter(
          (asset) => usedFiles[asset.filepath]?.length > 0
        );
      }
      case "Not Used": {
        return sortedAssets.filter(
          (asset) => usedFiles[asset.filepath]?.length == 0
        );
      }
      default:
      case "All": {
        return sortedAssets;
      }
    }
  }, [categories[category], filterOption, assetType]);
  console.log(assets);
  return (
    <div className="p-14">
      <ListBox value={filterOption} onChange={setFilterOption}>
        <ListBox.Button className={({ open }) => cn(open && "bg-black")}>
          {filterOption}
        </ListBox.Button>
        <ListBox.Options>
          {filterOptions.map((filterOption) => (
            <ListBox.Option key={`option-${filterOption}`} value={filterOption}>
              {filterOption}
            </ListBox.Option>
          ))}
        </ListBox.Options>
      </ListBox>
      <ButtonGroup
        defaultValue="Icons"
        onValueChange={setAssetType as RadioGroupProps["onValueChange"]}
      >
        <ButtonGroup.Button value={"Icons"} className="w-24 h-12">
          Icons
        </ButtonGroup.Button>
        <ButtonGroup.Button value={"Images"} className="w-24 h-12">
          Images
        </ButtonGroup.Button>
        <ButtonGroup.Button value={"Animations"} className="w-24 h-12">
          Animations
        </ButtonGroup.Button>
      </ButtonGroup>
      {/* TODO: AssetView type value => ButtonGroup state */}
      <AssetView type={category === "Icons" ? "icon" : "image"}>
        {useMemo(() => {
          return assets?.map((asset: AssetStat) => {
            switch (asset.type) {
              case "icon": {
                return (
                  <AssetIcon key={`icon-${asset.filename}`} asset={asset} />
                );
              }
              case "image":
                return (
                  <AssetImage key={`image-${asset.filename}`} asset={asset} />
                );
            }
          });
        }, [assets])}
      </AssetView>
    </div>
  );
};
