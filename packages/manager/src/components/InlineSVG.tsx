import DOMPurify from "isomorphic-dompurify";

interface InlineSVGProps {
  svgHtml: string;
}

export const InlineSVG = ({ svgHtml }: InlineSVGProps) => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(svgHtml),
      }}
      style={{ width: "300px", height: "300px", display: "flex" }}
    ></div>
  );
};
