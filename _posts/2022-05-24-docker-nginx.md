---
layout: post
title: "Nginx容器体验"
date: 2022-05-24
tags: [tools,docker,nginx]
---

> Docker 真的是好东西，搭建 CSAPP 的实验环境都不需要虚拟机。

---

## 推荐文章

[Nginx 容器教程 - 阮一峰的网络日志 (ruanyifeng.com)](https://www.ruanyifeng.com/blog/2018/02/nginx-docker.html)

## 铺垫

我承认我比较菜，连端口的作用都不知道。

就是端口可以将信息发送到正确的进程上。本质上 http 服务就是一个进程。

比如 **80 端口就是 http 协议的默认端口**，如果需要访问一个网站的正确方式是

```
http://github.com:80
```

如果是 **https 协议，那么默认端口就是 443** 

```
https://github.com:443
```

实际上这些默认端口都可以改的。

如果需要连上容器内的 http 服务，就需要**将本机的端口映射到容器的端口上**。

一般情况下

```
docker run \
  -dit \
  -p localhost:80:80 \
  --rm \
  --name mynginx \
  nginx
```

但是如果本机的 80 端口被占用，就需要改成其他。

```
docker run \
	--rm \
	--name web \
	-dit \
	-p 8080:80 \
	--volume "$PWD/html":/usr/share/nginx/html \
  --volume "$PWD/conf":/etc/nginx \
	nginx:alpine
```

这是为了把本机当前目录的 `html` 和 `conf` 映射到 容器的 Nginx 网页文件和配置目录上。

这种举措能够实现持久化(除非你把容器保存下来)

---

## Apache 服务器

如果是从源码开始编译的话，一开始会有点麻烦。

首先需要找到 `httpd.conf` ，可以看 <https://httpd.apache.org/docs/current/programs/configure.html>

发现 `--sysconfdir=DIR`  这个 option 是用来指定配置文件的。

如果没有设置，那么就是 `PREFIX/conf` (就安装目录下的 `conf` 文件夹)

在这个文件下找到 `DocumentRoot` ，就知道我们应该把 HTML 放到哪里了。

但你也可以改掉，比如我的目录就是

```
DocumentRoot "/tests/apache/opt/htdocs"
```

需要注意的是，***Docker 容器本身就是为进程服务的***，这不像 Linux OS 。

要保持容器持续运行，需要至少一个主要的程序**处于前台工作的状态** (比如常见 CMD/ENTRYPOINT `/bin/bash` 或者 deamon 运行 MySQL)。可以试一下只运行以下指令，容器会马上退出。这是因为 apachectl 的工作完成以后，容器就没有可以依赖的进程了，自然就没有继续存在的理由。

```
apachectl start
```

由于我把程序写到本机上，然而 docker 默认先进入 Entrypoint ，再加载数据卷。这就无解了。

只能进入容器后再搞 (不知道用mount 能不能避免这种行为)

```
docker run \
	--name web_server \ 
  -it \ 
	--rm \ 
  --expose 80 \ 
  -p 3000:80  \ 
  --volume "$PWD/tests/apache/opt":/tests/apache/opt \ 
  --entrypoint "/bin/bash"
  "镜像名字"
```

(因为刚开始 build 镜像的时候没想过拿来做 httpd ，忘了暴露端口)。

```
/tests/apache/opt/bin/apachectl -D FOREGROUND
```

输入 `http://127.0.0.1:3000/` 可以看到效果了！

![image-20220524115121441](https://raw.githubusercontent.com/randoruf/photo-asset-repo/main/imgs/image-20220524115121441.png)

在启动的时候，可能会遇到

```
httpd: Could not reliably determine the server's fully qualified domain name, using 172.17.0.2. Set the 'ServerName' directive globally to suppress this message
```

可以参考 [Apache Configuration Error AH00558: Could not reliably determine the server's fully qualified domain name - DigitalOcean](https://www.digitalocean.com/community/tutorials/apache-configuration-error-ah00558-could-not-reliably-determine-the-server-s-fully-qualified-domain-name) 解决。

这是因为 `httpd.conf` 还没有动过，加一些 directives 就可以了 (后面 SSL 证书也需要 directives)

看 [How to Setup Apache HTTP with SSL Certificate? (geekflare.com)](https://geekflare.com/apache-setup-ssl-certificate/) 也有教

修改配置文件 `httpd.conf` 就可以 (提前知道这个在之后生成 SSL 证书能用上，OpenSSL 创建证书需要回答几个问题)。

```
ServerName 127.0.0.1:3000
```

(不需要画蛇添足，到时候加端口就好了)。

## 自签名证书

自签名证书不需要提CRS请求(还是CSR?) ，适合自己一个人玩 (但自签名的证书一般会被浏览器识别不安全)。

首先生成证书

```
/tests/apache/opt/bin/openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /tests/apache/opt/conf/certs/hello.key -out /tests/apache/opt/conf/certs/hello.crt
```

参数具体含义见 <https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-apache-in-ubuntu-18-04#step-3-adjusting-the-firewall>

比较重要的是

- `-keyout`: 私有密钥 
- `-out`: 证书

> **可能的错误:** 
>
> 由于 openssl 并不是安装到 `/usr/local/` 目录，所以可能会提示
>
> ```
> Error loading shared library libssl.so.1.1: No such file or directory (needed by /tests/apache/opt/bin/openssl)
> Error loading shared library libcrypto.so.1.1: No such file or directory (needed by /tests/apache/opt/bin/openssl)
> ```
>
> 这时候需要 `LD_LIBRARY_PATH` (OpenSSL 的 `libcrypto.so` 就在这个文件下)
>
> ```
> export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/tests/apache/opt/lib/
> ```
>
> 为了让参数生效(重启后也生效，或者到 ` ~/.bashrc` 修改)
>
> ```
> ldconfig
> ```

然后会弹出一堆问题，比较重要的是  **Common Name** ，正常情况是域名 (也就是上面 ServerName)

```
127.0.0.1
```

下一步就是让 httpd 使用 SSL 模块了 (默认是关闭的)

打开 `httpd.config` ，看看有没有一行是加载 SSL模块、SSL配置文件(不是 commented 状态)

```
LoadModule ssl_module modules/mod_ssl.so 
Include conf/extra/httpd-ssl.conf
```

之后配置 SSL [在Apache服务器上安装SSL证书 (aliyun.com)](https://help.aliyun.com/document_detail/98727.html)

由于使用的自签名证书，SSLCertificateChainFile 没有太大意义。可以参考

- [SSL 证书 Apache 服务器 SSL 证书安装部署-证书安装-文档中心-腾讯云-腾讯云 (tencent.com)](https://cloud.tencent.com/document/product/400/35243)
- [在Apache服务器上安装SSL证书 (aliyun.com)](https://help.aliyun.com/document_detail/98727.html)
- [Cipherlist.eu - Strong Ciphers for Apache, nginx and Lighttpd](https://cipherlist.eu/)

> **可能的错误** 
>
> ```
> SSLSessionCache: 'shmcb' session cache not supported (known names: ). Maybe you need to load the appropriate socache module (mod_socache_shmcb?).
> ```
>
> 需要修改 `httpd.conf` 
>
> ```
> LoadModule socache_shmcb_module modules/mod_socache_shmcb.so
> ```

此时需要重启 docker 的容器(关掉 http)

```
docker run \
	--name web_server \ 
  -it \ 
	--rm \ 
  --expose 443 \ 
  -p 3000:443  \ 
  --volume "$PWD/tests/apache/opt":/tests/apache/opt \ 
  --entrypoint "/bin/bash"
  "镜像名字"
```

再次启动 apache 服务

```
/tests/apache/opt/bin/apachectl -D FOREGROUND
```

再次尝试访问 `https://127.0.0.1:3000` ，会提示

![image-20220524134938266](https://raw.githubusercontent.com/randoruf/photo-asset-repo/main/imgs/image-20220524134938266.png)

甚至都不允许 **Proceed** ，随手查了一下 [Bypass Chrome self-signed certificate not working error page - Useful Snippets (khromov.se)](https://snippets.khromov.se/bypass-chrome-self-signed-certificate-not-working-error-page/)

- 尝试换到其他浏览器 (比如 FireFox, Safari)
- 在 URL 栏打 `thisisunsafe`
- 安装证书 (比如 FireFox 可以单独管理证书)

**Setting -> Privay & Security -> Certificates -> View Certificates** 

(话说试了一下， Firefox 速度真的快)

如果依旧出错，就是加密算法不匹配了 (比如 `SSL_ERROR_NO_CYPHER_OVERLAP` 就是 Server 那边只允许特定的加密算法)。

<https://support.mozilla.org/dsb/questions/1260906>







