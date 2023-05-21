import type { AssetBoxData } from "@assetbox/tools";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import DupeAssetsMenuIcon from "./assets/dupe-assets-menu.svg";
import { Layout, SideBar } from "./components";
import { Main } from "./components/layout/Main";
import { CategoryPage, DupePage } from "./pages";
import { useAssetBoxStore } from "./store";

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
  useEffect(() => {
    useAssetBoxStore.setState({ ...data, isLoaded: true });
  }, [data]);

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
      <ToastContainer />
    </Layout>
  );
};
