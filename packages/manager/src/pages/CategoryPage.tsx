import { AssetStat } from "@assetbox/tools";
import type { RadioGroupProps } from "@radix-ui/react-radio-group";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { express } from "../api";
import EmptyIcon from "../assets/empty-icon.svg";
import SearchIcon from "../assets/search-icon.svg";
import { AssetItem, AssetView, FolderSelector, ListBox } from "../components";
import { AssetModal } from "../components/modal/AssetModal";
import { AddedFiles, DupeModal } from "../components/modal/DupeModal";
import { ButtonGroup } from "../components/ui/ButtonGroup";
import { Input } from "../components/ui/Input";
import { isBuild } from "../env";
import { useFileUpload, useModal } from "../hooks";
import { syncAssetBox, useAssetBoxStore } from "../store";
import { BlobData, cn, fileToBlob, makeFormData } from "../utils";

type AssetViewType = "Icons" | "Images" | "Animations";
type FilterOption = "All" | "Used" | "Not Used";

const filterOptions: FilterOption[] = ["All", "Used", "Not Used"];

const mapAssetType: Record<AssetViewType, AssetStat["type"]> = {
  Icons: "icon",
  Images: "image",
  Animations: "animation",
};

const useFilterAsset = ({
  currentCategory,
  filterOption,
  assetType,
  search,
}: {
  currentCategory?: string;
  filterOption: FilterOption;
  assetType: AssetViewType;
  search: string;
}) => {
  const { categories, usedFiles } = useAssetBoxStore();

  return useMemo(() => {
    if (!currentCategory || !categories[currentCategory]) return [];

    const sortedAssets = categories[currentCategory]
      .sort((a, b) => {
        if (
          usedFiles[a.filepath].length > 0 &&
          usedFiles[b.filepath].length === 0
        ) {
          return -1;
        } else if (
          usedFiles[a.filepath].length === 0 &&
          usedFiles[b.filepath].length > 0
        ) {
          return 1;
        } else {
          return a.filename.localeCompare(b.filename);
        }
      })
      .filter((asset) => asset.type === mapAssetType[assetType])
      .filter((asset) =>
        asset.filename.toLowerCase().includes(search.toLowerCase())
      );

    switch (filterOption) {
      case "Used": {
        return sortedAssets.filter(
          (asset) => usedFiles[asset.filepath]?.length > 0
        );
      }
      case "Not Used": {
        return sortedAssets.filter(
          (asset) => usedFiles[asset.filepath]?.length === 0
        );
      }
      default:
      case "All": {
        return sortedAssets;
      }
    }
  }, [categories, filterOption, assetType, currentCategory, search]);
};

