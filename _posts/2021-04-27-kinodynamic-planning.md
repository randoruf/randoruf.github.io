---
layout: post
title: "Sampling-based Kinodynamic Planning"
date: 2021-04-27
---


* TOC
{:toc}
---

## Closed-Loop RRT

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

