const Koa = require('koa');
const Router = require('koa-router');
const config = require('./config.json');
const logger = require('log4js').getLogger();

const Shadowsocks = require('./service/shadowsocks.js');
const shadowsocks = new Shadowsocks(config.shadowsocks);

var app = new Koa();
var router = new Router();

router.get('/config', (ctx, next) => {
  ctx.body = shadowsocks.getServerConfig();
});

router.get('/qrcode', (ctx, next) => {
  ctx.body = {
    qrcode: shadowsocks.getQrcode()
  };
});

router.get('/changePort', async (ctx, next) => {
  shadowsocks.portChange();
  shadowsocks.writeConfigFile();
  await shadowsocks.reRunServer();
  ctx.body = shadowsocks.getServerConfig();
})

app.use(router.routes()).use(router.allowedMethods());
app.listen(3000);