import { Route, Routes } from "react-router-dom";

import DupeAssetsMenuIcon from "./assets/dupe-assets-menu.svg";
import { Layout, SideBar } from "./components";
import { Main } from "./components/layout/Main";
import { CategoryPage, DupePage } from "./pages";
import { AssetBoxData } from "./types";

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
          path: ["/", category].join(""),
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
