import { AssetStat } from "@assetbox/tools";
import { useState } from "react";
import { toast } from "react-toastify";

import { client } from "../../api";
import { useModal } from "../../hooks";
import { syncAssetBox, useAssetBoxStore } from "../../store";
import { cn } from "../../utils";
import { Asset } from "../asset";
import { Alert } from "./Alert";
import { Button } from "./Button";
import { CheckBox } from "./CheckBox";
import { ExtractImportCard } from "./ExtractImportCard";
import { Modal, type ModalProps } from "./Modal";
import { PathCard } from "./PathCard";

interface DupeCardProps {
  asset: AssetStat;
  paths: string[];
}

const MultipleDeleteModal = ({
  open,
  onClose,
  paths,
}: ModalProps & {
  paths: string[];
  asset: AssetStat;
}) => {
  const { usedFiles } = useAssetBoxStore();

  const [selectedPaths, setSelectedPaths] = useState<string[]>([]);

  const concernsPaths = [
    ...new Set(selectedPaths.map((path) => usedFiles[path]).flat()),
  ];

  const alertProps = {
    info: {
      variant: "info",
      children: "These file are not in use.",
    },
    danger: {
      variant: "danger",
      children: "These file are in use. Would you still like to change it?",
    },
  } as const;

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Panel className="p-7 min-w-[410px]">
        <div className="mb-5">
          <p className="mb-3 text-base font-bold">Select Paths</p>
          <div className="flex flex-col gap-2">
            {paths.map((path) => (
              <CheckBox
                key={`dupe-${path}`}
                label={path}
                checked={selectedPaths.includes(path)}
                onCheckedChange={() => {
                  if (selectedPaths.includes(path)) {
                    setSelectedPaths(
                      selectedPaths.filter(
                        (selectedPath) => selectedPath !== path
                      )
                    );
                  } else {
                    setSelectedPaths([...selectedPaths, path]);
                  }
                }}
              />
            ))}
          </div>
        </div>

        <div className="mb-5">
          <p className="mb-3 text-base font-bold">Concerns Paths</p>
          <ExtractImportCard
            data={concernsPaths}
            fallback="There are no codes of concern."
            className="h-40 mb-4"
          />
          <Alert
            {...alertProps[concernsPaths.length === 0 ? "info" : "danger"]}
          />
        </div>
        <div className="flex justify-end">
          <Button
            variant="danger"
            className={cn(
              "w-40",
              selectedPaths.length === 0 && "opacity-50 pointer-events-none"
            )}
            onClick={() => {
              toast
                .promise(
                  Promise.all(
                    selectedPaths.map((path) => client.deleteAsset.mutate(path))
                  ),
                  {
                    pending: "Deleting...",
                    success: "Deleted!",
                    error: "Failed to delete",
                  }
                )
                .then(() => {
                  onClose();
                  syncAssetBox();
                });
            }}
          >
            {selectedPaths.length} Files Delete
          </Button>
        </div>
      </Modal.Panel>
    </Modal>
  );
};

export const DupeCard = ({ asset, paths }: DupeCardProps) => {
  const { closeModal, open, openModal } = useModal();

  return (
    <div>
      <div className="flex max-w-[728px] min-h-[198px] bg-gray rounded-xl bg-opacity-10 py-8 px-10 gap-6">
        <div
          className={cn(
            "flex flex-col gap-3",
            asset.type !== "icon" && "flex-1"
          )}
        >
          <Asset asset={asset} />
          <Button onClick={openModal} className="w-full">
            Manage
          </Button>
        </div>
        <PathCard
          paths={paths}
          className={cn(asset.type === "image" && "flex-1")}
        />
      </div>
      <MultipleDeleteModal
        onClose={closeModal}
        open={open}
        paths={paths}
        asset={asset}
      />
    </div>
  );
};
