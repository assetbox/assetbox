import { AssetStat } from "@assetbox/tools";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { compareByName } from "src/utils/sort";

import { AssetIcon, AssetImage, AssetView, ListBox } from "../components";
import { useAssetBoxStore } from "../store";
import { cn } from "../utils";

type ListFilterType = "All" | "Used" | "Not Used";
const list: ListFilterType[] = ["All", "Used", "Not Used"];

export const CategoryPage = () => {
  const { category } = useParams();

  const { categories } = useAssetBoxStore();
  const [selected, setSelected] = useState<ListFilterType>(list[0]);

  if (!category) {
    return <div>Category not found</div>;
  }
  const assets = useMemo(() => {
    switch (selected) {
      case "Used": {
        return categories[category]
          ?.sort(compareByName("ASC"))
          .filter((elem) => elem.size > 500);
      }
      default:
      case "All": {
        return categories[category]?.sort(compareByName("ASC")) ?? [];
      }
    }
  }, [categories[category], selected]);

  const menuHandle = (item: ListFilterType) => {
    setSelected(item);
  };
  console.log(assets);
  return (
    <div className="p-14">
      <ListBox
        value={selected}
        onChange={(item: ListFilterType) => menuHandle(item)}
      >
        <ListBox.Button className={({ open }) => cn(open && "bg-black")}>
          {selected}
        </ListBox.Button>
        <ListBox.Options>
          {list.map((elem) => (
            <ListBox.Option key={`option-${elem}`} value={elem}>
              {elem}
            </ListBox.Option>
          ))}
        </ListBox.Options>
      </ListBox>
      {/* TODO: AssetView type value => ButtonGroup state */}
      <AssetView type={category === "Icons" ? "icon" : "image"}>
        {useMemo(() => {
          return assets.map((asset: AssetStat) => {
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
