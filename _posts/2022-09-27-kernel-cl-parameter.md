---
layout: post
title: 'The Kernel Command-Line Parameters'
date: 2022-09-27
tags: [linux]
---

* TOC 
{:toc}

---

## Links or References 

* *Linux Kernel in a Nutshell* - Chapter 6 Kernel Boot Command-Line Parameter Reference
* <https://www.kernel.org/doc/html/v5.4/admin-guide/kernel-parameters.html>

## What is Kernel Parameters? 

There are three ways to pass options/arguments to the kernel and control its behavors: 

* When building the kernel, in the file `.config` via kconfig
* When starting the kernel. It is invoked from a boot file such as GRUB or LILO configuration. 
* At runtime, by writing to files in the `/proc` and `/sys` directories. 


## 疑问

* 为什么启用 `pic=nomsi` 会导致网络失去链接? 



## 其他

### I/O Schedular Tuning 

* <https://www.cloudbees.com/blog/linux-io-scheduler-tuning>
* <https://access.redhat.com/solutions/5427>


### PCI subsystems 
 
* <https://access.redhat.com/articles/15937>

