// node.js 支持 es6 的全部语法
// babel-preset-es2015
import path from 'path';
import koa from 'koa';
import koaRouterServer from './koaServices/koaRouter.js';       // 路由服务
import staticServer from './koaServices/staticFile.js';        // 静态资源服务
import middleware from './koaServices/middleware.js';
import preErrorServer from './koaServices/preError';
import webAppServer from './koaServices/koaWebApp.js';

const app = new koa();

// 中间件 因为它处在 HTTP Request 和 HTTP Response 中间，用来实现某种中间功能。
// app.use()用来加载中间件
// 中间件必须在 ctx 返回body 之前

middleware(app);      

preErrorServer(app);    // 错误处理, 这个也是中间件

webAppServer(app);      // web app 应用实例 这个也是中间件

koaRouterServer(app);     // koa-router 服务

staticServer(app);        // koa 静态资源服务

app.listen(3300);
console.log('服务启动 at port: ', 3300);

// 一次可以启动多个服务
// app.listen(3300);
// app.listen(3301);
// console.log('服务启动 at port: ', 3300 + ' && ' + 3301);