import os from 'os';
import path from 'path';
import fs from 'fs';
import Keygrip from 'keygrip';
import koaBody from 'koa-body';
import logger from 'koa-logger';

const webAppServer =  function(app) {
    // app.use(koaBody());                 // app.use(koaBody());  这个要写在所有 处理 koa-post 应用之前
    app.use(koaBody({multipart: true}));    // 添加文件上传功能
    app.use(logger());
    // 可以通过中间件设置 cookies 

    // 使用秘钥 设置 cookies 示例   
    // ctx.cookies.set('name', 'tobi', { signed: true });       // 第三个参数设置是否签名

    const webPageWithCookie = (ctx, next) => {
        let appCookies = ctx.cookies.get('name');
        console.log(appCookies);

        // var name = ctx.request.fields.name  //从post请求中取出参数
        ctx.cookies.set('name', 'tobi', { signed: true });
    }

    // 设置秘钥
    // app.keys = ['im a newer secret', 'i like turtle'];
    // app.keys = new Keygrip(['im a newer secret', 'i like turtle'], 'sha256');
    
    // app.use(webPageWithCookie);                             // app.use() 的大作用


    // 案例二 ，使用 koa-body 做 post 数据处理
    const preFormData = (ctx, next) => {            // app.use(koaBody()); 要写在最前面
        const body = ctx.request.body;
        // if (!body.name) ctx.throw(400, '.name required');
        console.log(body);
        ctx.body = { name: body.name };
    }

    // 附加：发送 post 请求的脚本命令
    // curl -X POST --data "name=Jack" 127.0.0.1:3300

    // app.use(preFormData);
    

    // 案例三： 使用 koa 处理文件上传功能

    const preFileUpload = (ctx, next) => {
        const files = ctx.request.body.files || {};
        for (let key in files) {
            const file = files[key];
            const fileStoragePath = path.join(os.tmpdir(), Math.random().toString());       //磁盘存储
            const reader = fs.createReadStream(file.path);
            const stream = fs.createWriteStream(fileStoragePath);
            reader.pipe(stream);
            console.log('uploading %s -> %s', file.name, stream.path);
        }

        ctx.body="upload file ok";
    }

    // 附加 上传文件的 脚本命令
    // curl -F upload=@/Users/hang/Desktop/timg.jpg http://127.0.0.1:3300
    // /Users/hang/Desktop/timg.jpg 表示需要上传的文件

    app.use(preFileUpload);
}

export default webAppServer;