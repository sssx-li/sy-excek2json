import readXlsxFile from "read-excel-file/node";
import ConvertToJson from "read-excel-file/schema";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 *
 * @param {String} filePath 文件路径
 * @param {String} outputFilePath json输出路径
 * @param {String[]} fileKeys 文件标题对应字段(默认取标题)
 */
async function xlsToJson(filePath, outputFilePath, fileKeys = []) {
  try {
    const fileData = await readXlsxFile(filePath);
    if (!fileData || fileData.length === 0) {
      throw new Error("文件内容为空，请检查后再试");
    }
    const keys = fileData[0];
    const schema = {};
    keys.forEach((item, index) => {
      schema[item] = {
        prop: fileKeys[index] ?? item,
        type: String,
      };
    });
    const { rows } = ConvertToJson(fileData, schema);
    fs.writeFile(
      path.resolve(__dirname, `${outputFilePath}.json`),
      JSON.stringify(rows),
      "utf-8",
      (err) => {
        if (err) {
          throw new Error(err);
        }
        console.log("文件写入成功");
      }
    );
  } catch (error) {
    throw new Error(error);
  }
}
