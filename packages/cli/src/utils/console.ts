import chalk from "chalk";

export const log = (message?: any, ...optionalParams: any[]) => {
  console.log(chalk.blue(["📦", message].join(" "), optionalParams));
};
