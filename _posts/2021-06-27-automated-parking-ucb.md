---
layout: post
title: "伯克利自动驾驶的研究博客"
date: 2021-06-27
tags: [ai,motion_planning]
---













## Motion Planning 

[Intelligent Motion Laboratory at UIUC (illinois.edu)](http://motion.cs.illinois.edu/index.html)

伊利诺伊大学的运动规划官网， 有最新的科研成果。

[Robotic Systems  - Kris Hauser](http://motion.cs.illinois.edu/RoboticSystems/)

这本书也不错，说了 Obstacle 的 Convex Set 的概念。Optimization-based Motion Planning 都是把 Obstacle 的几何形状弄成 Convex polygon (convex set) , 然后优化的。 不要看到不懂的名字就慌了， 原理可能很简单的。





## Multi-agent Motion Planning 

- Decoupled 
	- Prioritized planning 
	- single-agent + post-processing 
- Centralized 
	- joint planning (planning algorithm 那本书有， 比如一个 agent 是三维， 那么两个 agent 就是六维， 和 机器人的 joint motion planning 一模一样，所以叫 joint planning)
	- 如果 李娇阳 的 CBS (conflict based search) , 都假设大家知道相互的位置， 本质是 space-time 

其实如果你学了 Linear Programming , 就会知道优化方法的本质是暴力法。但是会有规律地去尝试和收敛，计算速度比随机要快很多。就是 A\* 和 RRT 的区别，A\* 的本质也是优化。



### Conflict-based Search 

<iframe width="560" height="315" src="https://www.youtube.com/embed/KThsX04ABvc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

这个例子很好地说明了什么是 **CBS**, 就是撞了就从头开始规划。

其实这个方法没什么新意， 就是 Space-time Hybrid-A\*  ， 然后他自己给了个新名字 。 但别人就是进了腾讯做 Robotics Researcher Intern ，我也想进啊。

不过我看了 ICRA 2021 的入选文章，这篇论文好像并没有入选。



## 伯克利停车场 

[carla/PythonAPI/analysis at parking · MPC-Berkeley/carla (github.com)](https://github.com/MPC-Berkeley/carla/tree/parking/PythonAPI/analysis)

[Automated Driving Research Blog — Automated Driving (automatedcars.space)](https://automatedcars.space/home)

[Autonomous Parking of Vehicle Fleet in Tight Environments — Automated Driving (automatedcars.space)](https://automatedcars.space/home/2020/6/7/autonomous-parking-of-vehicle-fleet-in-tight-environments)

![image-20210627180557654](/shared/imgs/image-20210627180557654.png)

他们用的 Carla 模拟的， 比你搞的东西好看多了。

[Xu Shen - Fleet Parking (google.com)](https://sites.google.com/view/xushenssite/research/fleet-parking?authuser=0)

 [Autonomous Parking of Vehicle Fleet in Tight Environments - IEEE Conference Publication - IEEE Xplore](https://ieeexplore.ieee.org/abstract/document/9147671) 

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

![TrajReverseHOBCA25x.gif](/shared/imgs/TrajReverseHOBCA25x.gif)



## 优化算法

优化算法就很烦，要求有优化的基础， 起码要知道 slack variables 和 constraints 是啥玩意儿。

其实就是 ***Linear Programming*** 里面要学的玩意儿。

<img src="/shared/imgs/image-20210627215717753.png" style="zoom:50%;" />

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

[Lesson 4: Dynamic Windowing - Coursera](https://www.coursera.org/learn/motion-planning-self-driving-cars/lecture/PrN7r/lesson-4-dynamic-windowing)

- 就是 Sampling Control Space , 然后根据 Objective Function 选择好 control actions 。 没了。
- 考虑到电机可发挥的有限的加速度，**整个 velocity 搜索空间**减少到**动态窗口** (看下面文章的笔记)。
	- 在速度坐标系里搜索合适的速度 $$(v, w)$$
	- 该窗口仅包含**下一个时间间隔内可以达到的速度** （考虑**当前速度**和**最大加速度**， **注意刹车也叫加速度**）。
	- 动态窗口是以实际速度为中心的，它的扩展取决于可以施加的加速度。
	- $$V_r = V_s \cap V_a \cap V_d$$  
	  -  $$V_s$$ 叫 angular velocity  (就是一堆可选的速度， 不理解就想一下 $$ -10 < x < 10$$ 在 Cartesian Plan 是怎样的， 是不是瞬间觉得 DWA 是初中知识)
	  - 同理， $$V_a$$ 是 translation velocity 
	  - $$V_d$$ 才是 DWA 的精髓， 结合运动约束、几何约束
	- 对每条路径评价
	  - cost function 的设计才是核心， 具体就要看笔记和论文了。
	  - 但是自己玩玩的话， 这个随便搞
- [The Dynamic Window Approach to Collision Avoidance - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/70233164)
- [Difference between DWA local_planner and TEB local_planner - ROS Answers: Open Source Q&A Forum](https://answers.ros.org/question/274564/difference-between-dwa-local_planner-and-teb-local_planner/)





## Hybrid-State A\*

- Coursera 的课就有[Lesson 3: Trajectory Rollout Algorithm - Module 6: Reactive Planning in Static Environments - Coursera](https://www.coursera.org/lecture/motion-planning-self-driving-cars/lesson-3-trajectory-rollout-algorithm-3toeN)
- 还有 Matlab 的 [Hybrid A* path planner - MATLAB - MathWorks Australia](https://au.mathworks.com/help/nav/ref/plannerhybridastar.html)
- 原文过去复杂是因为考虑了很多优化策略。可以看到传统的 DWA 并没有 (Reversing 方向， 因为 Holonomic 机器人根本不需要)。



## Local Path Planning 

[Lesson 1: Parametric Curves - Coursera](https://www.coursera.org/learn/motion-planning-self-driving-cars/lecture/l4Aab/lesson-1-parametric-curves)





## ORCA 

在学习 ORCA 需要先学习 DWA  

至少要明白 **速度坐标系** 的概念。

Velocity Obstacle 的概念和 DWA 十分类似。

[论文笔记《Reciprocal Velocity Obstacles for Real-Time Multi-Agent Navigation》 - 陪你度过漫长岁月 (meltycriss.com)](http://www.meltycriss.com/2017/01/13/paper-rvo/)

[论文笔记《Reciprocal n-body Collision Avoidance》 -  陪你度过漫长岁月 (meltycriss.com)](http://www.meltycriss.com/2017/01/14/paper-orca/)

然后可以看 Global + Local 

[A Combination of Theta*, ORCA and Push and Rotate for Multi-agent Navigation (arxiv.org)](https://arxiv.org/abs/2008.01227)

这个作者就有 [PathPlanning/ORCA-algorithm: Implementation of ORCA algorithm (github.com)](https://github.com/PathPlanning/ORCA-algorithm)

也有官方实现 [RVO2 Library - Reciprocal Collision Avoidance for Real-Time Multi-Agent Simulation (unc.edu)](https://gamma.cs.unc.edu/RVO2/)



