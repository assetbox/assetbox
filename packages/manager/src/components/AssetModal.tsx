import { AssetStat } from "@assetbox/tools";
import dayjs from "dayjs";

import CodeIcon from "../assets/code.svg";
import InformationIcon from "../assets/information.svg";
import { ModalProps } from "../hooks";
import { useAssetBoxStore } from "../store";
import { Button, InlineSVG, Modal } from "./ui";
import { PathCard } from "./ui/PathCard";

const InfoItem = ({
  label,
  children,
}: React.PropsWithChildren<Record<"label", string>>) => (
  <div className="flex mb-2">
    <p className="text-sm font-bold text-gray w-28">{label}</p>
    <p className="text-sm font-bold">{children}</p>
  </div>
);

export const AssetModal = ({
  open,
  closeModal,
  data,
}: Omit<ModalProps<AssetStat>, "openModal">) => {
  const { usedFiles } = useAssetBoxStore();

  return (
    <Modal open={open} onClose={closeModal}>
      <Modal.Panel className={"max-w-6xl p-7"}>
        {data ? (
          <div>
            <div className="flex gap-6 mb-9">
              <div className="flex items-center justify-center flex-1">
                {data.type === "icon" ? (
                  <InlineSVG svgHtml={data.data} className="w-2/3 h-2/3" />
                ) : null}
                {data.type === "image" ? (
                  <img
                    src={data.filepath}
                    className="object-cover w-full h-full rounded"
                  />
                ) : null}
              </div>
              <div className="w-96">
                <div className="mb-7">
                  <div className="flex items-center gap-2 mb-2">
                    <CodeIcon />
                    <p className="text-sm font-bold">Used Code Path</p>
                  </div>
                  <PathCard
                    paths={
                      usedFiles[data.filepath].length > 0
                        ? usedFiles[data.filepath]
                        : ["No files found in use."]
                    }
                    className="h-48"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <InformationIcon />
                    <p className="text-sm font-bold">Information</p>
                  </div>

                  <div className="bg-[#F7F9FB] rounded px-5 py-6">
                    <InfoItem label="File Name">{data.filename}</InfoItem>
                    <InfoItem label="Used Count">
                      {usedFiles[data.filepath].length}
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
              <Button variant={"primary"}>Rename</Button>
              <Button variant={"danger"}>Delete</Button>
            </div>
          </div>
        ) : null}
      </Modal.Panel>
    </Modal>
  );
};
