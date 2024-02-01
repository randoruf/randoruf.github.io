---
layout: post
title: "Control Theory 101"
date: 2021-04-28
tags: [control]
---

* TOC
{:toc}

---

一直觉得自己没把 Control Theory 学明白。

连 Controller 的角色都没搞清楚， 没看懂 Closed-Loop RRT 。 

结果 Controller 的角色其实很简单

- 给定**参考值**
- 可以**评估当前状态**的 Estimator (传感器之类的)
- 计算**控制输出**

比如车速， 要控制稳定的车速，首先要有参考车速，然后可以知道当前车速（否则就不叫 Closed-Loop 了）， 然后计算油门的踩下时机。

了解这点后， 你就明白其实 Controller 的角色类似 Boundary Value Problem Solver ，

需要计算连接空间中两点的控制命令( control command )， 但由于 Controllability 的问题，实际上，Controller 不一定可以计算出答案， 但有大概答案就足够了 (例如 PID 也不是马上能达到 Reference Value ) 。

然后就可以去看简单的 Control 课了，要重新学了。。。。。

<iframe width="560" height="315" src="https://www.youtube.com/embed/videoseries?list=PLMrJAkhIeNNR20Mz-VpzgfQs5zrYi085m" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

看完再去看书吧。

