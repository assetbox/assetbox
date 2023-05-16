import { AssetImageStat } from "../../types";
import { Box } from "../ui";

interface AssetImageProps {
  asset: AssetImageStat;
}

export const AssetImage = ({ asset }: AssetImageProps) => {
  const [filename] = asset.filename.split(".");

  return (
    <div className="group">
      <Box
        className="flex items-center justify-center transition-shadow cursor-pointer h-80 group-hover:shadow-hover"
        key={`icon-${asset.filename}`}
      >
        <img
          src={asset.filepath}
          className="flex object-cover w-full h-full rounded-lg"
        />
      </Box>
      <p className="pt-3 text-sm text-center cursor-pointer text-gray-dark group-hover:text-blue">
        {filename}
      </p>
    </div>
  );
};
