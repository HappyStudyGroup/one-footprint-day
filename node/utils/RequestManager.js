const Stream = require("node-rtsp-stream");
const os = require("os");
///获取本机ip///
function getIPAdress() {
  var interfaces = os.networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (
        alias.family === "IPv4" &&
        alias.address !== "127.0.0.1" &&
        !alias.internal
      ) {
        return alias.address;
      }
    }
  }
}
const args = [];
const requestManager = function () {};
//这里是在原型上加上打开和关闭两个方法
requestManager.prototype = {
  Open: function (arg) {
    let result = {};
    if (args.length == 0) {
      result = this._create(arg);
      result = this._openVideo(result);
    } else {
      if(arg) {
        args.forEach((a) => {
          if (a.rtspUrl == arg.rtspUrl) {
            result = a;
          }
        });
      }
      if (result.port === undefined || result.rtspUrl === undefined) {
        result = this._create(arg);
        result = this._openVideo(result);
      }
    }
    result = Object.assign(result, {
      url: `ws:\\${getIPAdress()}:${result.port}`,
    });
    return result;
  },
  Close: function (arg) {
    let result = {};
    let idx = -1;
    if(arg) {
      idx = args.findIndex((a) => a.rtspUrl == arg.rtspUrl);
      if (idx !== -1) {
        args[idx].stream.stop();
        result = args.splice(idx, 1);
      } else {
      }
    }
    return result;
  },
  //这里是产生一个随机端口号，用来推流使用。
  _randomPort: function () {
    let port = Math.floor(Math.random() * (4001 - 3001) + 3001);
    return port;
  },
  //这里是核心推流代码，其实很简单。
  _openVideo: function (arg) {
    arg.stream = new Stream({
      name: "name",
      //streamUrl: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov',
      streamUrl: arg.rtspUrl,
      wsPort: arg.port,
      ffmpegOptions: {
        // options ffmpeg flags
        "-stats": "", // an option with no neccessary value uses a blank string
        "-r": 30, // options with required values specify the value after the key
        "-s": arg.size,
        "-codec:a": "mp2",
        "-ar": 44100,
        "-ac": 1,
        "-b:a": "128k",
      },
    });
    return arg;
  },
  //这里创建参数。
  _create: function (arg) {
    let target = {
      rtspUrl: "rtmp://mobliestream.c3tv.com:554/live/goodtv.sdp",
      port: this._randomPort(),
      size: "1024*768",
      stream: null,
    };
    let source = {
      // rtspUrl: arg.rtspUrl,
      // port: this._randomPort(),
      // size: arg.size,
      // stream: null,
    };
    Object.assign(target, source);
    args.push(target);
    return target;
  },
};

module.exports = requestManager;
