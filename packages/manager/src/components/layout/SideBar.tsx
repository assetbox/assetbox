import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";

import AlphabetA from "../../assets/alphabet-a.svg";
import FolderIcon from "../../assets/folder.svg";
import Logo from "../../assets/logo.svg";
import { cn } from "../../utils";
import { ProgressBar } from "../ui";

const SectorLine = () => {
  return <div className="border border-[#F3F6FA]" />;
};

interface MenuItemProps extends React.PropsWithChildren {
  to: string;
  active?: boolean;
  icon: React.ReactElement;
  className?: string;
}

const MenuItem = ({ to, active, icon, children, className }: MenuItemProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "group select-none cursor-pointer rounded flex items-center py-[14px] px-5 gap-[10px] hover:bg-[#ECF5FF]",
        className,
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
    </Link>
  );
};

interface SideBarProps {
  categories: { label: React.ReactNode; path: string }[];
  menus: {
    icon: React.ReactElement;
    label: React.ReactNode;
    path: string;
  }[];
}

export const SideBar = ({ categories, menus }: SideBarProps) => {
  const { pathname } = useLocation();

  return (
    <div className="h-full px-8 pt-12 bg-white w-80">
      <Logo className="ml-[10px] mb-8" />
      <ProgressBar rate={90} format="coverage {rate}%" className="mb-10" />

      <div className="flex items-center gap-2 mb-4">
        <AlphabetA className="ml-[10px]" />
        <p className="text-base font-bold text-gray-dark">AssetBox</p>
      </div>
      <SectorLine />

      {categories.map(({ label, path }) => (
        <Fragment key={`category-${label}`}>
          <MenuItem to={path} active={pathname === path} icon={<FolderIcon />}>
            {label}
          </MenuItem>
          <SectorLine />
        </Fragment>
      ))}

      {menus.map(({ icon, label, path }) => (
        <Fragment key={`menu-${label}`}>
          <MenuItem
            to={path}
            active={pathname === path}
            className="px-[10px]"
            icon={icon}
          >
            {label}
          </MenuItem>
          <SectorLine />
        </Fragment>
      ))}
    </div>
  );
};
