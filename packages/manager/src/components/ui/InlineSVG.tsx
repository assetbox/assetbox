import DOMPurify from "isomorphic-dompurify";

import { cn } from "../../utils";

interface InlineSVGProps extends React.HTMLAttributes<HTMLDivElement> {
  svgHtml: string;
}

export const InlineSVG = ({ svgHtml, className, ...props }: InlineSVGProps) => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(svgHtml),
      }}
      className={cn("flex", className)}
      {...props}
    />
  );
};
