
import koaCompose from 'koa-compose';
import logger from 'koa-logger';       //koa开发时替换console.log输出的一个插件
// koa 中间件和koa-router 无关
const middleware = function(app) {
    // 带有中间件的 代码执行是先进后出
    app.use(logger());

    //demo1             // 异步( async )的 中间件组织   // 可以认为的控制输出顺序

    app.use( async(ctx, next) => {
        const start = Date.now();
        await next();           
        const ms = Date.now() - start;
        ctx.set('X-Response-Time', `${ms}ms`);      // 设置 返回的数据
    });

    app.use(async(ctx, next) => {
        const start = Date.now();
        await next();
        const ms = Date.now() - start;
        console.log(`async ${ctx.method} ${ctx.url} - ${ms}`);      
    });

    app.use(async(ctx, next) => {
        const start = Date.now();
        await next();
        const ms = Date.now() - start;
        console.log(`async ${ctx.method} ${ctx.url} - ${ms}`);      
    });

    // 也可以在中间件中直接执行数据，不再进行下一步操作，在这里就可以做一些 可能需要 本地 mock 的数据
    // app.use(async ctx => {
    //     ctx.type = 'xml';
    //     ctx.body = '<data>在中间件中直接返回数据，不再执行下一步</data>';
    // })

    // demo2

    // 多个中间件会形成一个栈结构（middle stack），以"先进后出"（first-in-last-out）的顺序执行。
    const one = (ctx, next) => {
        console.log('middleware >> one');
        next();
        console.log('<< one');
    }
    
    const two = (ctx, next) => {
        console.log('>> two');
        next(); 
        console.log('<< two');
    }
    
    const three = (ctx, next) => {
        console.log('middleware>> three');
        next();
        console.log('<< three');
    }

    // app.use(one);
    // app.use(two);
    // app.use(three);

    // koa-compose可以将多个中间件合并成为一个
    const composeMiddleware = koaCompose([one, two, three])
    app.use(composeMiddleware);
}

export default middleware;