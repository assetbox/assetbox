import { InlineSVG, Layout, SideBar } from "./components";
import { Main } from "./components/layout/Main";

export interface AssetBoxData {
  categories: Record<
    string,
    {
      filename: string;
      timestamp: number;
      type: string;
      data: string | null;
      extension: string;
      size: number;
    }[]
  >;
  dupeFiles: string[][];
}

// TODO: not yet scheme
interface AppProps {
  data: AssetBoxData;
}

export const App = ({ data }: AppProps) => {
  return (
    <Layout>
      <SideBar />
      <Main></Main>
    </Layout>
  );
};
