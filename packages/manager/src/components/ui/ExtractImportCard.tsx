import { ExtractImport } from "@assetbox/tools";
import * as Popover from "@radix-ui/react-popover";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism";

import { cn } from "../../utils";

interface ExtractImportCardProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ExtractImport[];
  fallback?: string;
}

const ExtractImportItem = ({
  index,
  data,
}: {
  index: number;
  data: ExtractImport;
}) => {
  const [open, setOpen] = useState(false);
  const code = data.codeDatas.map(({ code }) => code).join("\n");

  return (
    <div className="flex flex-nowrap">
      <p className="text-sm w-6 min-w-[24px] text-gray-dark text-opacity-20">
        {index}
      </p>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger
          className="outline-none"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <p className="text-sm underline">{data.path}</p>
        </Popover.Trigger>
        <Popover.Content
          side="right"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className="z-10 mx-4 rounded-lg shadow-lg"
        >
          <SyntaxHighlighter
            showLineNumbers
            startingLineNumber={data.codeDatas[0].line + 1}
            style={tomorrow}
            wrapLines
            lineProps={(lineNumber) => {
              const style: React.CSSProperties = {
                backgroundColor: "rgb(94 255 94 / 20%)",
              };

              return data.codeDatas.some(
                (code) => code.line === lineNumber - 1 && code.isReal
              )
                ? { style }
                : {};
            }}
            customStyle={{ borderRadius: "8px", fontSize: "12px" }}
            language="typescript"
          >
            {code}
          </SyntaxHighlighter>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
};

export const ExtractImportCard = ({
  data,
  fallback,
  className,
  ...props
}: ExtractImportCardProps) => {
  return (
    <div
      className={cn(
        "grow bg-[#F7F9Fb] rounded-lg p-6 overflow-auto",
        className
      )}
      {...props}
    >
      {fallback && data.length === 0 ? (
        <div className="flex flex-nowrap">
          <p className="text-sm text-gray-dark">{fallback}</p>
        </div>
      ) : (
        data.map((data, index) => (
          <ExtractImportItem
            index={index + 1}
            data={data}
            key={`path-${data.path}`}
          />
        ))
      )}
    </div>
  );
};
