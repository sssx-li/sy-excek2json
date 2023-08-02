## sy-excel2json

> 一个简单的将 .xlsx 转化输出为 .json 的工具

### 安装

```bash
npm i sy-excel2json -g
```

### excel 内容示例

| index | value |
| :---- | ----: |
| 1     |    11 |
| 2     |       |
| 3     |    13 |

### 使用

```base
e2j filePath outputPath [key1,key2...] [type1,type2,...]

filePath: 表示要转换的 .xlsx 文件路径

outputPath 表示转换后的 .json 文件路径

key 表示要列名转换后的键

type 表示要列转换后的类型
  type的可选类型为: string | number | boolean | date
```

1. 直接使用(使用表头作为 key 的值)

```bash
sy-e2j ./test.xlsx base
or
sy-e2j ./test.xlsx base.json
```

输出内容为:

```json
[
  { "index": "1", "value": "11" },
  { "index": "2", "value": "" },
  { "index": "3", "value": "13" }
]
```

2. 使用自定义 key

```base
sy-e2j ./test.xlsx base label,value
```

输出内容为:

```json
[
  { "label": "1", "value": "11" },
  { "label": "2", "value": "" },
  { "label": "3", "value": "13" }
]
```

3. 使用自定义类型

```base
sy-e2j ./test.xlsx base label,value string,number
```

输出内容为:

```json
[
  { "label": "1", "value": 11 },
  { "label": "2", "value": "" },
  { "label": "3", "value": 13 }
]
```
