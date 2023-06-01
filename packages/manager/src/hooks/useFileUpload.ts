import { DropTargetMonitor, useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";

interface FileUploadOptions {
  onDrop: (files: File[]) => void;
}

export const useFileUpload = ({ onDrop }: FileUploadOptions) => {
  const [{ canDrop, isOver }, dragRef] = useDrop(
    () => ({
      accept: [NativeTypes.FILE],
      drop(item: { files: File[] }) {
        onDrop(item.files);
      },
      collect: (monitor: DropTargetMonitor) => {
        return {
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        };
      },
    }),
    []
  );
  const isDrag = canDrop && isOver;

  return {
    dragRef,
    isDrag,
  };
};
