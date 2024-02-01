---
layout: post
title: "Ubuntu 安装 驱动程序(kernel module)"
date: 2020-10-14T00:20:00Z
tags: [linux]
---



安装 Linux 的时候了解了很多没有的东西， 

比如 **EFI 和 Security Boot**, **Kernel Module**, 还有各种各样奇怪的东西。

---

一般电脑需要把 Linux 的 efi 加入到 Security Boot 上， 这个可以在 BIOS 系统搞。 

而 苹果的 Recovery mode 也有类似的设定， 设置到允许非苹果的 **第三方Operating system 启动**。 

否则根本不会把 efi 加入。就算安装成功，也会提示 `unsigned XXXX` 。然后启动失败。 



还有什么内核编译啊，吧啦吧里的。 什么更新内核就需要重新编译所有 Kernel modules  。

都是浅尝则止。 



附上如何加载 kenerl module 笔记。 

- [内核模块的插入和删除](https://www.bilibili.com/video/av41629905/) 
  - 第一步 `make` 编译 (一般有 Makefile， 里面会自动连接 Linux header file 。但是其实我并不懂什么是 linux header， 看来需要去补一补操作系统)
  - 第二步 插入 `.ko` 文件到系统 ， 用 `sudo insmod ????.ko` 
  - 第三部 查看 kernel module 是否运行正常 `lsmod ` 
  - 移除模块 `sudo rmmod ????` 
  - 其中 `????`  代表模块的名字
  - 如果要快速查看**系统日志**， `dmesg`
- [Linux内核模块的安装与卸载](https://blog.csdn.net/weiyidemaomao/article/details/19327159)



---

### Linux 分区方案

- 首先分区。。。当然什么格式并不重要
- 然后进入 Ubuntu 的启动盘， 在安装方案时选择 "Something else" 自定义分区方案（不然你的 Windows 或者 Mac OS 就没了） 
- 此时， 对着不重要的分区（千万别把苹果的分区删掉了）点下方的**减号 (-)**，
- 然后新建分区, **选择 Logical** (否则 primary 会把苹果的分区挤掉) ， **Mountpoint 直接全部选择 root** (显示为 `\`)   ， 因为 Boot loader 会自动安装，没有必要新建一个 `\boot` 。而0202年的电脑内存一般都是 16 GB 起跳， swap area 我觉得毫无意义， 反正基本用不完，用得完也不想虚拟内存。
- **最重要的一步** ： ***Device for boot loader installation 一定要选择 刚才新建的 root 分区 (`\`)*** ， 否则会破坏掉苹果原来的启动， 大部分 Youtube 上没技术含量的教程都是 默认的 `/dev/sda` 即整个硬盘。 如果你选这个， 下次想删掉 Linux 就麻烦了。 具体怎么删除可以看一下以前的 post, 有记录如何在苹果上删除 efi 启动项， 至于硬盘上的 linux 如何删除？这个有一个小技巧， 可以用 Linux Booter （**刻录在 u 盘的 livecd ubuntu**） 把 linux 分区格式化为 NTFS 。 然后进入 MacOS ，此时 Boot Camp Assisstant 会把这个分区错误地识别为 Windows， 问你是否移除并合并。 

---

### Linux Bootable USB 

Windows 下比较简单，可以看官方教程。 

Linux 下大概可以用 `gdd` 

```shell
diskutil list 
diskutil umountDisk /dev/diskX
sudo gdd bs=4M if=ubuntu-20.04-5.6.10-mbp.iso of=/dev/diskX conv=fdatasync status=progress
```

一定要小心数学 `X` ， 把苹果的分区写入就麻烦了。 跟 `sudo rm -rf /` 有异曲同工之妙。 以前还有人故意说这个是清理垃圾的命令。。。。。

---



  

