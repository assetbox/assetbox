interface AppProps {
  data: { assetFiles: string[]; dupeFiles: string[] };
}

export function App({ data }: AppProps) {
  return (
    <div style={{ display: "flex" }}>
      {data.assetFiles.map((v, idx) => (
        <img key={idx} src={v} style={{ width: "300px", height: "300px" }} />
      ))}
    </div>
  );
}
