---
layout: post
title: "Header File Include Guard"
date: 2022-01-26
tags: [cs,cpp,compiler]
---

---

[#pragma once与 #ifndef的区别 - 简书 (jianshu.com)](https://www.jianshu.com/p/713ea80b8c5a)

为了避免同一个文件被include多次

- `#ifndef` 方式
  - 利用宏名字来区分 header files (如果两个文件的**宏名相同**就会撞车，导致少 include 一个文件)
  - 常见于大部分编译器，可移植性更强。
- `#pragma once` 方式
  - 指物理上的一个文件只会被包含一次 (但是如果某个头文件有**多份备份**，即使内容相同，由于编译不会去检查内容，也会出现撞车现象，导致少 include 文件)
  - 常见于 MSVC 编译器。
- 一般而言 `#pragma once` 更快，因为不需要打开文件，只需要检查是不是同一个地址(同一个文件)。
- 而 `#ifndef` 需要打开文件才能检查宏名





