import React from "react";

import { cn } from "../../utils";
import { Button } from "./Button";

interface CardProps {
  children: React.ReactNode;
  type: "icon" | "image";
  path: string[];
}

export const DupeCard = ({ children, type, path }: CardProps) => {
  return (
    <div className="flex max-w-[728px] min-h-[198px] bg-gray rounded-xl bg-opacity-10 py-8 px-10">
      <div
        className={cn("flex-col space-y-4 mr-6", type === "image" && "flex-1")}
      >
        {children}
        <Button className="w-full">Merge</Button>
      </div>
      <div
        className={cn(
          "grow bg-white rounded-lg p-6 overflow-y-scroll",
          type === "image" && "flex-1"
        )}
      >
        {path.map((path, index) => (
          <div className="flex justify-between">
            <div className="text-gray-dark">
              <span className="text-black text-opacity-20 mr-6">
                {index + 1}
              </span>
              {path}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
