// ffmpeg所有的参数都是作用于紧跟其后的文件，因此参数的顺序相当重要！！！
// ffmpeg所有的参数都是作用于紧跟其后的文件，因此参数的顺序相当重要！！！
// ffmpeg所有的参数都是作用于紧跟其后的文件，因此参数的顺序相当重要！！！

P-Frame （Predictive-Frame），利用之前的I帧或P帧，采用运动预测的方式进行帧间预测编码；
B-Frame（bipredictive-Frame），bi双向的意思，双向预测编码图像帧)，提供最高的压缩比，它既需要之前的图像帧(I帧或P帧)，
也需要后来的图像帧(P帧)，采用运动预测的方式进行帧间双向预测编码。

一般都是以有规律的interval来插入key frame，这个有规律的interval就叫做I-Frame interval ，或者叫做I-Frame distance，
或者叫做GOP length/size（Group Of Images），这个值一般是10倍的fps（libx264默认将这个interval设置为250，
另外，x264编码器在检测到大的场景变化时，会在变化开始处插入key frame) 。
ESPN	每10秒插入一个key frame
YouTube	每2秒插入一个key frame
Apple	每3秒到每10秒插入一个key frame。

再详细一点说说GOP这个概念，GOP结构一般会使用2个数字来描述，比如, M=3, N=12。第一个数字3表示的是2个anchor frame(I帧 或者 P帧)之间的距离，第二个数字12表示2个key frame之间的距离（也就是GOP size或者GOP length），那么对于这个例子来说， GOP结构就是IBBPBBPBBPBBI。

IDR(instantaneous decoder refresh) frame首先是 keyframe，对于普通的keyframe（non-IDR keyframe）来说，其后的P-Frame和B-Frame可以引用此keyframe之前的帧，但是IDR就不行，IDR后的 P-Frame和B-Frame不能引用此IDR之前的帧。所以decoder遇到IDR后，就可以毫不犹豫的抛弃之前的解码序列，从新开始(refresh)。这样当遇到解码错误的时候，错误不会影响太远，将止步于IDR。



// 把mp4视频的第1分57秒的一帧图像截取出来

ffmpeg -ss 00:01:57 -i 04.mp4 -frames:v 1 out.jpg
方法1 input seeking--使用的是key frames，所以速度很快
	
ffmpeg -i 04.mp4 -ss 00:01:57 -frames:v 1 out2.jpg
方法2 output seeking--是逐帧decode直到1分05秒，所以速度很慢（时间越靠后速度越慢，但是两者生成的图片无任何差异）

-frame:v 1的意思是说在video stream上截取1帧



// 截取视频，2种coding模式：transcoding 和 stream copying（ffmpeg -c copy）
#1, use stream copying & input seeking
ffmpeg -ss 00:01:01 -i v.mp4 -t 4 -c copy cut1.mp4

#2 use stream copying & output seeking, 会造成音画不同步的情况，前几秒黑屏，过几秒后才出现画面（插入key frame）
ffmpeg -i v.mp4 -ss 00:01:01  -t 4 -c:v copy cut2.mp4

#3 use transcoding & input seeking
ffmpeg -ss 00:01:01 -i v.mp4  -t 4 -c:v libx264 cut3.mp4

#4 use transcoding & output seeking
ffmpeg -i v.mp4 -ss 00:01:01 -t 4 -c:v libx264 cut4.mp4

这#1、#2、#3、#4分别表现是什么呢？

#1，当为Input seeking + stream copying的时候，我们想截取的是[61, 65)的片段，实际截取的是[58.56, 65)的片段，是的，ffmpeg往前移动到了一个I-Frame；

#2，当为output seeking + stream copying的时候，我们想截取的是[61, 65)的片段，实际截取的是[64.56, 65) 的画面，
再加上 (4 - 0.44)秒的空白片段，生成长度为4秒的视频。播放器在播放的时候，这个空白片段怎么播放是由播放器自定义的。
总之，画面的有效信息只有后面的关键帧开始的一小段信息；

#3，当为input seeking + transcoding 的时候，我们想截取的是[61, 65)的片段，实际截取的是[61, 65)的片段，是的，frame-accurate；

#4，当为output seeking + transcoding 的时候，我们想截取的是[61, 65)的片段，实际截取的是[61, 65)的片段，是的，frame-accurate。

可以看到，#3和#4是一样的。



// #怎么得到一个视频的总的帧数呢？
ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_frames -of default=nokey=1:noprint_wrappers=1 v.mp4
输出：1182

// #怎么得到一个视频的key frame的帧数呢？
ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of default=nokey=1:noprint_wrappers=1 -skip_frame nokey v.mp4
输出：10

// #重新设置key frame interval
ffmpeg -i v.mp4 -vcodec libx264 -x264-params keyint=1:scenecut=0 -acodec copy out.mp4

// #看看波特率的变化 -》 out.mp4远远大于v.mp4
ffprobe -v error -select_streams v:0 -show_entries stream=bit_rate -of default=noprint_wrappers=1:nokey=1 out.mp4 



