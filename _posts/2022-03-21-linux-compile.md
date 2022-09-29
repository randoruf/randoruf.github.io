---
layout: post
title: "Linux 内核编译 和 版本锁定"
date: 2022-03-21
tags: [cs,linux]
---


Linux 编译还挺麻烦。本人还比较菜，不知道哪种方法才比较正确。 

* TOC
{:toc}



## 删除内核

删除 `/boot/` 目录下相关的内核镜像，然后更新一下启动项。

[Linux 系统下删除无用的旧内核 - Ming's Blog (inkuang.com)](https://blog.inkuang.com/2019/317/)

可以查看一下当前装了什么内核镜像 (可能当初 `make -deb-pkg ` 才会有这个选项，如果是 debian 系的话，还是比较推荐生成 deb 包)

```bash
dpkg --list | grep linux-image
```

可以直接用 apt 管理

```bash
sudo apt purge linux-image-?????
```

如果当初是 `make install` 安装的话，就手动删除相关的内核文件 (`initrd.img`, `System.map`, `vmlinux `, 后面都有版本名) 就好了，然后更新一下 `initrd ` 啥的，手动更更新吧。。。。

```bash
sudo update-grub
```

由于安装内核也会在 `update-initramfs` 加入内核的信息。

* [linux kernel - Error in updating initramfs in ubuntu 20.04 - Unix & Linux Stack Exchange](https://unix.stackexchange.com/questions/667636/error-in-updating-initramfs-in-ubuntu-20-04)
* [update-initramfs selects wrong kernel](https://unix.stackexchange.com/questions/274115/update-initramfs-selects-wrong-kernel)
* [Running a script on kernel upgrade - Raspberry Pi](https://forums.raspberrypi.com/viewtopic.php?t=227287)

最后也需要在 `/var/lib/initramfs-tools/` 删除不用的 kernel 。

或者 `update-initramfs -ck KERNEL_VERSION`


## 锁定 Linux 版本

要十分小心，因为 `sudo apt upgrage` 会更新内核版本。

可以锁定系统的版本。因为要做实验，系统这样更新 kernel 就很混乱。

正常用户就无所谓了。

```bash
uname -r 
>> 5.4.124-generic 
sudo apt-mark hold 5.4.124-generic
```

## 关闭 Crash Report 

这个功能好像没什么用。有问题直接去 Ubuntu 的 forum 去问就好了。

<https://www.youtube.com/watch?v=6GYgrnZUI6Q>

* 去 `/var/crash` 下删掉所有 `.crash` 的文件
* 修改 `/etc/default/apport` 把 `enabled=1` 改成 `enabled=0` 


## 学习 Linux 

[Gentoo update kernel on the T website (tiimmm.com)](https://tiimmm.com/subhtml/linux/gentooupdatekernel.php)

## 配置

[8.10. Compiling a Kernel (debian-handbook.info)](https://debian-handbook.info/browse/stable/sect.kernel-compilation.html)

>  If you copied the configuration from `/boot/`, **you must change the system trusted keys option, providing an empty string is enough: `CONFIG_SYSTEM_TRUSTED_KEYS = ""`.**

## 编译

总体而言，

- 第一种是 `make` 命令编译。
- 第二种是 `make deb-pkg` 顺带生成一系列的 deb 包。

我比较倾向于第二种。

### 安装依赖

```bash
sudo apt-get install git fakeroot build-essential ncurses-dev xz-utils libssl-dev bc flex libelf-dev bison
```

#### Kernel Hacking 

这个功能是给 Kernel 开发人员看的，里面有个 compile with debug info 需要关闭。

否则会出现如下错误 <https://stackoverflow.com/questions/61657707/btf-tmp-vmlinux-btf-pahole-pahole-is-not-available>

```
BTF: .tmp_vmlinux.btf: pahole (pahole) is not available
Failed to generate BTF for vmlinux
Try to disable CONFIG_DEBUG_INFO_BTF
make: *** [Makefile:1106: vmlinux] Error 1
```

直接关闭 compile time debug info 或者安装这个东东

### make

[Gentoo update kernel on the T website (tiimmm.com)](https://tiimmm.com/subhtml/linux/gentooupdatekernel.php)

[wsl 安装内核头文件 (listera.top)](https://www.listera.top/wsl-an-zhuang-nei-he-tou-wen-jian/)

需要完整安装 vmzline, initramfs, linux-header 才算完整的安装。

```bash
cd /usr/src/linux

#保持干净源码
make clean
make mrproper
make distclean

#复制旧的系统已有的配置文件
cp /boot/config-????? ./.config 
#使用旧内核配置，所有新的配置选项设置为推荐（即默认）值
make olddefconfig
#查看微调内核配置
make menuconfig
#重新安装外部内核模块(可选)
make modules_prepare
#编译
make -j8
make headers -j8

#可选择安装或者不安装header (通常是向前兼容的，所以一般只能安装较新的 kernel)
make headers_install
#安装modules到/lib/modules下
make modules_install
#安装 initramfs 和 vmzlinux 到 /boot 下
make install
```

> 缺少头文件的情况在 WSL2 也会经常发生。
>
> ```bash
> #查看内核版本 
> uname -r
> #下载内核源码
> wget https://github.com/microsoft/WSL2-Linux-Kernel/?????? 
> tar vzxf *.tar.gz
> #安装依赖
> sudo apt install libelf-dev build-essential pkg-config bison build-essential flex libssl-dev libelf-dev bc
> #配置(复制旧配置)
> cd WLS2*
> zcat /proc/config.gz > .config 
> #编译(仅编译头文件)
> #make -j$(nproc)
> make headers -j$(nproc) 
> #安装(仅安装头文件)
> #sudo make install
> #sudo make modules_install
> sudo make headers_install
> ```
>
> 这样 vscode 就可以自动识别 **Linux API**  (也就是 system call ) 了

### make deb-pkg

主要可以参考 Kali 的做法。

- [Recompiling the Kali Linux Kernel - Kali Linux Documentation](https://www.kali.org/docs/development/recompiling-the-kali-linux-kernel/)
- [8.10. Compiling a Kernel (debian-handbook.info)](https://debian-handbook.info/browse/stable/sect.kernel-compilation.html)

Kali 的做法更好，能够顺便生成 header, image 。这样即使改了 `local version` 在用 `dkpg-query linux-header-$(uname -r)` 也不会出错。

- [Recompiling the Kali Linux Kernel - Kali Linux Documentation](https://www.kali.org/docs/development/recompiling-the-kali-linux-kernel/)

解压源码

```
sudo tar -xvJf archive.tar.xz
```

一般而言，应该是 `-xzf` 或者 `-xJf` 。

- [linux - difference between tar -xzf and tar xjf ? How do we determine that what combination should be used in order to extract something(.tar) - Unix & Linux Stack Exchange](https://unix.stackexchange.com/questions/427193/difference-between-tar-xzf-and-tar-xjf-how-do-we-determine-that-what-combinat)
- 如果没有带上 `z` 或者 `J` 的话，解压速度会非常慢。具体压缩的算法视乎 gzip 还是 bzip2 而定。

比较新的 Linux Kernel 用了 zstd 压缩。要安装

[command-not-found.com – zstd](https://command-not-found.com/zstd)

有几种设置配置的方法

```bash
# 清除
sudo make mrproper
# 配置 .config 文件
cp /boot/config-????? ./.config
sudo make oldconfig
sudo make menuconfig 
sudo make clean 
sudo make deb-pkg -j8 LOCALVERSION=-kouka KDEB_PKGVERSION=$(make kernelversion)-1
```

记得用四核编译啊..................可以看到 一个 Kernel 的本体有 kernel (modules), image, 还有 headers。按照 [Recompiling the Kali Linux Kernel - Kali Linux Documentation](https://www.kali.org/docs/development/recompiling-the-kali-linux-kernel/) 把 header 也一起装就可以了。至于 libc 应该不需要。至此，如果有人让你检测是否安装了 Kernel Headers,  就不会再报错了。

```bash
dpkg-query -s linux-headers-$(uname -r)
```

> 什么是 Kernel Header ? [Linux-headers - Gentoo Wiki](https://wiki.gentoo.org/wiki/Linux-headers)
>
> The headers act as an **interface** between internal kernel components and also between [userspace](https://en.wikipedia.org/wiki/User_space) and the kernel.

### 可能遇到的问题

#### Secure Boot 

可能会因为没有证书而停止编译。网上很多人并不了解这个，要知道 Secure Boot 才知道 X509 certificate。

[Compiling the kernel 5.11.11 - Ask Ubuntu](https://askubuntu.com/questions/1329538/compiling-the-kernel-5-11-11)

Ask Ubuntu 的第二个答案就是自己创建证书 (不过还需要手动把 shim 文件之类的加到 Securte Boot Whitelist) 。一般自己用的话，把这个功能当成不存在就好 。。。

##### 自己签名

用 SSH 生成一个安全证书。只要**在 BIOS 将证书加入到白名单**就可以顺利启动。

<https://ubuntu.com/blog/how-to-sign-things-for-secure-boot>

<https://github.com/andikleen/simple-pt/issues/8>

##### 无证书 (unsigned)

<https://blog.ishikawa.tech/entry/2019/09/03/174858>

<https://wiki.debian.org/BuildADebianKernelPackage>

搜索一下所有公钥的配置选项

```bash
cat .config | grep ".pem" 
```

会搜出一堆使用公钥的东西，全部去掉即可 (Build 的时候会自动随机生成)。

```
CONFIG_SYSTEM_TRUSTED_KEYS="debian/canonical-certs.pem"
CONFIG_SYSTEM_REVOCATION_KEYS="debian/canonical-revoked-certs.pem"
# CONFIG_MODULE_SIG_KEY="certs/signing_key.pem"
```

替换掉后面的东西 (最后一个不需要删除，会自动根据 x509 生成这个文件。主要是 `canonical` 的文件我们是没有的)

```bash
sudo sed -i  "s/debian\/canonical-certs\.pem//g" ./.config
sudo sed -i  "s/debian\/canonical-revoked-certs\.pem//g" ./.config
```

最后一个不需要删除 (如果仍然缺少可以手动生成 `signing_key.pem` ，话说 GitHub 一下子就看出问题了，CSDN 那些人还说是缺少 packages....)

<https://github.com/andikleen/simple-pt/issues/8>

<https://blog.csdn.net/enlaihe/article/details/121947748>

## 与 Azure 联动

- Install Ubuntu as Hyper-V Generation 2 Virtual Machine 

  - <https://blog.matrixpost.net/install-ubuntu-as-hyper-v-generation-2-virtual-machine/>

  - (你可能需要自己做一个 x509 证书来搞 securte boot)

### 关于 Azure 上的内核配置

可以按照 Gentoo 的 configuration 开始

- Linux 参数配置推荐 <https://www.odi.ch/prog/kernel-config.php>
- Linux 参数详解 <https://breezetemple.github.io/2018/11/18/linux-kernel-configuration-analysis/>
- Gentoo 编译 <https://www.youtube.com/watch?v=NVWVHiLx1sU>
- 运行 `make oldconfig` 
  - (如果是新版本升级，会非常多的问题。但一般一直 Enter 用默认选项。)
- 开启所有 Hyper-V 的服务 (Gentoo 也有官方教程)
  - <https://wiki.gentoo.org/wiki/Hyper-V> 
  - <https://www.funtoo.org/HyperV_Kernel_Configuration>
- 可以在 HID input 那里关掉一大堆 input device 的 drivers （可以将编译时间大大缩短）

- 替换内核后，查看 Hyper-v 是否还在运行
  - <https://docs.microsoft.com/en-us/windows-server/virtualization/hyper-v/manage/manage-hyper-v-integration-services>
  - <https://access.redhat.com/articles/2443861>
  - <https://docs.microsoft.com/en-us/azure/virtual-machines/linux/create-upload-generic>
  - 查看 integration service from a Linux guest
    - 用 `lsmod | grep hv_` 查看 modules
    - `ps -ef | grep hv`

### 准备 VM 文件

- Prepare an Ubuntu virtual machine for Azure
  - [Create and upload an Ubuntu Linux VHD in Azure - Azure Virtual Machines - Microsoft Docs](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/create-upload-ubuntu)
- 上传 Azure VHD 可以看
  - [How to Bring Your Own Operating System to Azure with Virtual Machine Hard Disk Images (VHD) - YouTube](https://www.youtube.com/watch?v=fVwVq_RGwc0)

总结起来 (下面只是框架，需要跟 https://docs.microsoft.com/en-us/azure/virtual-machines/linux/create-upload-ubuntu 操作)

- 确保 Hyper-V Linux Integrated Service (LIS) 在开启状态 (`hv_bus` )

  - **较新的 Kernel 都有 Linux Integrated Service** ，为保险，检查一下 `.config` 有没有启动 Hyper-V 的 modules 即可。
    - <https://wiki.gentoo.org/wiki/Hyper-V>
    - <https://www.funtoo.org/HyperV_Kernel_Configuration>

- 安装 Azure Linux Tools 

  - ```bash
    sudo apt install linux-tools-common linux-cloud-tools-common linux-tools-generic linux-cloud-tools-generic
    ```

  - 否者会出现 Failed to start Load Kernel Modules 问题 。以及 kvp 错误。

    - <https://docs.microsoft.com/en-us/windows-server/virtualization/hyper-v/manage/manage-hyper-v-integration-services>
    - You have to install tools for `hv-kvp-deamon.service` 
    - 可以省略 "linux-azure linux-image-azure linux-headers-azure" are all for kernels 

  - (**技巧:** 可以通过系统日志 (journal) 查看 到底是哪里出错了)

  - <https://blog.csdn.net/weixin_30599769/article/details/101364442>

  - 比如 `sudo systemctl status systemd-modules-load.service` 会显示哪个服务失败了，上面会有 pid 。`sudo journalctl -b _PID=201` 就可以看到这个服务到底哪里错了

- 安装 Azure Linux Agent 

- 设置 root 密码

  - `sudo passwd root`
  - 切换到 root 登录
  - 删除当前用户 `userdel -r user's username`

- **Deprovison** 

  - 清除信息。

> **技巧**: 
>
> 可以利用 Switch 和 SSH 进行内网连接。用 ssh 操作虚拟机更方便 。
>
> 可以活用 GitHub 和 写`.sh`脚本 (需要 `chmod +x` 添加 execution 的权限)

## GRUB 启动项

<https://askubuntu.com/questions/216398/set-older-kernel-as-default-grub-entry>

**两种做法：**

- 需要知道顺序
  - `GRUB_DEFAULT="1>2"` 
  - 第二个选项 (Advanced options for Ubuntu)，第三个选项 (Ubuntu, with Linux 5.4.0-104-generic) 
- 需要知道名字 
  -  `GRUB_DEFAULT="Advanced options for Ubuntu>Ubuntu, with Linux 3.13.0-53-generic"`
  -  Look at the `menuentry` definitions in `/boot/grub/grub.cfg` 
     - 可以用 Vim 的搜索功能定位
     - However, it's quite likely that when the GRUB package is updated, the configuration is regenerated from the shards located in `/etc/grub.d/`
     - <https://unix.stackexchange.com/questions/338436/change-grub-menu-text>
  -  'Advanced options for Ubuntu'
     - 'Ubuntu, with Linux 5.16.14' 
     - 'Ubuntu, with Linux 5.4.0-104-generic'

打开 grub 的启动文件

```
sudo vim /etc/default/grub
```

改完后更新 

```
sudo update-grub
```
