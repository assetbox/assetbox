import { AssetStat } from "@assetbox/tools";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { compareByName } from "src/utils/sort";

import { AssetIcon, AssetImage, AssetView, ListBox } from "../components";
import { useAssetBoxStore } from "../store";
import { cn } from "../utils";
interface OptionProps {
  id: number;
  label: string;
  value: "all" | "used" | "not-used";
}
const list: OptionProps[] = [
  {
    id: 1,
    label: "All",
    value: "all",
  },
  {
    id: 2,
    label: "Used",
    value: "used",
  },
  {
    id: 3,
    label: "Not Used",
    value: "not-used",
  },
];
export const CategoryPage = () => {
  const { category } = useParams();

  const { categories } = useAssetBoxStore();
  const [selected, setSelected] = useState<OptionProps>(list[0]);

  if (!category) {
    return <div>Category not found</div>;
  }
  const assets = useMemo(() => {
    switch (selected.value) {
      case "used": {
        return categories[category]
          ?.sort(compareByName("ASC"))
          .filter((elem) => elem.size > 500);
      }
      default:
      case "all": {
        return categories[category]?.sort(compareByName("ASC")) ?? [];
      }
    }
  }, [categories[category], selected.value]);

  const menuHandle = (item: OptionProps) => {
    setSelected(item);
  };

  return (
    <div className="p-14">
      <ListBox
        value={selected}
        onChange={(item: OptionProps) => menuHandle(item)}
      >
        <ListBox.Button className={({ open }) => cn(open && "bg-black")}>
          {selected.label}
        </ListBox.Button>
        <ListBox.Options>
          {list.map((elem) => (
            <ListBox.Option key={elem.id} value={elem}>
              {elem.label}
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
