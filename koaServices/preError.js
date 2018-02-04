const preErrorServer = function(app) {

    // 监听并处理错误   监听处理错误的 操作在整个http 服务之前

    // 方式二：  直接统一监听 http 服务报错的情况
    app.on('error', err => {            // 不传递上下文
        console.log('server error', err);
    });

    // app.on('error', (err, ctx) => {             // 出现错误仍然传递 ctx
    //     console.log('server error', err, ctx);
    //     // ..... 继续传递 ctx
    // });

    // 处理错误方式一, 使用 try catch

    // 注意： 如果错误被try...catch捕获，就不会触发error事件。这时，必须调用ctx.app.emit()，手动释放error事件，才能让监听函数生效
    const doCatchError = async(ctx, next) => {  // 这里使用异步函数
        try {
            await next();
        } catch (error) {
            console.log('try catch pre error')
            ctx.status = ctx.status || 500;             // status 属性默认为 500 的错误，这将允许 Koa 做出适当地响应
            ctx.type = 'html';
            ctx.body = '<p>Something wrong, please contact administrator.</p>';
            ctx.app.emit('error', error, ctx);       // 手动释放 error 事件

            // ctx.app      //应用程序实例引用
        }
    }

    app.use(doCatchError);

    // error 情况 1
    const setErrorPage = (ctx, next) => {       // 手动将页面置为 404
        ctx.status = 404;
        ctx.body = 'this page not find';
    }
    // app.use(setErrorPage);       // 手动将页面置为 404

    // error 情况 2
    const throwErrorCode = (ctx, next) => {
        ctx.throw(500, 'name required');       //throw 用来抛出一个错误 
    }
    app.use(throwErrorCode);
}

export default preErrorServer;