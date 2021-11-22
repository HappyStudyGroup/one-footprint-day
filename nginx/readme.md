#### nginx的常用命令:
```js
$ start nginx                   // 开启nginx
$ nginx -s stop                 // 快速关机
$ nginx -s quit                 // 优雅关机
$ nginx -s reload               // 重新加载
$ nginx -s reopen               // 重新打开日志文件

$ tasklist /fi "imagename eq nginx.exe" // 查看开启的 nginx.exe 列表

```

#### 相关配置说明:

##### 下载包在线安装
```nginx
1. 服务器安装工具 yum -> yum search nginx (查看可安装nginx配置) -> yum install nginx
2. yum list | grep nginx , 查看可安装的nginx目录
3. yum install nginx -y
4. nginx -v 查看nginx版本
5. nginx -V 查看可配参数
6. rpm -ql nginx 查看nginx安装目录
7. 日志文件都在  `cd /var/log/nginx/`  目录下
8. nginx.conf配置文件中的`include /etc/nginx/conf.d/*.conf`, 含义: 为了避免配置文件过大, 以后可能会将配置文件拆分, 所以会引入 `/etc/nginx/conf.d/` 下所有的 .conf 文件
9. CGI 通用网关协议
```
##### 源码包编译安装
```nginx
# nginx相关配置
# 移除nginx
1. find / -name nginx   // 找到所有的nginx目录, 手动删除
2. yum remove nginx     // 删除依赖关系
3. 编译安装
# yum install -y zlib zlib-devel
# yum install -y pcre pcre-devel
# yum install -y openssl openssl-devel
#官网推荐
./configure --sbin-path=/usr/local/nginx/nginx --conf-path=/usr/local/nginx/nginx.conf --pid-path=/usr/local/nginx/nginx.pid --with-http_ssl_module --with-pcre=../pcre-8.44 --with-zlib=../zlib-1.2.11
# 百度推荐, 需手动创建temp/下的文件目录
./configure --prefix=/usr/local/nginx --pid-path=/var/run/nginx/nginx.pid --lock-path=/var/lock/nginx.lock --error-log-path=/var/log/nginx/error.log --http-log-path=/var/log/nginx/access.log --with-http_gzip_static_module --http-client-body-temp-path=/var/temp/nginx/client --http-proxy-temp-path=/var/temp/nginx/proxy --http-fastcgi-temp-path=/var/temp/nginx/fastcgi --http-uwsgi-temp-path=/var/temp/nginx/uwsgi --http-scgi-temp-path=/var/temp/nginx/scgi
make && make install
cd /nginx/sbin ./nginx #启动nginx
#ps -ef列出进程列表，然后通过grep过滤
ps -ef | grep nginx #查看nginx进程, 可以找到pid
netstat -nap | grep pid       #根据进程id,查找端口
netstat -nap | grep 端口       #根据端口,查看进程
#如果启动了,但是外网无法访问,那么很可能是防火墙开启的原因
systemctl status firewalld    #查看防火墙的状态
systemctl stop firewalld      #临时关闭防火墙,下次启动会自动开启
systemctl disable firewalld   #永久关闭防火墙, 需要先关闭在执行,才可生效
systemctl start firewalld     #启动防火墙
```