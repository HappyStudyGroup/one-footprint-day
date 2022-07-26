const os = require('os');


module.exports = {
  getIP: () => {
    const interfaces = os.networkInterfaces();
    console.log('interfaces:', interfaces)
    for (let devName in interfaces) {
      const iface = interfaces[devName];
      console.log('iface:', iface)
      for (let i = 0; i < iface.length; i++) {
        const alias = iface[i];
        console.log('alias:', alias)
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal && alias.netmask === '255.255.255.0') {
          return alias.address;
        }
      }
    }
  }
}