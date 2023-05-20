import { AssetStat } from "@assetbox/tools";
import type { RadioGroupProps } from "@radix-ui/react-radio-group";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import Empty from "../assets/empty-icon.svg";
import Search from "../assets/search-icon.svg";
import { AssetIcon, AssetImage, AssetView, ListBox } from "../components";
import { ButtonGroup } from "../components/ui/ButtonGroup";
import { Input } from "../components/ui/Input";
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
  const [search, setSearch] = useState("");

  const assets = useMemo(() => {
    if (!category || !categories[category]) return [];

    const sortedAssets = categories[category]
      .sort(compareByName("ASC"))
      .filter((asset) => asset.type === mapAssetType[assetType])
      .filter((asset) =>
        asset.filename.toLowerCase().includes(search.toLowerCase())
      );

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
  }, [categories, filterOption, assetType, category, search]);

  return (
    <div className="h-full p-14">
      <div className="flex flex-wrap justify-between mb-8 gap-y-4 xxl:gap-0">
        <div className="w-full lg:w-[550px]">
          <Input
            noOutline
            className="w-full h-12 group"
            placeholder="Search for assets .."
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            startAdornment={
              <div className="flex items-center justify-center mr-[10px]">
                <Search className="w-5 h-5 group-focus-within:[&>path]:stroke-blue transition" />
              </div>
            }
          />
        </div>
        <div className="flex flex-wrap gap-x-5">
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

          <ListBox value={filterOption} onChange={setFilterOption}>
            <ListBox.Button className={({ open }) => cn(open && "bg-black")}>
              {filterOption}
            </ListBox.Button>
            <ListBox.Options>
              {filterOptions.map((filterOption) => (
                <ListBox.Option
                  key={`option-${filterOption}`}
                  value={filterOption}
                >
                  {filterOption}
                </ListBox.Option>
              ))}
            </ListBox.Options>
          </ListBox>
        </div>
      </div>

      {assets?.length === 0 ? (
        <div className="h-3/4">
          <div className="flex flex-col items-center justify-center h-full gap-y-5">
            <Empty className="w-28 h-28" />
            <h1 className="text-3xl font-normal">All files are empty</h1>
          </div>
        </div>
      ) : (
        <AssetView type={category === "Icons" ? "icon" : "image"}>
          {assets?.map((asset: AssetStat) => {
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
          })}
        </AssetView>
      )}
    </div>
  );
};
