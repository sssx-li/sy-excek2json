## sy-excel2json

> 一个简单的将 .xlsx 转化输出为 .json 的工具

### 安装

```bash
npm i sy-excel2json -g
```

### excel 内容示例

| key         |  简体中文  | English      |
| :------     | --------   | ----------: |
| title       |   标题     |  Title       |
| nav.home    |   首页     |  Home        |
| tip.success |   成功     |  Success     |

#### 使用
``` outputType为object时，表格第一列用于生成对象的键，剩下的列用于生成值  ```

```base
e2j filePath outputPath outputType [key1,key2...] [type1,type2,...]

filePath: 表示要转换的 .xlsx 文件路径

outputPath 表示转换后的 .json 文件路径

outputType 表示转换后的 .json 文件格式 目前支持数组(array)及对象(object) 类型，默认为array

key 表示表头(列名)转换后的键

type 表示列转换后值的类型
  type的可选类型为: string | number | boolean | date
```

1. 直接使用(使用表头作为 key 的值)
- 1.1 outputType为默认值：array
```bash
sy-e2j ./test.xlsx base
or
sy-e2j ./test.xlsx base.json
```

输出内容为:

```json
[
  { "key": "title", "简体中文": "标题", "English": "Title" },
  { "key": "nav.home", "简体中文": "首页", "English": "Home" },
  { "key": "tip.success", "简体中文": "成功", "English": "Success" },
]
```
- 1.2 outputType为object
```bash
sy-e2j ./test.xlsx base object
or
sy-e2j ./test.xlsx base.json object
```
输出内容为:
```json
{
  "简体中文": {
    "title": "标题",
    "nav": {
      "home": "首页"
    },
    "tip": {
      "success": "成功"
    },
    "total": "1"
  },
  "English": {
    "title": "Title",
    "nav": {
      "home": "Home"
    },
    "tip": {
      "success": "Success"
    },
  }
}
```


2. 使用自定义 key

- 2.1 outputType为默认值：array

```base
sy-e2j ./test.xlsx base array key,zh_CN,EN
```

输出内容为:

```json
[
  {"key": "title", "zh_CN": "标题", "EN": "Title" },
  {"key": "nav.home", "zh_CN": "首页", "EN": "Home" },
  {"key": "tip.success", "zh_CN": "成功", "EN": "Success" },
]
```

- 2.2 outputType为object
```base
sy-e2j ./test.xlsx base object key,zh_CN,EN
```

输出内容为:

```json
{
  "zh_CN": {
    "title": "标题",
    "nav": {
      "home": "首页"
    },
    "tip": {
      "success": "成功"
    }
  },
  "EN": {
    "title": "Title",
    "nav": {
      "home": "Home"
    },
    "tip": {
      "success": "Success"
    }
  }
}
```

3. 使用自定义类型
``` 若类型无法转为Number, 则为空字符串 ```
| index | value |
| :---- | ----: |
| 1     |    11 |
| 2     |       |
| 3     |    13 |

```base
sy-e2j ./test.xlsx base array label,value string,number
```

输出内容为:

```json
[
  { "label": "1", "value": 11 },
  { "label": "2", "value": "" },
  { "label": "3", "value": 13 }
]
```