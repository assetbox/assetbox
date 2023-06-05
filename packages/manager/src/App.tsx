import type { AssetBoxData } from "@assetbox/tools";
import { useEffect, useMemo } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
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
  const { isLoaded, categories } = useAssetBoxStore();

  useEffect(() => {
    useAssetBoxStore.setState({ ...data, isLoaded: true });
  }, [data]);

  const initRoute = useMemo(() => {
    const [category] = Object.keys(categories);
    return ["/", category].join("");
  }, [isLoaded, categories]);

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
          {isLoaded ? (
            <Route index element={<Navigate to={initRoute} replace />} />
          ) : null}
        </Routes>
      </Main>
      <ToastContainer />
    </Layout>
  );
};
