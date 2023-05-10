import { InlineSVG } from "./components/ui";

export interface AssetBoxData {
  assetFiles: {
    filename: string;
    data: string;
    timestamp: number;
    type: string;
    extension: string;
    size: number;
  }[];
  dupeFiles: string[][];
}

// TODO: not yet scheme
interface AppProps {
  data: AssetBoxData;
}

export const App = ({ data }: AppProps) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {data.assetFiles
        .filter((assetFile) => assetFile.extension === "svg")
        .map((v, idx) => (
          <InlineSVG key={`svg-${idx}`} svgHtml={v.data} />
        ))}

      {data.assetFiles
        .filter((assetFile) => assetFile.extension !== "svg")
        .map((v, idx) => (
          <img
            key={`img-${idx}`}
            src={v.filename}
            style={{ width: "300px", height: "300px" }}
          />
        ))}
    </div>
  );
};
