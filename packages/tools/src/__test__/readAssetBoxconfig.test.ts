// jest.mock("fs");
// import memfs, { vol } from "memfs";
// import process from "process";

// import { readAssetBoxConfig } from "../readAssetBoxConfig";
// import {
//   dupAssetCase,
//   noAssetboxConfig,
//   noAssetPaths,
//   normalCase,
// } from "./utils/mockRepository";
// const spy = jest.spyOn(process, "cwd");
// spy.mockReturnValue("/test");
// jest.create;

// beforeEach(() => {
//   vol.fromJSON(normalCase, "/test/normal");
//   vol.fromJSON(noAssetPaths, "/test/noAssetPaths");
//   vol.fromJSON(noAssetPaths, "/test/noAssetboxConfig");
//   vol.fromJSON(dupAssetCase, "/test/dupAssetCase");
// });

// describe("Inital Test Settings", () => {
//   test(`Is the test internal repository well created?`, () => {
//     expect(vol.existsSync("/test/normal")).toBe(true);
//     expect(vol.existsSync("/test/noAssetPaths")).toBe(true);
//     expect(vol.existsSync("/test/noAssetboxConfig")).toBe(true);
//     expect(vol.existsSync("/test/dupAssetCase")).toBe(true);
//   });
//   test(`find assetboxconfig.js `, () => {
//     expect(vol.existsSync("/test/normal/assetbox.config.cjs")).toBe(true);
//     expect(vol.existsSync("/test/noAssetPaths/assetbox.config.cjs")).toBe(true);
//     expect(vol.existsSync("/test/noAssetboxConfig/assetbox.config.cjs")).toBe(
//       true
//     );
//     expect(vol.existsSync("/test/dupAssetCase/assetbox.config.cjs")).toBe(true);
//   });
// });

// describe("readAssetBoxConfig", () => {
//   test("readsassetbox.config.cjs", async () => {
//     const config = await readAssetBoxConfig();
//     console.log("config", config);
//     expect(config).toStrictEqual({
//       filePath: "/test/assetbox.config.cjs",
//       assetPaths: ["./public/**/*", "./src/assets/**/*"],
//     });
//   });
// });
