import { useMemo } from "react";
import { useParams } from "react-router-dom";

import { AssetIcon, AssetImage, AssetView } from "../components";
import { useAssetBoxStore } from "../store";

export const CategoryPage = () => {
  const { category } = useParams();

  const { categories } = useAssetBoxStore();

  if (!category) {
    return <div>Category not found</div>;
  }
  const assets = categories[category] ?? [];

  return (
    <div className="p-14">
      {/* TODO: AssetView type value => ButtonGroup state */}
      <AssetView type={category === "Icons" ? "icon" : "image"}>
        {useMemo(() => {
          return assets.map((asset) => {
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
