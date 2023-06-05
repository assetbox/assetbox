import { readAssetBoxConfig } from "@assetbox/tools";
import pc from "picocolors";

export const iconBuild = async () => {
  const { iconBuild, ...context } = await readAssetBoxConfig();

  const plugins = iconBuild?.plugins ?? [];

  for (const plugin of plugins) {
    await plugin.build({
      iconBuild,
      ...context,
    });
  }

  console.log();
  console.log(pc.green("Icon Build complete."));
};
