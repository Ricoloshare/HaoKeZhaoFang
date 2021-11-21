# 租房网站后台启动说明

租房网使用的后台是nodejs 版本最低是10.0 所以必须使用10.0版本以上的node才可以运行
后台使用的是MySQL

## 后台启动方式

首先需要进入后台的根目录文件下使用npm install 下载node所需要的所有插件

```shell
npm install
// yarn
yarn
```

- mysql配置文件在 /config/mysql.js中，**需要修改数据库密码（你自己的数据库密码）**
- 端口号配置文件在 /bin/www 如果你有需要可以进行修改（默认8009）
- 后台配置了cors 所以不存在跨域问题
- 文件设置完成之后在根目录文件输入

```shell
npm start
//yarn
yarn start
```

## 数据库文件配置

在数据库内创建一个新的库 hkzf
编码格式选择utf-8
然后将对应的sql文件导入

## 项目说明


可以打开对应的接口文档