前提是：先启动 rtsp-simple-server.exe rtsp推流服务器,这个服务会监听某个端口, 例如: 8554 
服务包下载: https://github.com/bluenviron/mediamtx
-i xx.mp4 表示输入文件名为 xxx.mp4
-c:v libx264 表示视频编码方式为 H.264
-c:a aac 表示音频编码方式为 AAC
-f flv  表示输出文件格式为 FLV
-c copy 表示复制视频流和音频流
-re     表示以本地视频文件的帧率发送数据，如果此项设置为否，则推流速度可能非常快，导致数据包超时
-f x11grab 表示使用x11grab采集指定屏幕
-s      表示分辨率

# RTSP
// UDP推流本地文件
ffmpeg -re -i 04.mp4 -c copy -f rtsp rtsp://127.0.0.1:8554/video
// TCP推流本地文件
ffmpeg -re -i 04.mp4 -c copy -rtsp_transport tcp -f rtsp rtsp://127.0.0.1:8554/video
// -stream_loop -1 循环推流，后面是数字1
ffmpeg -re -stream_loop -1 -i 04.mp4 -c copy -f rtsp rtsp://127.0.0.1:8554/video
ffmpeg -re -stream_loop -1 -i 04.mp4 -c copy -rtsp_transport tcp -f rtsp rtsp://127.0.0.1:8554/video


# 用rtsp流生成flv文件
ffmpeg -re -i rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4 -rtsp_transport tcp -c:a copy -vcodec h264 -max_delay 100 -f flv test.flv


# 查看本地摄像头驱动名称 -- USB webcam <=> @device_pnp_\\?\usb#vid_0408&pid_2094&mi_00#6&340f164b&0&0000#{65e8773d-8f56-11d0-a3b9-00a0c9223196}\global
ffmpeg -list_devices true -f dshow -i dumy
# 直接查看摄像头
ffplay -f dshow -i video="USB webcam"
# 使用ffmpeg 对摄像头使用TCP推rtsp流
ffmpeg -f dshow -i video="USB webcam" -vcodec libx264 -preset:v ultrafast -tune:v zerolatency -rtsp_transport tcp -f rtsp rtsp://127.0.0.1:8554/camera
# 采集摄像头视频流，推到 NGINX-RTMP 服务器
ffmpeg -f dshow -i video="USB webcam"  -vcodec libx264 -acodec copy -preset:v ultrafast -tune:v zerolatency -vf scale=iw/2:-1 -f flv rtmp://127.0.0.1:8554/live/live0

ffmpeg -rtsp_transport tcp -i rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4 -q 0 -f mpegts -codec:v mpeg1video -s 1280x720 -b:v 1500k -codec:a mp2 -ar 44100 -ac 1 -b:a 128k http://127.0.0.1:8554/test

# 本地桌面流
ffmpeg -f gdigrab -i desktop -vcodec libx264 -preset ultrafast -f rtsp rtsp://127.0.0.1:8554/live/desktop
ffmpeg -f gdigrab -i desktop -q 0 -f mpegts -codec:v mpeg1video -s 1280x720 -b:v 1500k -codec:a mp2 -ar 44100 -ac 1 -b:a 128k http://127.0.0.1:8554/jsmpeg
ffmpeg -f gdigrab -i desktop -f dshow -i audio="麦克风 (Realtek(R) Audio)" -r 20 -vcodec libx264 -preset ultrafast -acodec aac -ac 2 -ar 44100 -ab 128k -pix_fmt yuv420p -f flv "rtmp://live-push.bilivideo.com/live-bvc/?streamname=live_1805854332_79717982&key=123456789876543211472583695&schedule=rtmp&pflag=1"

前提是：先启动 rtmp-simple-server.exe rtmp推流服务器,这个服务会监听某个端口, 例如: 8554 
# RTMP
#将本地视频文件推流到rtmp服务器
ffmpeg -re -i 04.mp4 -c copy -f flv rtmp://127.0.0.1/live
#ffmpeg可以将视频流输出到TCP连接
ffmpeg -f x11grab -s 1920x1080 -i :0 -f mpegts tcp://localhost:8554
# ffmpeg可以录制网络流
ffmpeg -i http://website.com/stream.m3u8 -c copy -f mp4 output.mp4
# 从rtsp地址拉视频数据，并将数据推送到rtmp服务器
ffmpeg -rtsp_transport tcp -i rtsp://example.com/stream -c copy -f flv rtmp://127.0.0.1/live


// FFmpeg —— 屏幕录像和录音并推流（命令行的方式）
Windows采集设备的主要方式是dshow、vfwcap、gdigrab.
其中dshow可以用来抓取摄像头、采集卡、麦克风等，vfwcap主要用来采集摄像头类设备，gdigrab则是抓取Windows窗口程序。
ffmpeg -hide_banner -devices
首先需要安装一个软件,screen capture recorder
https://github.com/rdp/screen-capture-recorder-to-video-windows-free
查看可用的设备：ffmpeg -list_devices true -f dshow -i dummy