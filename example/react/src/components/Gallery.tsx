import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

const images = Array(30)
  .fill(0)
  .map((_, idx) => `/images/${idx}.png`);

export const Gallery = () => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: 100,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 580,
  });

  return (
    <>
      <div
        ref={parentRef}
        style={{
          height: `580px`,
          overflow: "auto",
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => (
            <div
              key={virtualItem.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <img
                src={images[virtualItem.index % images.length]}
                style={{ width: "100%" }}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
