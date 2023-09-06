#! /usr/bin/env node

import { program } from "commander";
import { readFile } from "fs/promises";
import { xlsToJson } from "./core.js";

program.version(
  JSON.parse(await readFile(new URL("../package.json", import.meta.url)))
    .version,
  "-V, --version"
);

program.parse(process.argv);

if (!program.args.length) {
  program.help();
} else {
  const [filePath, outputFilePath, outputType = "array", keys = "", types = ""] =
    process.argv.slice(2);
  if (!outputFilePath) {
    throw new Error("请输入文件输出路径");
  }
  xlsToJson(
    filePath,
    outputFilePath,
    outputType || "array",
    keys ? keys.split(",") : [],
    types ? types.split(",") : []
  );
}
