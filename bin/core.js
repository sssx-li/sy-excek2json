import readXlsxFile from "read-excel-file/node";
import ConvertToJson from "read-excel-file/schema";
import fs from "fs";
import path from "path";

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
 * @param {String('array' | 'object')} outputType 生成json数据格式
 * @param {String[]} keys 文件标题对应字段(默认取标题)
 */
export async function xlsToJson(
  filePath,
  outputFilePath,
  outputType = "array",
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
    const keyArr = [];
    const schema = {};
    // 空项填充默认值
    const emptyItem = {};
    headKeys.forEach((item, index) => {
      const prop = keys[index] ?? item;
      emptyItem[prop] = "";
      keyArr.push(prop);
      schema[item] = {
        prop,
        type: valueTypeMaps.get(types[index]) || String,
      };
    });

    const { rows } = ConvertToJson(fileData, schema);
    // 空值处理
    let jsonData = rows.map((row) => Object.assign({}, emptyItem, row));

    const _dataType = outputType === "object" ? "object" : "array";
    if (_dataType === "object") {
      // 数组第一项为键，取后面项作为值
      jsonData = data2Object(keyArr.slice(1), jsonData);
    }

    const fileName = outputFilePath.includes(".json")
      ? outputFilePath
      : `${outputFilePath}.json`;
    fs.writeFile(
      path.resolve(process.cwd(), fileName),
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

function data2Object(headKeys = [], data = []) {
  const obj = {};
  headKeys.forEach((item) => {
    obj[item] = {};
    obj[item] = arrayToObject(data, item);
  });
  return obj;
}

/* 
  const arr = [{ key: 'title', en: 'Title', cn: '标题' }, { key: 'nav.login', en: 'Login', cn: '登录' }]
  const result = arrayToObject(arr, 'en')
  ----- result -----
  {
    title: '标题',
    nav: {
      login: '登录'
    }
  }
*/
function arrayToObject(arr, key) {
  const result = {};
  arr.forEach((item) => {
    const keys = Object.values(item)[0].split(".");
    const lastKey = keys.pop();
    let currentObject = result;
    keys.forEach((key) => {
      currentObject = currentObject[key] = currentObject[key] || {};
    });
    currentObject[lastKey] = item[key];
  });
  return result;
}
