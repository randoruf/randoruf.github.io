---
layout: post
title: 'SGX-LKL-OE 安装指南'
date: 2022-09-13
tags: [sgx]
---

* TOC 
{:toc}

---

SGX-LKL 在安装过程中有些坑

以这个版本为基础 <https://github.com/lsds/sgx-lkl/tree/b6e838e0034de86b48470b6a6bf87d2e262e65c9> 


### SGX 安装指南

在安装 SGX-LKL 时, 需要先确保一下依赖已经安装

* Ubuntu 18.04 (5.4.x kernel)
* SGX Linux 2.10 套装 
  * <https://download.01.org/intel-sgx/sgx-linux/2.10/docs/Intel_SGX_Installation_Guide_Linux_2.10_Open_Source.pdf>
  * sgx_linux_x64_driver_1.35.bin
  * sgx_linux_x64_driver_2.6.0_602374c.bin
  * sgx_linux_x64_sdk_2.10.100.2.bin
  * SGX PSW 
* Cryptosetup 


#### 预先准备

安装如下工具

```
sudo apt-get install make gcc g++ bc python xutils-dev bison flex libgcrypt20-dev libjson-c-dev automake autopoint autoconf pkgconf libtool libcurl4-openssl-dev libprotobuf-dev libprotobuf-c-dev protobuf-compiler protobuf-c-compiler libssl-dev
```

还需要安装

```
sudo apt-get install cryptsetup cryptsetup-bin libcryptsetup-dev
```


#### 安装 SGX 工具

<https://download.01.org/intel-sgx/sgx-linux/2.10/docs/Intel_SGX_Installation_Guide_Linux_2.10_Open_Source.pdf> 

依照文档安装即可。

> 注意: 
> 必须按顺序安装 **SGX driver, SGX PSW, SGX SDK** 不允许跳过。


### SGX-LKL 安装指南

首先需要改掉 Openenclave 的默认驱动，然后再编译。

#### 下载 SGX-LKL 

```
git clone --branch oe_port --recursive https://github.com/lsds/sgx-lkl.git

cd sgx-lkl
```

#### 修改 Openenclave 的 SGX 驱动

SGX-LKL-OE 的 Openenclave 默认使用 SGX driver 1.33 。

但实际上 SGX driver 1.33 是不匹配的 Ubuntu 18.04 的最新 Kernel 5.4.x

所以需要手动把 Openenclave 的的 DCAP driver 从 1.6 升级到 1.7 

可以看看这个几个地方

* 旧版的 SGX driver 1.33 <https://github.com/intel/SGXDataCenterAttestationPrimitives/blob/DCAP_1.6/driver/linux/encl.c#L137>
* 新版的 SGX driver 1.35 <https://github.com/intel/SGXDataCenterAttestationPrimitives/blob/DCAP_1.7/driver/linux/encl.c#L136>

可以看到 `#if (LINUX_VERSION_CODE < KERNEL_VERSION(5,4,0))` , 证明新版的 kernel 需要使用 DCAP 1.7 

升级方法也很简单， 看这个 commit <https://github.com/openenclave/openenclave/commit/f3ba83aa8639d0bf96ae33b52ca9147f80361a9a>

把 `scripts/ansible/roles/linux/intel/vars/ubuntu/bionic.yml` 改成以下内容

```yml
# Copyright (c) Open Enclave SDK contributors.
# Licensed under the MIT License.

---
intel_sgx_w_flc_driver_url: "https://download.01.org/intel-sgx/sgx-dcap/1.7/linux/distro/ubuntu18.04-server/sgx_linux_x64_driver_1.35.bin"
intel_sgx1_driver_url: "https://download.01.org/intel-sgx/sgx-linux/2.10/distro/ubuntu18.04-server/sgx_linux_x64_driver_2.6.0_602374c.bin"
intel_sgx_package_dependencies:
  - "libprotobuf10"
```

#### Openenclave 的配置指南

```
cd openenclave
sudo scripts/ansible/install-ansible.sh
sudo ansible-playbook scripts/ansible/oe-contributors-setup.yml
```

> 可能会遇到 Python 报错，升级一下 pip 就可以了。


#### 编译 SGX-LKL

不要使用并行工作 (例如 `-j12`， 因为 Makefile 可能有 bug ，依赖关系不是写得很好，可能会出错)

```
sudo make DEBUG=true
```

#### 安装 SGX-LKL 

```
sudo -E make install
```

修改 `~/.bashrc`


```
# sgx sdk
source /opt/intel/sgxsdk/environment

# sgx-lkl 
export PATH="/opt/sgx-lkl/bin:$PATH"
```

> 注意: 
> 虽然官方文档是说 `PATH="$PATH:/opt/sgx-lkl/bin"`
> 但是实际上 SGX-LKL 也有类似的工具， 可以看 <https://github.com/lsds/sgx-lkl/tree/oe_port/src/vicsetup> 
> 
> "Vicsetup is an all-in-one replacement for these three Linux tools. It is intended for use within the SGX-LKL enclave image and has various limitations beyond this scope."
>  
> 所以必须保证 SGX-LKL 优先使用自身提供的 cryptsetup 工具。