<p align="center">
  <img width="560" src="https://baimingxuan.gitee.io/media-store/images/logo-node.png">
</p>



<p align="center">
  <a href="https://github.com/nodejs/node">
    <img src="https://img.shields.io/badge/nodejs-12.18.3-brightgreen.svg" alt="nodejs">
  </a>
  <a href="https://github.com/expressjs/express">
    <img src="https://img.shields.io/badge/express-4.17.1-brightgreen.svg" alt="express">
  </a>
  <a href="https://github.com/mysql/mysql-server">
    <img src="https://img.shields.io/badge/mysql-2.18.1-brightgreen.svg" alt="mysql">
  </a>
  <a href="https://github.com/auth0/node-jsonwebtoken">
    <img src="https://img.shields.io/badge/jsonwebtoken-8.5.1-brightgreen.svg" alt="jsonwebtoken">
  </a>
  <a href="https://github.com/auth0/express-jwt">
    <img src="https://img.shields.io/badge/express--jwt-6.0.0-brightgreen.svg" alt="express-jwt">
  </a>
</p>  



#### node-admin-design是一个基于nodejs+ mysql为技术栈，为vue-admin-design开发相关API接口的server，登录采用了目前流行的JWT验证模式，并将实现系统权限管理RBAC（开发中）...




> ##### 项目演示地址：[http://42.194.194.178/](http://42.194.194.178/)（1M带宽初次访问比较慢）
>
> ##### github项目地址： [https://github.com/baimingxuan/node-admin-design](https://github.com/baimingxuan/node-admin-design)
>
> ##### github前端地址： [https://github.com/baimingxuan/vue-admin-design](https://github.com/baimingxuan/vue-admin-design)
>
> ##### gitee项目地址： [https://gitee.com/baimingxuan/node-admin-design](https://gitee.com/baimingxuan/node-admin-design)
>
> ##### gitee前端地址： [https://gitee.com/baimingxuan/vue-admin-design](https://gitee.com/baimingxuan/vue-admin-design)
>



## 目录结构

```bash
├── config
│   └── db.js             	   # 数据库配置
├── controller
│   └── user.js                # 数据库操作
├── db 
│   └── mysql.js               # 数据库连接
├── models 
│   └── Result.js              # 返回JSON格式
├── router
│   ├── index.js               # 路由中间件
│   ├── jwt.js                 # jwt
│   └── user.js                # 用户路由
├── utils
│   ├── constant.js            # 常用变量
│   └── index.js               # 常用方法
├── app.js                     # 入口文件
├── package.json               # package.json
└── README.md                  # README.md
```



## 开发

```
// 克隆项目
git clone https://github.com/baimingxuan/node-admin-design.git

// 安装依赖
npm install

// 开发
npm run dev
```