import { AssetStat } from "@assetbox/tools";
import dayjs from "dayjs";
import { useState } from "react";
import { toast } from "react-toastify";

import { client } from "../../api";
import CodeIcon from "../../assets/code.svg";
import InformationIcon from "../../assets/information.svg";
import { useModal } from "../../hooks";
import { syncAssetBox, useAssetBoxStore } from "../../store";
import { Button, InlineSVG, Modal, type ModalProps } from ".././ui";
import { ConfirmModal, type ConfirmModalProps } from ".././ui/ConfirmModal";
import { ExtractImportCard } from ".././ui/ExtractImportCard";
import { Input } from ".././ui/Input";

const InfoItem = ({
  label,
  children,
}: React.PropsWithChildren<Record<"label", string>>) => (
  <div className="flex mb-2">
    <p className="text-sm font-bold text-gray w-28">{label}</p>
    <p className="text-sm font-bold">{children}</p>
  </div>
);

const RenameModal = ({
  onCancel,
  open,
  filename,
  filepath,
}: ConfirmModalProps & Record<"filename" | "filepath", string>) => {
  const [newFilename, setNewFilename] = useState(filename);

  return (
    <ConfirmModal
      onCancel={onCancel}
      onConfirm={() => {
        toast
          .promise(
            client.renameAsset.mutate({
              oldPath: filepath,
              newPath: [...filepath.split("/").slice(0, -1), newFilename].join(
                "/"
              ),
            }),
            {
              pending: "Renaming...",
              success: "Renamed!",
              error: "Failed to rename",
            }
          )
          .then(syncAssetBox)
          .then(onCancel);
      }}
      cancelVariant="gray"
      open={open}
    >
      <p className="mb-2 text-sm">Please enter a file name to replace</p>
      <Input
        value={newFilename}
        onChange={(e) => setNewFilename(e.target.value)}
        className="w-full mb-4"
      />

      <div className="flex flex-col justify-center h-32 px-3 rounded bg-gray-light">
        <div className="mb-2">
          <p className="mb-1 text-sm text-gray">Current File Name</p>
          <p className="text-sm">{filename}</p>
        </div>
        <div>
          <p className="mb-1 text-sm text-gray">New File Name</p>
          <p className="text-sm">{newFilename}</p>
        </div>
      </div>
    </ConfirmModal>
  );
};

const DeleteModal = ({
  onCancel,
  open,
  filepath,
}: ConfirmModalProps & Record<"filepath", string>) => {
  return (
    <ConfirmModal
      onCancel={onCancel}
      confirmText="Delete"
      confirmVariant="danger"
      cancelText="Cancel"
      cancelVariant="gray"
      onConfirm={() => {
        toast
          .promise(client.deleteAsset.mutate(filepath), {
            pending: "Deleting...",
            success: "Deleted!",
            error: "Failed to delete",
          })
          .then(syncAssetBox)
          .then(onCancel);
      }}
      open={open}
    >
      <p className="mb-2 text-sm">Are you sure you want to delete it?</p>
      <p className="p-2 text-sm rounded bg-gray-light">{filepath}</p>
    </ConfirmModal>
  );
};

export const AssetModal = ({
  open,
  data,
  onClose,
}: ModalProps & {
  data?: AssetStat;
}) => {
  const { usedFiles } = useAssetBoxStore();

  const {
    open: renameOpen,
    openModal: openRenameModal,
    closeModal: closeRenameModal,
  } = useModal();

  const {
    open: deleteOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Panel className={"max-w-6xl p-7"}>
        {data ? (
          <div>
            <div className="flex gap-6 mb-9">
              <div className="flex items-center justify-center flex-1 w-96">
                {data.type === "icon" ? (
                  <InlineSVG
                    svgHtml={data.data}
                    className="max-h-[250px] h-full"
                  />
                ) : null}
                {data.type === "image" ? (
                  <img
                    src={data.filepath}
                    className="object-contain w-full h-full rounded"
                  />
                ) : null}
              </div>
              <div className="flex-1 w-96">
                <div className="mb-7">
                  <div className="flex items-center gap-2 mb-2">
                    <CodeIcon />
                    <p className="text-sm font-bold">Used Code Path</p>
                  </div>
                  <ExtractImportCard
                    data={usedFiles[data.filepath] ?? []}
                    fallback="There are no codes of concern."
                    className="h-48"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <InformationIcon />
                    <p className="text-sm font-bold">Information</p>
                  </div>

                  <div className="px-5 py-6 rounded bg-gray-light">
                    <InfoItem label="File Name">{data.filename}</InfoItem>
                    <InfoItem label="Used Count">
                      {usedFiles[data.filepath]?.length}
                    </InfoItem>
                    <InfoItem label="Icon Type">{data.type}</InfoItem>
                    <InfoItem label="Extension">{data.extension}</InfoItem>
                    <InfoItem label="Created Time">
                      {dayjs(data.timestamp).format("YYYY/MM/DD HH:mm:ss")}
                    </InfoItem>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="primary" onClick={openRenameModal}>
                Rename
              </Button>
              <Button variant="danger" onClick={openDeleteModal}>
                Delete
              </Button>
            </div>

            <RenameModal
              open={renameOpen}
              onCancel={() => {
                closeRenameModal();
                onClose(false);
              }}
              filepath={data.filepath}
              filename={data.filename}
            />
            <DeleteModal
              open={deleteOpen}
              onCancel={() => {
                closeDeleteModal();
                onClose(false);
              }}
              filepath={data.filepath}
            />
          </div>
        ) : null}
      </Modal.Panel>
    </Modal>
  );
};
