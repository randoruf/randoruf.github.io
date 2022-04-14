---
layout: post
title: "IP Classes - IP 地址的分类"
date: 2021-08-28T00:20:00Z
tags: [network]
---



微软文档真是个宝库，除了 C++ 以外，还有其他也有

***Network classes*** <https://docs.microsoft.com/en-us/troubleshoot/windows-client/networking/tcpip-addressing-and-subnetting#network-classes>

Class A, B, C 的 default subnet mask 不太一样。当然里面也介绍了 subnet classes 

注意 Class A, B, C 都是并行存在的，只要看第一位就知道属于哪种网络了。 

IP 地址分为 ***Network Address*** + ***Host Address*** 两个部分。

- Network Address 一定以 0 结尾 (代表一个网络)
- Host Address 以 1 为起始值

通常需要 subnet mask 来区分 local host 还是 remote host 

- local host 不用经过 default gateways, 在 local subnet 就可以了 (可以把 gateway 理解为门卫)
- remote host 就需要 forward the packet to the default gateway

## subnet mask  vs. network classes 

<https://www.bilibili.com/video/BV19E411D78Q?p=48>

<img src="/shared/imgs/image-20210828143425332.png" alt="image-20210828143425332" style="zoom: 50%;" />

二级 IP 地址 : network classes 

三级 IP 地址 : subnet mask 

(如果 ISP 只给你 Class C ,可用 host 只有 $$2^8 - 2 = 254$$ , 有时候显然不够用， 如何拓展更多的 host ? 答案就是 subnet mask. )

Oracle - Network Classes <https://docs.oracle.com/cd/E19504-01/802-5753/planning3-78185/index.html>

除了 subnet mask ， 还有 CIDR (cider) ，即纯粹的掩码。

## Packets vs. datagrams

**分组 (packet)** 通常指 **数据报 (datagram)** **分片** 之后的结果 (比如 Ethernet 的 **MTU** )。

如果 数据报 超过了 MTU , 需要***在 网络层 分片*** (不然无法向下)。

