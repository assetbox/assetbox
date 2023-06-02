import FolderIcon from "../assets/folder.svg";
import { cn } from "../utils";
import { Modal } from "./ui";

type FolderSelectorProps = {
  open: boolean;
  onClose: () => void;
};

type FolderProps = {
  path: string;
  isActive?: boolean;
  children?: React.ReactNode | React.ReactNode[];
};

const Folder = ({ path, isActive, children }: FolderProps) => {
  return (
    <>
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded cursor-pointer select-none border-b-2 border-b-gray-light",
          "hover:bg-blue-light group",
          isActive && "bg-blue-light"
        )}
      >
        <FolderIcon
          className={cn(
            "group-hover:[&_path]:fill-blue",
            isActive && "[&_path]:fill-blue"
          )}
        />
        <p
          className={cn(
            "font-bold group-hover:text-blue",
            !isActive ? "text-gray" : "text-blue"
          )}
        >
          {path}
        </p>
      </div>
      <div className="pl-7">{children}</div>
    </>
  );
};

export const FolderSelector = ({ open, onClose }: FolderSelectorProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Panel className="w-3/5 p-7">
        <Modal.Title className="mb-3">Folder Selector</Modal.Title>

        <Folder path="src" isActive>
          <Folder path="Icons" />
          <Folder path="Icons" />
          <Folder path="Icons">
            <Folder path="Icons" />
          </Folder>
          <Folder path="Icons" />
        </Folder>
        <Folder path="Icons" />
        {/* <div
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
        </div> */}
      </Modal.Panel>
    </Modal>
  );
};
