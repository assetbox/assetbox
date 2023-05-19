import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";

import FolderIcon from "../../assets/folder.svg";
import HamburgerIcon from "../../assets/hamburger.svg";
import Logo from "../../assets/logo.svg";
import { cn } from "../../utils";
import { ProgressBar } from "../ui";

interface SideBarProps {
  categories: { label: React.ReactNode; path: string }[];
  menus: {
    icon: React.ReactElement;
    label: React.ReactNode;
    path: string;
  }[];
}

interface MenuItemProps extends React.PropsWithChildren {
  to: string;
  active?: boolean;
  icon: React.ReactElement;
  className?: string;
}

interface CoverageBarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  count: number;
  totalCount: number;
}

const SectorLine = () => {
  return <div className="border border-[#F3F6FA]" />;
};

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

const CoverageBar = ({
  count,
  totalCount,
  name,
  className,
}: CoverageBarProps) => {
  const coverage = Math.round((count / totalCount) * 100);

  return (
    <ProgressBar rate={coverage} className={className}>
      <div className="flex justify-between">
        <p className="text-xs">{name}</p>
        <p className="text-xs">{coverage}%</p>
      </div>
    </ProgressBar>
  );
};

export const SideBar = ({ categories, menus }: SideBarProps) => {
  const { pathname } = useLocation();

  return (
    <div className="h-full px-8 pt-12 bg-white w-80">
      <Logo className="ml-[10px] mb-8" />
      <CoverageBar
        className="mb-2"
        name="Unique Coverage"
        count={48}
        totalCount={100}
      />

      <CoverageBar
        className="mb-10"
        name="Used Coverage"
        count={90}
        totalCount={100}
      />

      <div className="flex items-center gap-2 mb-4">
        <HamburgerIcon className="ml-[10px]" />
        <p className="text-base font-bold text-gray-dark">Category</p>
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
