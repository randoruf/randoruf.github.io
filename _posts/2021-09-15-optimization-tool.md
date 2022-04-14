---
layout: post
title: "最优化问题(Optimization) 与 多智能体规划问题(Multi-agent Planning)"
date: 2021-09-15
tags: [optimization, ai, math]
---

一定要自学《最优化理论》，这个肯定能用到，做 Research 毕设的时候，深感我数学基础太薄弱了。

时间都花在写代码上了.... 

大概查到这是国内数学建模竞赛的内容.... <https://www.zhihu.com/question/19714813>



## 多智能体规划问题

其实完全可以把 ***Multi-agent Planning*** 的问题抽象为一个 Game Playing 问题。

可以看看 Matlab Optimization Toolbox 可以大致了解一下， 最优化问题为什么重要。

与生活息息相关，比如工厂调度等等。

<https://au.mathworks.com/help/optim/getting-started-with-optimization-toolbox.html>

- linear programming (LP), 
- mixed-integer linear programming (MILP), 
- quadratic programming (QP), 
- second-order cone programming (SOCP), 
- nonlinear programming (NLP), constrained linear least squares, nonlinear least squares, and nonlinear equations.

![](/shared/imgs/5c74acffa3e70.jpg)

## 极小极大问题

<https://baike.baidu.com/item/极小化极大/18934915>

![image-00030915171205872](image-00030915171205872.png)

<https://blog.csdn.net/qq_36890370/article/details/107904930>

![img](/shared/imgs/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM2ODkwMzcw,size_16,color_FFFFFF,t_70.png)

这个很明显就是 “有限制的极小极大问题模型”。

就是最远求点的距离尽可能小（曼哈顿距离）。

## 待读书单 

- 《Artificial Intelligence - a modern approach》
- Matlab Optimization Tool 
- 最优化理论

