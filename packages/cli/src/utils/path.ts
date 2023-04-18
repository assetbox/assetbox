import { resolve } from "path";

/**
 * Make an absolute path from the CLI file path.
 * @param paths
 * @returns path to the cli root
 */
export const resolveCliRoot = (...paths: string[]) =>
  resolve(__dirname, ...paths);

/**
 * Make an absolute path from the project path where the library is being used.
 * @param paths
 * @returns path to the cli root
 */
export const resolveProjectRoot = (...paths: string[]) =>
  resolve(process.cwd(), ...paths);
