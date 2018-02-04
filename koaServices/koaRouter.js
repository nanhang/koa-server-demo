import Router from 'koa-router';
const router = new Router();

const webServer = function(app) {
    router.get('/', (ctx, next) => {
        // ctx.router available
        ctx.type = 'xml'
        ctx.body = '<data>Hello World</data>';
        // ctx.redirect()               提供重定向服务
    });  
    app.use(router.routes());  
}

export default webServer;




