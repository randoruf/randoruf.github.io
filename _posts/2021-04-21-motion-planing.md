---
layout: post
title: "路径规划算法的本质"
date: 2021-04-21
---


* TOC
{:toc}
[六. 勇者斗恶龙 - How to Learn Robotics (gitbook.io)](https://qiu6401.gitbook.io/how-to-learn-robotics/dragonquest)

![img](/shared/imgs/LZebc7Fa_Uk1RuGvcDr_2FChineseFactory.jpg)

当你看到还有非常多与你我同龄的人在工厂里做着重复、枯燥的工作的时候，你会有强烈的感觉：「这就是恶龙！」



## 规划算法的经典

看 Planning Algorithms 那本书，少有的经典之作。

把里面的练习都做一遍，你就有去自动驾驶公司实习的能力了。

<http://lavalle.pl/planning/>

<img src="/shared/imgs/61IM5u9N0lL.jpg" alt="Planning Algorithms: Amazon.it: LaValle, Steven M.: Libri in altre lingue" style="zoom:33%;" />



## 万物的起源 BFS 和 DFS 

BFS 是最基本的做法。
首先你要理解**搜索树**的概念。
路径规划大多数的问题的答案都可以通过 “搜索” 解决， 也就是所谓的“暴力运算”。



## 小学 Dijkstra's algorithm 

本质是 **Dynamic Programming + BFS** 。

(题外话：**动态规划**本身带有贪心的特性，可以看算法导论16章)

- **动态规划**最重要的是 **Bellman Equation**  (也就是**状态转移方程**，但这里故意不说，因为 Bellman Equation 在强化学习很有用，不要局限了动态规划的应用范围)

思考一个问题， 

- 你现在在某个点上，你有若干条可以来到这个点的 parent nodes 。
- 每个 parent node 上都有代价
- 你应该选择哪个点？

没错，**这就是 Dynamic Programming ， 核心思想就是 Choose Parent** 。

但是计算机教材都千篇一律， 把这个过程叫 “Relexation” ， 令人难以理解， 不就是 动态规划+贪心嘛， 神秘个啥啊。



## 实用 A\*

**搜索算法** 是 Deterministic 的。

A\* 是带有启发式函数的 BFS 。因为每次都选择总代价小的点， 所以**还是满足 Choose Parent 的特性**。

可以看 **Moveit!** 的介绍 (<https://moveit.ros.org/documentation/planners/>), 叫 Search-Based Planning Library (SBPL) 。

里面还说了轨迹优化的库，比如 Hamiltonian 什么鬼的， 但是那是数学优化问题， 并不是搜索问题。

(题外话，如果你想了解， 可以看 Optimal Control 和 数学优化的相关问题，但因为我不是数学系的，也不研究控制理论， 所以对这方面一知半解)。 



## Sampling-Based Algorithm 

本质就是对**连续空间**进行**离散取样**。

- 第一种叫 PRM 
  - 在空间中随机取样一个点， 把附近 k-nearest neighbours 都作为这个点的 Parent 。（多个）
  - 多次取样后， 就形成了 Graph (每个 node 都与附近的 vertice 有 edge) 。
- 第二种叫 RRT 
  - 在空间中随机取样一个点， 然后 the nearest neighbour 作为这个点的 Parent 。（只有一个）
  - 每次取样时， 由于是在空间中随机取样的，所以树上的 Vertices 会被空间中的随机点拉着生长，向空间中快速生长（核心就是 the nearest neighbour)



RRT 在1998 年被提出，一直到 10 年后的 2010 年，才有人想到把 Dynamic Programing 和 RRT 结合。 

这就是 RRT\* 。

- 在空间中随机取样一个点， 把附近 k-nearest neighbours 都作为这个点的 Parent 的**备选**。（多个备选）
- 类似 Dijkstra 的 Dynamic Programming 思想，但又区别于 PRM ， **只选最好的 Parent**。
- 到这里就是一般人能够想到的， 但原作者比较厉害就是多想到了 “Rewire” 的步骤。
  - 如果这个新加入的 Sample 能代价很低会怎样？
  - 是不是可以用类似 Dijkstra 的 Relexation 概念？
  - 从这个新的 sample 到树上的旧的点会不会代价更低？
  - Rewire 就是为  k-nearest neighbours  **重新选择 Parent** 。 



到这里， 你会发现所有**搜索算法的核心就是 Choose Parent** 。

前面说过了， 所有搜索问题的本质是 **搜索树/图** ， 

而**树/图** 实际上都可以用 Parent 和 Child 的特性维系， 其中树可以理解为**无环的图**。





## 启发式

启发式又叫 “拍脑袋” 算法。

很多简单的启发式就能发论文。

比如

- Informed RRT\* (很简单， 就是先求出个还行的解，然后优化这个解)
- 有的人还把 A\* 和 RRT 结合（你怎么不用 A\* 和 State Lattice 呢？ 说这样可以改变 Sampling Strategies 和 用 RRT 解决动力学约束问题， 说实话，其实还可以， 然后水了一篇毕业论文）
- 还有的人只是将别人的算法限制了 Nodes 的数量来降低内存损耗，就能发 B 类期刊（别小看 B类，足以让你去大厂实习了，有多人能发 SCI 呢？）

发论文很难，但又没有想象中难。 因为除了一些例如控制问题、机器学习真需要很深厚的数学功底，其他很多论文都是在灌水。 

更别说软工那种，写个 停车APP 就能发论文。所以要批判性地看论文， 特别是应用类的真的是重灾区，之前看 “机器学习识别心脏病的论文”， 真的无力吐槽， 看了浪费我时间， **所以文献其实不是越多越好**。



## 优化算法

其实就是数学优化。 

我想有时间专门学一下。

可以以 ECE3093 Optimisation estimation and numerical methods 为蓝本



## 机器人

可以看机器人的 **Robot, Vision and Control** 。 

- 参考 [二. 先修知识 - How to Learn Robotics (gitbook.io)](https://qiu6401.gitbook.io/how-to-learn-robotics/prerequisite)

  - **线性代数**:   这是控制论的基础，可以看 《Linear Algebra Done Right》 ,  Youtube 上有视频
  - **微积分**：机器人里，所有涉及到导数、积分、优化的地方，都需要用到微积分。所以，这门数学课也是一开始就绕不开的。我没有太好的视频推荐，不妨也看看 Gilbert Strange 的[《微积分重点》](http://open.163.com/special/opencourse/weijifen.html) ([Highlights of Calculus](https://ocw.mit.edu/resources/res-18-005-highlights-of-calculus-spring-2010/))？

- [三. 入门 - How to Learn Robotics (gitbook.io)](https://qiu6401.gitbook.io/how-to-learn-robotics/gettingstarted)

- [四. 实践 - How to Learn Robotics (gitbook.io)](https://qiu6401.gitbook.io/how-to-learn-robotics/dirtyyourhands)

- [五. 进阶 - How to Learn Robotics (gitbook.io)](https://qiu6401.gitbook.io/how-to-learn-robotics/advanced)

- 掌握 李代数，拉格朗日方程， 可以看 Planning Algorithms  和 CMU 的 Probabilistic Robotics 。 

- 然后回头看 Modern Robotics: Mechanics, Planning, and Control 和 宾州大学的 Cousera Robotics 课程

  