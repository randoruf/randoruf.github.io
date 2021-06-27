---
layout: post
title: "伯克利自动驾驶的研究博客"
date: 2021-06-27
---









## Multi-agent Motion Planning 

- Decoupled 
	- Prioritized planning 
	- single-agent + post-processing 
- Centralized 
	- joint planning (planning algorithm 那本书有， 比如一个 agent 是三维， 那么两个 agent 就是六维， 和 机器人的 joint motion planning 一模一样，所以叫 joint planning)
	- 如果 李娇阳 的 CBS (conflict based search) , 都假设大家知道相互的位置， 本质是 space-time 



## 伯克利停车场 

[carla/PythonAPI/analysis at parking · MPC-Berkeley/carla (github.com)](https://github.com/MPC-Berkeley/carla/tree/parking/PythonAPI/analysis)

[Automated Driving Research Blog — Automated Driving (automatedcars.space)](https://automatedcars.space/home)

[Autonomous Parking of Vehicle Fleet in Tight Environments — Automated Driving (automatedcars.space)](https://automatedcars.space/home/2020/6/7/autonomous-parking-of-vehicle-fleet-in-tight-environments)

![image-20210627180557654](/shared/image-20210627180557654.png)

他们用的 Carla 模拟的， 比你搞的东西好看多了。

[Xu Shen - Fleet Parking (google.com)](https://sites.google.com/view/xushenssite/research/fleet-parking?authuser=0)

 [Autonomous Parking of Vehicle Fleet in Tight Environments - IEEE Conference Publication | IEEE Xplore](https://ieeexplore.ieee.org/abstract/document/9147671) 

这篇论文发了 2020 ACC (The American Control Conference), 这是 **控制领域世界级顶级会议**。

我都不知道原来我做的东西这么有价值。 

如果真的把我的 Closed-loop 技巧好，处理好 Dynamic Scenarios (in and out) 那不就妥妥的**顶会**吗？

还有 **IV 的录用率**

> IEEE IV 2018大会共收到来自34个国家的603篇论文，接收论文356篇，**录取率为59%**，
>
> 其中282篇Contributed paper，21篇SpecialSession Paper，53篇Workshops paper。





## 百度阿波罗

还有百度 Apollo 的自动泊车的优化框架也是这个实验室弄出来的

[Navigation in Tight Environments — Automated Driving (automatedcars.space)](https://automatedcars.space/home/2018/6/8/navigation-in-tight-environments)

[1711.03449 Optimization-Based Collision Avoidance (arxiv.org)](https://arxiv.org/abs/1711.03449)

[XiaojingGeorgeZhang/OBCA: Optimization-Based Collision Avoidance - a path planner for autonomous navigation (github.com)](https://github.com/XiaojingGeorgeZhang/OBCA)

![TrajReverseHOBCA25x.gif](/shared/TrajReverseHOBCA25x.gif)



## 优化算法

优化算法就很烦，要求有优化的基础， 起码要知道 slack variables 和 constraints 是啥玩意儿。

其实就是 ***Linear Programming*** 里面要学的玩意儿。

<img src="/shared/image-20210627215717753.png" style="zoom:50%;" />

[gophae的博客_CSDN博客-自动驾驶,Matlab,路径规划领域博主](https://yunchengjiang.blog.csdn.net/)

- [Hybrid A*论文解析(1)_gophae的博客-CSDN博客](https://yunchengjiang.blog.csdn.net/article/details/107344216)
- [Hybrid A*论文解析(3)_gophae的博客-CSDN博客](https://yunchengjiang.blog.csdn.net/article/details/107415479)
- [Hybrid A*论文解析(4)_gophae的博客-CSDN博客](https://yunchengjiang.blog.csdn.net/article/details/107598373)
- [Hybrid A*论文解析(5)_gophae的博客-CSDN博客](https://yunchengjiang.blog.csdn.net/article/details/109658857)
- [针对Hybrid A*论文解析(5)中的方法的一些验证_gophae的博客-CSDN博客](https://yunchengjiang.blog.csdn.net/article/details/109689728)

- [Apollo规划算法基于多边形分离的平滑分析（一） - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/74528043)
- [Apollo规划算法基于多边形分离的平滑分析（二） - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/74528875)

## DWA

[DWA泊车算法的实现_gophae的博客-CSDN博客](https://yunchengjiang.blog.csdn.net/article/details/107085729)

- 但是DWA的弊端时很明显的，**他对heading的实现是一个软约束**，并不能够很好的在终点结束时达到期望的heading 。这个问题在对终点heading很敏感的泊车功能中是非常大的（不能歪歪扭扭吧）。
- 