export const CategoryPage = () => {
  const { category } = useParams();

  const [filterOption, setFilterOption] = useState<FilterOption>(
    filterOptions[0]
  );
  const [assetType, setAssetType] = useState<AssetViewType>("Icons");
  const [search, setSearch] = useState("");

  const { usedFiles, folderTree } = useAssetBoxStore();

  const blobRef = useRef<BlobData[]>([]);
  const savePathRef = useRef<string>("");

  const assets = useFilterAsset({
    currentCategory: category,
    filterOption,
    assetType,
    search,
  });

  const {
    data: modalAsset,
    open,
    openModal,
    closeModal,
  } = useModal<AssetStat>();

  const {
    data: uploadFiles,
    open: isOpenFolderSelector,
    openModal: openFolderSelector,
    closeModal: closeFolderSelector,
  } = useModal<File[]>();

  const {
    data: validatedFiles,
    open: isDupeFileSelector,
    openModal: openDupeFileSelector,
    closeModal: closeDupeFileSelector,
  } = useModal<AddedFiles[]>();

  const { isDrag, dragRef } = !isBuild
    ? useFileUpload({
        onDrop: (files) => {
          openFolderSelector(files);
        },
      })
    : {
        isDrag: false,
        dragRef: null,
      };

  const saveFiles = async (files: AddedFiles[]) => {
    try {
      if (files.length > 0) {
        await Promise.all(
          files.map(async (path) => {
            await toast.promise(
              async () => {
                const blobData = getBlobFromResponse(path.savePath);
                const formData = makeFormData({
                  savePath: savePathRef.current,
                  assets: blobData,
                });

                const saveResponse = await express.post("/upload", formData, {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                });

                if (saveResponse?.status !== 201) {
                  throw new Error("Failed to save");
                }
                return saveResponse;
              },
              {
                pending: `Saving ${path.savePath} in progress`,
                success: `${path.savePath} saved successfully`,
                error: `Failed to save ${path.savePath}`,
              }
            );
          })
        );
        syncAssetBox();
      }
      return true;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    const getBlobRef = async () => {
      const blobs = await Promise.all(
        uploadFiles?.map((file) => fileToBlob(file)) ?? []
      );
      blobRef.current = blobs;
    };

    getBlobRef();
  }, [uploadFiles]);

  const getBlobFromResponse = useCallback((filepath: string) => {
    return blobRef.current.find(
      (f) => filepath === [savePathRef.current, f.filename].join("/")
    );
  }, []);

  return (
    <div
      className={cn(
        "h-full p-14 transition-opacity duration-300",
        isDrag && "opacity-30"
      )}
      ref={dragRef}
    >
      <FolderSelector
        open={isOpenFolderSelector}
        onClose={closeFolderSelector}
        folderTree={folderTree}
        onSave={async (path) => {
          const formData = makeFormData({
            savePath: path,
            assets: blobRef.current,
          });

          savePathRef.current = path;

          const response = await express.post("/upload/validation", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          const notDupeFiles: AddedFiles[] = response.data.filter(
            (item: AddedFiles) => item.dupePaths.length === 0
          );

          saveFiles(notDupeFiles);

          const dupeFiles = response.data.filter(
            (item: AddedFiles) => item.dupePaths.length > 0
          );

          closeFolderSelector();

          if (dupeFiles.length > 0) {
            openDupeFileSelector(dupeFiles);
          }
        }}
      />
      <DupeModal
        data={validatedFiles ?? []}
        onClose={closeDupeFileSelector}
        open={isDupeFileSelector}
        handleSaveFile={saveFiles}
      />

      <div className="flex flex-wrap justify-between mb-8 gap-y-4 xxl:gap-0">
        <div
          className={cn("w-full", !isBuild ? "lg:w-[550px]" : "lg:w-[650px]")}
        >
          <Input
            noOutline
            className="w-full h-12 group"
            placeholder="Search for assets .."
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            startAdornment={
              <div className="flex items-center justify-center mr-[10px]">
                <SearchIcon className="w-5 h-5 group-focus-within:[&>path]:stroke-blue transition" />
              </div>
            }
          />
        </div>
        <div className="flex flex-wrap gap-x-5">
          <ButtonGroup
            value={assetType}
            onValueChange={setAssetType as RadioGroupProps["onValueChange"]}
          >
            <ButtonGroup.Button value="Icons" className="w-24 h-12">
              Icons
            </ButtonGroup.Button>
            <ButtonGroup.Button value="Images" className="w-24 h-12">
              Images
            </ButtonGroup.Button>
            {/* support soon */}
            {/* <ButtonGroup.Button value={"Animations"} className="w-24 h-12">
              Animations
            </ButtonGroup.Button> */}
          </ButtonGroup>
          {!isBuild ? (
            <>
              <ListBox value={filterOption} onChange={setFilterOption}>
                <ListBox.Button
                  className={({ open }) => cn(open && "bg-black")}
                >
                  {filterOption}
                </ListBox.Button>
                <ListBox.Options>
                  {filterOptions.map((filterOption) => (
                    <ListBox.Option
                      key={`option-${filterOption}`}
                      value={filterOption}
                    >
                      {filterOption}
                    </ListBox.Option>
                  ))}
                </ListBox.Options>
              </ListBox>
            </>
          ) : null}
        </div>
      </div>
      {assets?.length === 0 ? (
        <div className="h-3/4">
          <div className="flex flex-col items-center justify-center h-full gap-y-5">
            <EmptyIcon className="w-28 h-28" />
            <h1 className="text-3xl font-normal">All files are empty</h1>
          </div>
        </div>
      ) : (
        <AssetView type={mapAssetType[assetType]}>
          {assets?.map((asset: AssetStat) => (
            <AssetItem
              disabled={usedFiles[asset.filepath]?.length === 0}
              key={`asset-${asset.filepath}`}
              asset={asset}
              {...(!isBuild && { onClick: () => openModal(asset) })}
            />
          ))}
        </AssetView>
      )}
      <AssetModal data={modalAsset} onClose={closeModal} open={open} />
    </div>
  );
};
