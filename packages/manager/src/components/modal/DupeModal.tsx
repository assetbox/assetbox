import { useState } from "react";

import CodeIcon from "../../assets/code.svg";
import InformationIcon from "../../assets/information.svg";
import { Alert, Button, Modal } from "../ui";
import { InfoItem } from "../ui/InfoItem";
import { PathCard } from "../ui/PathCard";

export type AddedFiles = {
  savePath: string;
  dupePaths: string[];
  base64Image: string;
};

type DupeModalProps = {
  data: AddedFiles[];
  open: boolean;
  onClose: () => void;
  handleSaveFile: (files: AddedFiles[]) => Promise<boolean> | boolean;
};

const ImageComponent = ({
  savePath,
  base64Image,
  ...props
}: {
  savePath: string;
  base64Image: string;
} & React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img src={base64Image} alt={savePath} {...props} />
);

export const DupeModal = ({
  data,
  open,
  onClose,
  handleSaveFile,
}: DupeModalProps) => {
  const [idx, setIdx] = useState(0);
  const [isAdded, setIsAdded] = useState<boolean[]>(() =>
    Array(data.length)
      .fill(0)
      .map(() => false)
  );

  const handleNext = () => {
    if (idx < data.length - 1) {
      setIdx(idx + 1);
    } else if (idx === data.length - 1) {
      onClose();
      setIsAdded((prev) => prev.map(() => false));
      setIdx(0);
    }
  };

  const handlePrev = () => {
    if (idx > 0) {
      setIdx(idx - 1);
    }
  };

  const handleAdd = async (files: AddedFiles[]) => {
    const response = await handleSaveFile(files);

    if (response === true) {
      setIsAdded((prev) => {
        const updated = [...prev];
        updated[idx] = true;
        return updated;
      });
    }
  };

  return (
    data[idx] && (
      <Modal open={open} onClose={() => null}>
        <Modal.Panel className={"max-w-6xl p-8"}>
          <div>
            <div className="flex gap-6 mb-9">
              <div className="flex flex-col justify-between">
                <div className="flex items-center justify-center flex-1 mb-2 h-[300px] w-[300px]">
                  <ImageComponent
                    className="object-fill w-full h-full rounded"
                    key={idx}
                    savePath={data[idx].savePath}
                    base64Image={data[idx].base64Image}
                  />
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
                    <InfoItem label="File Path">{data[idx].savePath}</InfoItem>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <CodeIcon />
                    <p className="text-sm font-bold">Dupe File Paths</p>
                  </div>
                  <PathCard paths={data[idx].dupePaths} className="h-48" />
                </div>
              </div>
            </div>
          </div>
          <div className="relative flex items-center justify-center w-full gap-x-5">
            {idx > 0 && (
              <Button
                variant="primary"
                className="absolute left-0 cursor-pointer"
                onClick={handlePrev}
              >
                Prev
              </Button>
            )}

            <p>{`${idx + 1} / ${data.length}`}</p>

            <div className="absolute right-0 flex gap-2">
              {isAdded[idx] ? (
                <Button variant="gray" className="cursor-not-allowed">
                  Added
                </Button>
              ) : (
                <Button
                  variant="danger"
                  onClick={() => handleAdd(Array(data[idx]))}
                >
                  Add
                </Button>
              )}
              <Button
                variant="primary"
                className="cursor-pointer"
                onClick={handleNext}
              >
                Skip
              </Button>
            </div>
          </div>
        </Modal.Panel>
      </Modal>
    )
  );
};
