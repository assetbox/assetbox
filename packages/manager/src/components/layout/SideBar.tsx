import AlphabetA from "../../assets/alphabet-a.svg";
import DupeAssetsMenuIcon from "../../assets/dupe-assets-menu.svg";
import FolderIcon from "../../assets/folder.svg";
import Logo from "../../assets/logo.svg";
import { cn } from "../../utils";
import { ProgressBar } from "../ui";

const SectorLine = () => {
  return <div className="border border-[#F3F6FA]" />;
};

interface MenuItemProps extends React.PropsWithChildren {
  active?: boolean;
  icon: React.ReactElement;
}

const MenuItem = ({ active, icon, children }: MenuItemProps) => {
  return (
    <div
      className={cn(
        "group select-none cursor-pointer rounded flex items-center py-[14px] px-5 gap-[10px] hover:bg-[#ECF5FF]",
        active && "bg-[#ECF5FF]"
      )}
    >
      <div
        className={cn(
          "group-hover:[&_path]:fill-blue",
          active && "[&_path]:fill-blue"
        )}
      >
        {icon}
      </div>
      <p
        className={cn(
          "font-bold group-hover:text-blue",
          active ? "text-blue" : "text-gray"
        )}
      >
        {children}
      </p>
    </div>
  );
};

export const SideBar = () => {
  return (
    <div className="h-full px-8 pt-12 bg-white w-80">
      <Logo className="ml-[10px] mb-8" />
      <ProgressBar rate={90} format="coverage {rate}%" className="mb-10" />

      <div className="flex items-center gap-2 mb-4">
        <AlphabetA className="ml-[10px]" />
        <p className="text-base font-bold text-gray-dark">AssetBox</p>
      </div>
      <SectorLine />

      <MenuItem active icon={<FolderIcon />}>
        Icons
      </MenuItem>
      <SectorLine />
      <MenuItem icon={<FolderIcon />}>Images</MenuItem>
      <SectorLine />

      <MenuItem icon={<DupeAssetsMenuIcon />}>Duplicated Assets</MenuItem>
      <SectorLine />
    </div>
  );
};
