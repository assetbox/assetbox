import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import clsx from "clsx";
import React from "react";

import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero", styles.heroBanner)}>
      <div className="container">
        <div
          className={clsx(styles.buttons, "flex flex-col text-center mb-16")}
        >
          <h1 className="mb-8">
            Visualizes and manages icon and image files <br />
            within your frontend project.
          </h1>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started"
          >
            Getting Started
          </Link>
        </div>
        <img
          alt="preview"
          src="https://user-images.githubusercontent.com/41789633/241983401-b6458ff1-f5a5-4f74-984d-f80b9dac83c2.png"
        />
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} Docs`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
    </Layout>
  );
}
