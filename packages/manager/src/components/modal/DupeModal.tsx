import Close from "../../assets/close.svg";
import CodeIcon from "../../assets/code.svg";
import InformationIcon from "../../assets/information.svg";
import LeftArrow from "../../assets/left-pointing-arrow.svg";
import RightArrow from "../../assets/right-pointing-arrow.svg";
import { Alert, Button, InlineSVG, Modal } from "../ui";
import { InfoItem } from "../ui/InfoItem";
import { PathCard } from "../ui/PathCard";
export const DupeModal = ({ open, data, onClose }: any) => {
  //temp

  console.log("data", data);
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Panel className={"max-w-6xl p-7"}>
        <span className="float-right cursor-pointer" onClick={onClose}>
          <Close />
        </span>
        {data ? (
          <div>
            <div className="flex gap-6 mb-9">
              <div className="flex flex-col justify-between">
                <div className="flex items-center justify-center flex-1 mb-2 max-h-[250px]">
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
                <Alert variant="danger">This file is a duplicate file.</Alert>
              </div>
              <div className="w-96">
                <div className="mb-7">
                  <div className="flex items-center gap-2 mb-2">
                    <InformationIcon />
                    <p className="text-sm font-bold">Information</p>
                  </div>
                  <div className="bg-[#F7F9FB] rounded px-5 py-2">
                    <InfoItem label="File Path">{data.filepath}</InfoItem>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <CodeIcon />
                    <p className="text-sm font-bold">Dupe File Paths</p>
                  </div>
                  <PathCard paths={["test"]} className="h-48" />
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <div className="relative flex items-center justify-center w-full gap-x-5">
          <LeftArrow className="cursor-pointer" />
          <p>2 / 4</p>
          <RightArrow className="cursor-pointer" />
          <div className="absolute right-0">
            <Button variant="danger">Add</Button>
          </div>
        </div>
      </Modal.Panel>
    </Modal>
  );
};
