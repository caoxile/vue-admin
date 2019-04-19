## 简介
vue-admin 是一个基于vue.js+element-ui的前端项目，可以用于快速构建后台管理系统，可以作为一个前端种子项目。

另外,还有个对应的SpringBoot+SpringMVC+Mybatis的后端项目[spring-boot-ssm](https://github.com/caoxile/spring-boot-ssm),同样可以作为一个种子项目。

这2个项目是集成测试过的，可以直接拿来开发项目。

## 特征
- [x] Vue 2                                                             
- [x] Element-UI		 		
- [x] Axios          
- [x] 用户权限管理功能
- [x] 操作日志和在线用户监控


## 环境准备
1. Node.js


## 快速启动
1. 克隆项目
```
    git clone https://github.com/caoxile/vue-admin.git
```
2. 安装依赖

```
   npm install
```
  
3. 对开发环境配置文件```/config/index.js```进行配置
- 修改后端服务器请求地址
``` 
    proxyTable: {
      '/api': {
        target: 'http://localhost:8080',
        pathRewrite: {
          '^/api': '/'
        }
      }
    },

```

4. 启动（访问地址：localhost:9527）
```
   npm run dev
```



## 技术文档
- Apache Shiro([跟我学Shiro](https://jinnianshilongnian.iteye.com/blog/2018398))
- vue-element-admin([vue后台权限管理系统](https://github.com/PanJiaChen/vue-element-admin))

## License
MIT

