---
layout: post
title: "Python 多线程 和 多进程"
date: 2021-08-18
tags: [python]
---



Python 由于 Global Interpreter Lock ，

- 在 multi-threading 的情况下无法充分利用多核性能
- 但 Python 多线程可以在 **IO密集型代码** 时，切换线程充分利用 CPU 
- 注意 Python 的 Global Interpreter Lock 不是线程安全的，因为会产生 Race Condition 
  - 就是 thread 1 可能会覆盖 thread 2 的结果 (看 <https://github.com/wolverinn/Waking-Up/blob/master/Python%20Handbook.md> 的例子)
  - 看例子的时候，要记得 Python 代码是要转换成 Assembly Language 
  - 也就是先把 内存值 存到 register 上面， 然后才能 ALU 运算
  - 如果 ALU 运算之前，时间片到了，那么 context 被保存 (register 的值也被保存)
  - 此时另一个 thread 2 对内存内的值修改，
  - 那么 回到 thread 1 后， **register 的值跟 内存 就不一样了**。
  - 就产生了 **race condition** 。





