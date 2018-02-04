import koaStatic from 'koa-static';
import path from 'path';

const staticServer = function(app) {
    const main = koaStatic(path.join(__dirname, '../public'));          // 可以设置静态资源服务的路径
    app.use(main);
}

export default staticServer;




