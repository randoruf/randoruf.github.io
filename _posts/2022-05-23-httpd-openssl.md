---
layout: post
title: "为 Apache2 HTTP 配置 SSL 证书"
date: 2022-05-23
tags: [tools]
---

## Recommended Articles  

[How To Create a Self-Signed SSL Certificate for Apache in Ubuntu 18.04 - DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-apache-in-ubuntu-18-04)

[How to Setup Apache HTTP with SSL Certificate? (geekflare.com)](https://geekflare.com/apache-setup-ssl-certificate/)

[compiling - Use Different OpenSSL for Apache - Unix & Linux Stack Exchange](https://unix.stackexchange.com/questions/532510/use-different-openssl-for-apache)

[compiling - Apache + mod_ssl build not linking to my OpenSSL build - Unix & Linux Stack Exchange](https://unix.stackexchange.com/questions/465417/apache-mod-ssl-build-not-linking-to-my-openssl-build)

[How To Create a Self-Signed SSL Certificate for Apache in Ubuntu 18.04 - DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-apache-in-ubuntu-18-04)

[写给开发人员的实用密码学（八）—— 数字证书与 TLS 协议 - This Cute World](https://thiscute.world/posts/about-tls-cert/#2-生成-ecc-证书链)

[TLS安全策略等级 - 三度 - 博客园 (cnblogs.com)](https://www.cnblogs.com/sanduzxcvbnm/p/16173529.html)

[Ubuntu 20.04 : Apache 웹서버 컴파일 설치 (tistory.com)](https://bluexmas.tistory.com/1127)

[《图解密码技术》第14章 SSL/TLS----为了更安全的通信 -  小超的博客 (xiaochaowei.com)](https://xiaochaowei.com/2018/09/23/IllustrationCryptology14/)

## Overview

> Why? 配置完成后，需要 **HTTPS** 才能访问服务器 (domain name/IP)。

- 编译 OpenSSL 
- 编译 Apache HTTP 2.4.5 with SSL module 
- 获得 Self-signed SSL certificate 
- 配置 Apache 支持 SSL 

## 编译 OpenSSL

关于 clang 的环境变量可以看

- <https://github.com/genshen/docker-clang-toolchain/blob/master/Dockerfile>

OpenSSL 用了自己的一套 build system , 去 [Compilation and Installation - OpenSSLWiki](https://wiki.openssl.org/index.php/Compilation_and_Installation) 看看。

```shell
# Step 1: config and generate the Makefile (similar to cmake/meson)
# (if using clang)
CC=clang CXX=clang++ CFLAGS="-O3" CXXFLAGS="-stdlib=libc++ -O3" LDFLAGS="-rtlib=compiler-rt -unwindlib=libunwind -stdlib=libc++ -lc++ -lc++abi" ./config --prefix=???? #安装路径
# (using gcc)
./config --prefix=???? #安装路径
# ---------------------------------------------------------------------------------------------------------
# Step 2: 
make clean
make libclean
make 
# ---------------------------------------------------------------------------------------------------------
# Step 3:
make test # 可以不用测
make install # 卸载需要 make uninstall 
```

此处会用到 OpenSSL ***创建证书的功能*** 以及 ***[libcrypto.so](https://www.openssl.org/docs/man3.0/man7/crypto.html).*** 

## 编译 Apache 

参考 <https://httpd.apache.org/docs/2.4/install.html>

### Requirements

可以看 [Apache HTTP Installation Troubleshooting Guide (geekflare.com)](https://geekflare.com/apache-installation-troubleshooting/)

- **APR and APR-Util** 
  - 下载后放到 `httpd_source_tree_root/srclib/` 目录下。
  - 在 `./config` 的时候，需要 `--with-included-apr` 告诉系统这些 `apache-dev` 资源在哪里。
- Perl-Compatible Regular Expressions Library (PCRE) 
  - 下载 `pcre`   后放到 `httpd_source_tree_root/srclib/` 目录下 (不要下载 `pcre2`)
  - 在 `./config` 的时候，需要 `--with-included-pcre` 告诉系统这些 `apache-dev` 资源在哪里。
  - 看一看这个 [Ubuntu 20.04 : Apache 웹서버 컴파일 설치 (tistory.com)](https://bluexmas.tistory.com/1127)
- OpenSSL
  - 如果 `mod_ssl` 被启用，`./config` 会自动检测 dependencies (`apk add` 或者像上面那样编译 OpenSSL)

下载好源代码后，依旧需要配置(估计是是想搞 cross-platform 的编译，真麻烦)。

> **About Dynamic Shared Object (DSO)**
>
> <https://httpd.apache.org/docs/2.4/dso.html>
>
> 在了解计算机的内存模型后，我们知道 Code 和 Data 都需要加载到内存才能运行。
>
> 现在有一个非常大的程序(比如 LLVM, httpd)，
>
> - 是一股脑地编译成一个 ***static binary file*** ，
> - 还是把其他代码分散到 ***dynamic shared object*** 或者 ***dynamic shared library*** 呢?  
>
> 这样做也有好处，就是可以随时随地添加/禁用新的功能，避免小修改导致重新编译。

Apache 除了最重要的 `httpd` 之外，还有其本身的 **modules** 。

如果想要单独启用一个模块 (比如以前没想到这种需求，后面想启用), 可以看 <https://httpd.apache.org/docs/2.4/dso.html>

扯远了，可以直接开始编译

```shell
# Step 1: config and generate the Makefile (similar to cmake/meson)
# (using gcc)
./configure --enable-ssl -with-ssl=?????? –-enable-so # 其中 -with-ssl 应该与前面的 openssl --prefix 一致。
# (if using clang)
CC=clang CXX=clang++ CFLAGS="-O3" CXXFLAGS="-stdlib=libc++ -O3" LDFLAGS="-rtlib=compiler-rt -unwindlib=libunwind -stdlib=libc++ -lc++ -lc++abi" ./configure --enable-ssl -with-ssl=?????? –-enable-so
# ---------------------------------------------------------------------------------------------------------
# Step 2: 
make clean
make 
# ---------------------------------------------------------------------------------------------------------
# Step 3:
make test # 可以不用测
make install # 卸载需要 make uninstall 
```

这样就可以让 Apache 获得  SSL support.

其中 `–-enable-so` 会将 modules 编译成 `.so` 文件，之后可以在 `httpd.conf` 文件里载入。

> If OpenSSL is not installed to the `/usr/local` default directory, 
>
> then we may have to manually link **httpd** with the **OpenSSL library** by `-with-ssl=` option. 
>
> Read <https://httpd.apache.org/docs/2.4/programs/configure.html#installationdirectories>

## Getting an SSL Certificate

有两种方法  **CSR (Certificate Signing Request)** 和 **Self-signed** 。

参考 <https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-apache-in-ubuntu-18-04>

这里有一个误区: 注意 SSL certificate 和 Ciphersuite 是没有关系的。

所以 Digitalocean 里的命令可以瞎弄。

## Apache SSL Configuration

备份 `httpd.conf` (默认放在 `/usr/local/apache2/conf/`) ，确保里面有

```
LoadModule ssl_module modules/mod_ssl.so 
Include conf/extra/httpd-ssl.conf
```

We will use **httpd-ssl.conf** file to configure the certificate details. 

1. SSLCertificateFile – Certificate CRT file path which you downloaded earlier
2. SSLCertificateKeyFile – private.a key file path
3. SSLCertificateChainFile – ca_bundle.crt file path

备份并打开 `httpd-ssl.conf`

```
SSLCertificateFile "/usr/local/apache2/conf/ssl/certificate.crt"
SSLCertificateChainFile "/usr/local/apache2/conf/ssl/ca_bundle.crt"
SSLCertificateKeyFile "/usr/local/apache2/conf/ssl/private.key"
```

Next, you need to configure the “**ServerName**” directive. Usually, it’s your domain/URL name

```
ServerName chandan.io
```

Save the file and restart the Apache Webserver

```
./apachectl stop 
./apachectl start
```

## 最后

>The above steps are essential for setting up an SSL certificate, and you must tweak the SSL further to [harden and secure which I explained here](https://geekflare.com/apache-web-server-hardening-security/#5-SSL). Before go-live, you may also want to [test your web server SSL/TLS](https://geekflare.com/ssl-test-certificate/) to ensure it’s not exposed to common security vulnerabilities.

还需要细微调整 SSL 和 测试。就跳过了，日后再谈。
