import { findPackageRoot, findProjectRoot } from "workspace-tools";

export const cwd = () => findPackageRoot(process.cwd())!;
export const root = () => findProjectRoot(process.cwd())!;
