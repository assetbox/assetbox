import { Route, Routes, useParams } from "react-router-dom";

import DupeAssetsMenuIcon from "./assets/dupe-assets-menu.svg";
import { Layout, SideBar } from "./components";
import { Main } from "./components/layout/Main";
import { CategoryPage, DupePage } from "./pages";

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

const menus = [
  {
    icon: <DupeAssetsMenuIcon />,
    label: "Duplicated Assets",
    path: "/dupe",
  },
];

export const App = ({ data }: AppProps) => {
  return (
    <Layout>
      <SideBar
        categories={Object.keys(data.categories).map((category) => ({
          label: category,
          path: ["/", category.toLocaleLowerCase()].join(""),
        }))}
        menus={menus}
      />
      <Main>
        <Routes>
          <Route path="/:category" element={<CategoryPage />} />
          <Route path="/dupe" element={<DupePage />} />
        </Routes>
      </Main>
    </Layout>
  );
};
