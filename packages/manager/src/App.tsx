import { InlineSVG } from "./components/InlineSVG";

interface AppProps {
  data: { assetFiles: string[]; dupeFiles: string[] };
}

export function App({ data }: AppProps) {
  return (
    <div style={{ display: "flex" }}>
      <InlineSVG svgHtml='<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="50"/></svg>' />
      {data.assetFiles.map((v, idx) => (
        <img key={idx} src={v} style={{ width: "300px", height: "300px" }} />
      ))}
    </div>
  );
}
