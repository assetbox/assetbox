import { Transition } from "@headlessui/react";
import { createContext, useContext, useState } from "react";

import DownVector from "../assets/down-vector.svg";
import FolderIcon from "../assets/folder.svg";
import { cn, noop } from "../utils";
import { Button, Modal } from "./ui";

type FolderTree = {
  [path: string]: FolderTree;
};

type FolderProps = {
  label: string;
  path: string;
  children?: React.ReactNode | React.ReactNode[];
};

type FolderContextProps = {
  path: string;
  onPathChange: (path: string) => void;
};

type FolderSelectorProps = {
  open: boolean;
  onClose: () => void;
  onSave: (path: string) => void;
  folderTree: FolderTree;
};

const FolderContext = createContext<FolderContextProps>({
  path: "",
  onPathChange: noop,
});

const Folder = ({ label, path, children }: FolderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { path: selectedPath, onPathChange } = useContext(FolderContext);

  const isActive = path === selectedPath;

  return (
    <>
      <div
        id="folder-selector"
        onClick={() => {
          setIsOpen(!isOpen);
          onPathChange(path);
        }}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded cursor-pointer select-none",
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
            "font-bold group-hover:text-blue flex items-center justify-between w-full",
            !isActive ? "text-gray" : "text-blue"
          )}
        >
          {label}

          {children ? (
            <DownVector className={cn("transition", isOpen && "rotate-180")} />
          ) : null}
        </p>
      </div>
      <Transition
        show={isOpen}
        as="div"
        className="overflow-hidden pl-7"
        enter="transition transition-[max-height] duration-400 ease-in"
        enterFrom="transform max-h-0"
        enterTo="transform max-h-screen"
        leave="transition transition-[max-height] duration-400 ease-out"
        leaveFrom="transform max-h-screen"
        leaveTo="transform max-h-0"
      >
        {children}
      </Transition>
    </>
  );
};

const FolderProvider = ({
  onPathChange,
  path,
  children,
}: React.PropsWithChildren<FolderContextProps>) => {
  return (
    <FolderContext.Provider value={{ onPathChange, path }}>
      {children}
    </FolderContext.Provider>
  );
};

const generateTree = (data: FolderTree, path = "") => {
  return Object.keys(data).map((key) => {
    const currentPath = path ? `${path}/${key}` : key;
    const value = data[key];
    if (typeof value === "object" && Object.keys(value).length > 0) {
      return (
        <Folder key={currentPath} label={key} path={currentPath}>
          {generateTree(value, currentPath)}
        </Folder>
      );
    } else {
      return <Folder key={currentPath} label={key} path={currentPath} />;
    }
  });
};

export const FolderSelector = ({
  open,
  folderTree,
  onClose,
  onSave,
}: FolderSelectorProps) => {
  const [selectedPath, setSelectedPath] = useState("src");

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Panel className="w-3/5 p-7">
        <Modal.Title className="mb-3">Folder Selector</Modal.Title>

        <div className="mb-3 overflow-auto max-h-72 h-72">
          <FolderProvider path={selectedPath} onPathChange={setSelectedPath}>
            {generateTree(folderTree)}
          </FolderProvider>
        </div>

        <div className="flex items-center gap-3 px-3 py-3 mb-4 rounded bg-gray-light">
          <p className="text-sm font-bold text-gray">Selected Path</p>
          <p className="text-sm">{selectedPath}</p>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="primary" onClick={() => onSave(selectedPath)}>
            Save
          </Button>
          <Button variant="danger" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </Modal.Panel>
    </Modal>
  );
};
