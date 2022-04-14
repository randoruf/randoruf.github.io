---
layout: post
title: "Sampling-based Kinodynamic Planning"
date: 2021-04-27
tags: [motion_planning]
---


* TOC
{:toc}
---

## Randomized Sampling RRT

这个比较著名了， 2000年由 RRT 的作者Steven M. LaValle 和 James Kuffner 提出。

就是随机取控制输入 (random control inputs) 。想法很简单（虽然会用**空间采样**取最接近的）。



## Closed-Loop RRT 

在2008年左右由 MIT 的无人车比赛首次出现。据说那辆无人车写了10万行代码。

对于非完整约束的系统，约束无法去除; 此时在构型空间中采样得到的轨迹可能不满足约束，比如自行车模型。
            此时RRT 通常直接采样控制输入，也就是说控制输入是采样得到的。**但也有采样位置空间的RRT，比如Closed Loop RRT采样的是位置空间**。但是采样的位置点可能不具有可行性，此时**可以将采样的构型作为参考输入，然后由 Pure Pursuit，PID，或MPC等方法计算 control input，再由控制输入量生成可行的路径**。在控制量的生成中考虑了非完整约束，故生成的路径也是可行的。该方面可以看看Closed loop rrt相关的论文，比如“Motion Planning in Complex Environments using Closed-loop Prediction”。

https://ran.moe/shared/pdf/docs/seungwook_lee_presentation_slide.pdf

作者：前前后后左左右右
链接：https://www.zhihu.com/question/268419822/answer/502054679
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

​			如果你思考一下 PID 通常是什么就会明白了。PID 通常需要一个**参考值** (即构型空间的随机点) 和 当前状态，然后计算并返回一个 control command (应该加大电压还是减少电压才能从当前状态达到参考值， 误差自然是 e = reference - current state)。 

![](/shared/imgs/feedback_motors.png)

![](/shared/imgs/Keep-Temperature-Constant-Using-PID-Controller.png)

当然还有 Optimal Control ， 那种就比较高级了， 用了 State Space 的线性化的技巧， 那个就要考虑 *controllability* 和 可观察性之类的，反正就是等于搞了一个 Controller ， 但你能用 MPC 已经不错了， 那种都是专门学 Control 的人采用的。

记住 Local Controller 本来的任务就是： 给定**参考值**和**当前状态**，计算 control input 。



## Geometric RRT

2012年左右在一个韩国人提出，想法也很简单， 

- 在 Sampling 的时候， 除了考虑 step size 还会考虑 steering angle range 。 
- 用 B-spline 连接任何两个 state 
- step size 还会随机（比如分三层 layer ）

可以看论文，很容易懂。[An efficient Spline-based RRT path planner for non-holonomic robots in cluttered environments | IEEE Conference Publication | IEEE Xplore](https://ieeexplore.ieee.org/document/6564701)

当然， 最弱智的方法就是 1998年提出的 Reeds Sheep Curve , 就是汽车总是有最大 steering angle (-maxAngle, 0, maxAngle) , 然后速度只有 (-1, 0, 1) 。 这种方法也可以连接空间中任意的 state 。 

缺点就是出来的 path 的曲率通常很大,  不太符合一般的驾驶习惯。但可以 Post-processing 的技巧光滑路径，我记得上次看到博世的一篇论文有一个超级牛逼的光滑路径的算法（用了各种优化技巧）。