###### note
- 为了解决autofixer 配置完不生效的问题；可在package.json 配置
"browserslist": [
    "defaults", 
    "not ie < 11",
    "last 2 versions",
    "> 1%",
    "iOS 7",
    "last 3 iOS versions"
  ]
- 报错：TypeError: Cannot read property 'bindings' of null
1. .babelrc 文件 evn->@babel/preset-env
```js
{
    "presets": [
      ["@babel/preset-env", {
        "targets": {
          "browsers": ["IE >= 9"]
        },
        "useBuiltIns": true
      }]
    ]
}
```