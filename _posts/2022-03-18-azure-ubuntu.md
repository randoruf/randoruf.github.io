---
layout: post
title: "在 Azure 上部署 Ubuntu Server VM"
date: 2022-03-18
tags: [cs,os,cloud]
---

一般而言，直接创建 VM 就可以了。

## 参考资料

但比如你想在 Azure 用 Gentoo / Mint ，就要参考以下几篇文章

- [Create and upload a Linux VHD - Azure Virtual Machines | Microsoft Docs](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/create-upload-generic)
- [Create and upload an Ubuntu Linux VHD in Azure - Azure Virtual Machines | Microsoft Docs](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/create-upload-ubuntu)

由于有特殊需求，要对 Linux Kernel 源码修改一点东西。

所以想编译一个 generic kernel 到 Azure 上 (实际上不推荐，但因为某些特殊原因，Azure-tailored Linux Kernel 肯定是效率最高的)。

总结一下步骤

### Step 1 - HyperV 

推荐使用 HyperV 。**因为 HyperV 的 Swicth 非常方便 Internel Network 直接用 SSH 调试。**

具体方法是先登陆 VM , 系统会返回 IP 地址 (实际上是 Private IP address) 

然后可以直接对这个地址链接 (估计是 NAT 技术)。

而且用 HyperV 创建虚拟机可以自动加载 HyperV Modules / Drivers 

### Step 2 - 替换源

Before editing `/etc/apt/sources.list`, it is recommended to make a backup:

```bash
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak
```

Ubuntu 18.04 and Ubuntu 20.04:

```bash
sudo sed -i 's/http:\/\/archive\.ubuntu\.com\/ubuntu\//http:\/\/azure\.archive\.ubuntu\.com\/ubuntu\//g' /etc/apt/sources.list

sudo sed -i 's/http:\/\/[a-z][a-z]\.archive\.ubuntu\.com\/ubuntu\//http:\/\/azure\.archive\.ubuntu\.com\/ubuntu\//g' /etc/apt/sources.list

sudo apt-get update
```

### Step 3 - Install Azure Linux Tools

由于没有 Azure Linux Kernel 的源码，这里就不装 Kernel 了。但工具还是要装的。

```bash
sudo apt install linux-tools-common linux-cloud-tools-common linux-tools-generic linux-cloud-tools-generic
```

### Step 4 - 跟着教程

跟着 https://docs.microsoft.com/en-us/azure/virtual-machines/linux/create-upload-ubuntu 

直到 第12步的 Deprovision 停下来。

此时需要先删除掉当前用户，用 `root` 登陆，再 Deprovsion 

```bash
sudo passwd root 

sudo su 

deluser -r YOURNAME
```

可以 Deprovision 了 

```bash
sudo waagent -force -deprovision+user
rm -f ~/.bash_history
export HISTSIZE=0
logout
```

继续跟着教程把 `VHDX` 转换即可。

## 关于编译内核

Linux Menu Config 有 3000 多个参数。我直接用 Linux Azure 的参数配置。

可以把 `.config` 复制过来，对比一下。

## Azure & Grub 

看 [用于 GRUB 和单用户模式的 Azure 串行 - Virtual Machines | Microsoft Docs](https://docs.microsoft.com/zh-cn/troubleshoot/azure/virtual-machines/serial-console-grub-single-user-mode) 

主要是 `GRUB_TERMINAL="serial console"` 才能正确输出到 Serial Console 上。

```
....

GRUB_DEFAULT=0
GRUB_TIMEOUT_STYLE=menu
GRUB_TIMEOUT=8
# GRUB_HIDDEN_TIMEOUT=1 
GRUB_CMDLINE_LINUX_DEFAULT="console=tty1 console=ttyS0,115200n8 earlyprintk=ttyS0,115200 rootdelay=300 quiet splash"
GRUB_TERMINAL="serial console"

.... 
```



