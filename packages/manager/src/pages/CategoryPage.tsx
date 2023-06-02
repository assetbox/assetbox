import { AssetStat } from "@assetbox/tools";
import type { RadioGroupProps } from "@radix-ui/react-radio-group";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import EmptyIcon from "../assets/empty-icon.svg";
import SearchIcon from "../assets/search-icon.svg";
import { AssetItem, AssetView, FolderSelector, ListBox } from "../components";
import { AssetModal } from "../components/AssetModal";
import { ButtonGroup } from "../components/ui/ButtonGroup";
import { Input } from "../components/ui/Input";
import { useFileUpload, useModal } from "../hooks";
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

const useFilterAsset = ({
  currentCategory,
  filterOption,
  assetType,
  search,
}: {
  currentCategory?: string;
  filterOption: FilterOption;
  assetType: AssetViewType;
  search: string;
}) => {
  const { categories, usedFiles } = useAssetBoxStore();

  return useMemo(() => {
    if (!currentCategory || !categories[currentCategory]) return [];

    const sortedAssets = categories[currentCategory]
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
  }, [categories, filterOption, assetType, currentCategory, search]);
};

export const CategoryPage = () => {
  const { category } = useParams();

  const [filterOption, setFilterOption] = useState<FilterOption>(
    filterOptions[0]
  );
  const [assetType, setAssetType] = useState<AssetViewType>("Icons");
  const [search, setSearch] = useState("");

  const { usedFiles } = useAssetBoxStore();

  const assets = useFilterAsset({
    currentCategory: category,
    filterOption,
    assetType,
    search,
  });

  const {
    data: modalAsset,
    open,
    openModal,
    closeModal,
  } = useModal<AssetStat>();

  const { isDrag, dragRef } = useFileUpload({
    onDrop: (files) => {
      console.log(files);
    },
  });

  return (
    <div
      className={cn(
        "h-full p-14 transition-opacity duration-300",
        isDrag && "opacity-30"
      )}
      ref={dragRef}
    >
      <FolderSelector open={true} onClose={() => false} />
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
                <SearchIcon className="w-5 h-5 group-focus-within:[&>path]:stroke-blue transition" />
              </div>
            }
          />
        </div>
        <div className="flex flex-wrap gap-x-5">
          <ButtonGroup
            value={assetType}
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
            <EmptyIcon className="w-28 h-28" />
            <h1 className="text-3xl font-normal">All files are empty</h1>
          </div>
        </div>
      ) : (
        <AssetView type={mapAssetType[assetType]}>
          {assets?.map((asset: AssetStat) => (
            <AssetItem
              disabled={usedFiles[asset.filepath]?.length === 0}
              onClick={() => openModal(asset)}
              key={`asset-${asset.filename}`}
              asset={asset}
            />
          ))}
        </AssetView>
      )}
      <AssetModal data={modalAsset} onClose={closeModal} open={open} />
    </div>
  );
};
