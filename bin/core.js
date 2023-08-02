import readXlsxFile from "read-excel-file/node";
import ConvertToJson from "read-excel-file/schema";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const valueTypeMaps = new Map([
  ["string", String],
  ["number", Number],
  ["boolean", Boolean],
  ["date", Date],
]);

/**
 *
 * @param {String} filePath 文件路径
 * @param {String} outputFilePath json输出路径
 * @param {String[]} keys 文件标题对应字段(默认取标题)
 */
export async function xlsToJson(
  filePath,
  outputFilePath,
  keys = [],
  types = []
) {
  try {
    const fileData = await readXlsxFile(filePath);
    if (!fileData || fileData.length === 0) {
      throw new Error("文件内容为空，请检查后再试");
    }
    // 表头
    const headKeys = fileData[0];

    const schema = {};
    // 空项填充默认值
    const emptyItem = {};
    headKeys.forEach((item, index) => {
      const prop = keys[index] ?? item;
      emptyItem[prop] = "";
      schema[item] = {
        prop,
        type: valueTypeMaps.get(types[index]) || String,
      };
    });

    const { rows } = ConvertToJson(fileData, schema);
    // 空值处理
    const jsonData = rows.map((row) => Object.assign({}, emptyItem, row));

    const fileName = outputFilePath.includes(".json")
      ? outputFilePath
      : `${outputFilePath}.json`;
    fs.writeFile(
      path.resolve(__dirname, "..", fileName),
      JSON.stringify(jsonData),
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
