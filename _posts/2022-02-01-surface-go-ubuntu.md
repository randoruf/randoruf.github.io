---
layout: post
title: "Surface Go 2 安装 Ubuntu"
date: 2022-02-01
tags: [cs]
---

---

## 安装 Ubuntu 

- 关掉 Secure Boot 
- 关掉 Bitlocker (直接在 Setting 搜 device encription)
- 正常安装 Ubuntu 的流程
  - 由于 Surface Go 2 没有键盘，在创建用户的时候会被拦下来。
  - 此时 **快速双击** 就就可以**选中文字**，复制以后就可以粘贴到密码区。
- 在 Windows 里面查 recovery , start-up (advanced) 重启。
  - 在 Use a Device 那里选 **Ubuntu** 。
  - (自从换了 UEFI 以后，Ubuntu 竟然学会主动保留 Windows Boot Manager， 以前可是直接换掉，连怎么卸载 Ubuntu 不能)，装 Ubuntu 完全不像 2017年我那时候那么麻烦了。  

## 安装 Intel SGX SDK 



