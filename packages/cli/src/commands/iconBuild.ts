import { readAssetBoxConfig } from "@assetbox/tools";

export const iconBuild = async () => {
  const { iconBuild = {}, ...context } = await readAssetBoxConfig();

  iconBuild.plugins = iconBuild.plugins ?? [];

  for (const plugin of iconBuild.plugins) {
    await plugin.build({
      iconBuild,
      ...context,
    });
  }
};
