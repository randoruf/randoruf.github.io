---
layout: post
title: "SGX-LKL 安装笔记"
date: 2022-05-16
tags: [cs,os,sgx]
---

要安装 Intel-SGX Linux Driver 。

注意因为 SGX Driver 需要 Linux Header， 所以如果换了 kernel ，就要重新 make 和 install SGX Linux Driver 

<https://github.com/0xabu/linux-sgx-driver/tree/sgx2>

装完之后还要去装 dcap 

<https://github.com/0xabu/linux-sgx-driver/tree/sgx2_dcap>

之后按照 SGX-LKL 的 Github 安装就可以了。

安装 OpenEnclave 的时候可能会出错，但已经装过的话应该没问题。

---

然后因为 docker 需要 sudo 权限，

sgx-lkl 的很多命令需要运行 docker，但是又不能给 sgx-lkl 的 sudo 权限 (具体原因不知道为什么，反正我试了就出错)

弄出来的加密镜像，需要先把 root 权限转换到普通用户权限，之后运行就不会出错。否则会出现 

```
Can't mount disk (VFS: Can't find ext4 filesystem)
```

