const fs = require('fs');
const invariant = require('invariant');
const shell = require('shelljs')
const logger = require('log4js').getLogger();

module.exports = class Shadowsocks {

  constructor(options = {}) {
    invariant(!!options.configFilePath, 'Shadowsocks need configFilePath');
    
    this.configFilePath = options.configFilePath;
    this.syncWithFs = false;
    this.rerunThreadLock = false;

    try {
      this.shadowsocksConfig = JSON.parse(fs.readFileSync(this.configFilePath, 'utf8'));
      this.syncWithFs = true;
    }
    catch(err) {
      throw new Error(`Can not read Shadowsocks config file in ${this.configFilePath}`);
    }
  }

  writeConfigFile() {
    fs.writeFileSync(this.configFilePath, JSON.stringify(this.shadowsocksConfig, null, 2), 'utf8');
    this.syncWithFs = true;
  }

  reRunServer() {
    logger.info('Request restart shadowsocks');
    const shellCommand = `ssserver -c ${this.configFilePath} -d restart`;
    const threadResult = shell.exec(shellCommand);
    if(threadResult.code !== 0) throw new Error(`Shell exec fail, code with ${threadResult.code}`);
  }

  portChange() {
    this.shadowsocksConfig.server_port += 1;
    this.syncWithFs = false;
  }

  getServerConfig() {
    if(!this.syncWithFs){
      throw new Error('config is not sync with fileSystem, call Shadowsocks.writeConfigFile() first');
    }
    return {
      server: this.shadowsocksConfig.server,
      port: this.shadowsocksConfig.server_port,
      method: this.shadowsocksConfig.method,
      password: this.shadowsocksConfig.password
    }
  }

  getQrcode() {
    const { method, password, server, port } = this.getServerConfig();
    return `ss://${new Buffer(`${method}:${password}@${server}:${port}`).toString('base64')}`;
  }
}