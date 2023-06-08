import { readAssetBoxConfig } from "@assetbox/tools";
import pc from "picocolors";

export const iconBuild = async () => {
  const { iconBuild = {}, ...context } = await readAssetBoxConfig();

  iconBuild.outDir = iconBuild.outDir ?? "dist";
  iconBuild.plugins = iconBuild.plugins ?? [];

  for (const plugin of iconBuild.plugins) {
    await plugin.build({
      iconBuild,
      ...context,
    });
  }

  console.log();
  console.log(pc.green("Icon Build complete."));
};
