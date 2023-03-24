import pc from "picocolors";

export const log = (...messages: string[]) => {
  console.log(pc.blue(["📦", ...messages].join(" ")));
};
