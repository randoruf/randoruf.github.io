---
layout: post
title: "【转】常用规划算法解析-凸优化（bezier曲线）篇"
date: 2021-07-01
tags: [optimization]
---



作者：steve

来源：知乎

> 凸优化的思想在轨迹优化中应用得非常广泛，并且在大多数场景中，凸优化是与其他的规划算法结合起来使用的，可以说凸优化只是解决规划问题的一个框架。例如上篇文章中，就介绍了一种结合了凸优化框架与多项式轨迹的传统minimum snap算法。但是这个算法有一个问题，就是它只能保证途经点（waypoints）是与障碍物无碰撞的，但是无法保证连接这些waypoints的多项式也与障碍物无碰撞，因此在环境复杂并且障碍物较多的情况下，可能保证了平滑性却无法保证安全性。

![Image](/shared/imgs/motion-planning-constraint-optimization-640.jpg)

为了解决这个问题，我们需要对凸优化的形式进行一定的改变，通常来说有两种方式：

- **一**是增加一个**硬约束（hard constraints）**，即在凸优化问题的约束条件中增加一系列的bounding box上下限约束；

- **二**是增加**软约束（soft contraints）**，即通过在代价函数中增加与障碍物的距离一项，从而使得轨迹能够尽可能地远离障碍物。这篇文章就想来详细阐述一下第一种方法，主要的算法思想来源于下面这篇论文。

> F. Gao, W. Wu, Y. Lin and S. Shen, "Online Safe Trajectory Generation for Quadrotors Using Fast Marching Method and Bernstein Basis Polynomial," 2018 IEEE International Conference on Robotics and Automation (ICRA), 2018, pp. 344-351, doi: 10.1109/ICRA.2018.8462878.



## 01 Bezier curve

在进入算法框架之前，先对于Bezier曲线进行一个简单的介绍。Bezier曲线的表示形式如下：

![Image](/shared/imgs/optimization-basic-01/640-20210701232048545)

![Image](/shared/imgs/optimization-basic-01/640-20210701232049222)

其中 <img src="/shared/imgs/optimization-basic-01/640-20210701232048563" alt="Image" style="zoom: 5%;" /> 为在t时刻的贝塞尔曲线系数， <img src="/shared/imgs/optimization-basic-01/640-20210701232048583" alt="Image" style="zoom:5%;" /> 为贝塞尔曲线的控制点，控制点的个数为贝塞尔曲线阶数加一。下面介绍贝塞尔曲线的几个重要性质，在后续的优化问题中会使用到。

1. 贝塞尔曲线总是起始于第一个控制点，结束于最后一个控制点，并且不经过剩下的任何控制点；

2. 贝塞尔曲线的时间参数t定义范围在[0,1]，即 <img src="/shared/imgs/optimization-basic-01/640-20210701232048600" alt="Image" style="zoom:8%;" /> ，因此在实际应用时，需要乘上一个比例因子对时间进行放缩；

3. **凸包性质**，贝塞尔曲线被包裹在其控制点连成的凸包中。我们可以利用该性质来约束控制点的位置，从而保证了曲线与障碍物无碰撞；

   

![Image](/shared/imgs/optimization-basic-01/640-20210701232048625)

4. 对贝塞尔曲线求导，其还是一个贝塞尔曲线，并且控制点可以用低阶贝塞尔曲线的控制点线性表示，如下式所示（其中  表示阶数)：

![Image](/shared/imgs/optimization-basic-01/640-20210701232048640)

这四个性质都非常重要，这也是贝塞尔曲线在路径规划中如此频繁使用的原因，希望读者好好理解一下，后续的优化问题构造都是基于这些性质上的。

同时，贝塞尔曲线其实可以映射至多项式曲线，可以说贝塞尔曲线只是一种特殊的多项式曲线，它们之间的转换关系可以用一个矩阵M来表示，即 。因此，这和传统的基于多项式的minimum snap算法在优化问题的构造上其实是很类似的。

![Image](/shared/imgs/optimization-basic-01/640-20210701232049284)

![Image](/shared/imgs/optimization-basic-01/640-20210701232330290)

## 02 代价函数的构造

代价函数可以设置为最小化参数化方程的k阶导数，如下式所示。论文中采取的构造方法是最小化参数方程的3阶导，具体的构造方法需要和实际问题及应用场景结合来看。

![Image](/shared/imgs/optimization-basic-01/640-20210701232048658)

我们从上式中可以看出，这其实是一个二次项的形式，即 <img src="/shared/imgs/optimization-basic-01/640-20210701232048888" alt="Image" style="zoom:8%;" /> . 其中 ![Image](/shared/imgs/optimization-basic-01/640-20210701232048702) 是优化问题中的优化变量，在这个问题中即为贝塞尔曲线在各个维度的控制点 <img src="/shared/imgs/optimization-basic-01/640-20210701232048718" alt="Image" style="zoom:5%;" /> ，而 <img src="/shared/imgs/optimization-basic-01/640-20210701232048727" alt="Image" style="zoom:5%;" /> 则为代价方程的Hessian矩阵。上面提到过贝塞尔曲线只在 <img src="/shared/imgs/optimization-basic-01/640-20210701232048773" alt="Image" style="zoom:5%;" /> 的范围内有定义，因此实际应用时需要乘上一个比例系数。如果我们将在 <img src="/shared/imgs/optimization-basic-01/640-20210701232048755" alt="Image" style="zoom:5%;" /> 维度上第 <img src="/shared/imgs/optimization-basic-01/640-20210701232048763" alt="Image" style="zoom:5%;" /> 段的贝塞尔曲线用 <img src="/shared/imgs/optimization-basic-01/640-20210701232048834" alt="Image" style="zoom:5%;" /> 来表示，而未乘以比例系数的曲线用 <img src="/shared/imgs/optimization-basic-01/640-20210701232049145" alt="Image" style="zoom:5%;" /> 来表示，并且 <img src="/shared/imgs/optimization-basic-01/640-20210701232554497" alt="640 (1069×207)" style="zoom:15%;" />  ，那么上面的代价函数就可以改写为：

![Image](/shared/imgs/optimization-basic-01/640-20210701232048889)



![Image](/shared/imgs/optimization-basic-01/640-20210701232048942)

这里，我还想多说一句关于代价函数的矩阵形式，上面提到过贝塞尔曲线和多项式其实存在着一个线性映射的关系的，因此这里的二项式其实可以这样来表示：

<img src="/shared/imgs/optimization-basic-01/640-20210701232048950" alt="Image" style="zoom:50%;" />

其中 <img src="/shared/imgs/optimization-basic-01/640-20210701232049009" alt="Image" style="zoom:5%;" /> 为多项式中的系数，因此 <img src="/shared/imgs/optimization-basic-01/640-20210701232049019" alt="Image" style="zoom:15%;" /> ，即 <img src="/shared/imgs/optimization-basic-01/640-20210701232049082" alt="Image" style="zoom:5%;" /> 可以通过上一篇文章中的Q值来计算得出。



## 03 约束条件的构造

对于分段轨迹的生成，往往我们需要施加一系列的约束来保证轨迹的平滑性、安全性以及动力学可行性。对于贝塞尔曲线来说，由于上述提到的几个性质，对于它的约束设计起来相对而言比较容易且直观。 

1.waypoints 约束

途经点的约束即为规划轨迹必须经过的路点，以及在某点必须达到的 ![Image](/shared/imgs/optimization-basic-01/640-20210701232049171) 阶导数值。对于一个固定的在第 ![Image](/shared/imgs/optimization-basic-01/640-20210701232049143) 段轨迹初始端的 ![Image](/shared/imgs/optimization-basic-01/640-20210701232049171)  阶导数，其等式约束可以表示为：

![Image](/shared/imgs/optimization-basic-01/640-20210701232049197-5145649.)

2. 连续性约束

对于分段构造的轨迹来说，需要保证在轨迹拼接处的 ![Image](/shared/imgs/optimization-basic-01/640-20210701232049225) 阶导数的连续性（ ![Image](/shared/imgs/optimization-basic-01/640-20210701232049250) ）,即：

![Image](/shared/imgs/optimization-basic-01/640-20210701232049251)

3. 安全性约束

由贝塞尔曲线的第3个性质凸包性我们可以得知，我们只需要保证贝塞尔曲线的所有控制点（即该优化问题中的优化变量）全部限定在安全区域内，那么曲线就一定不会与障碍物产生碰撞。对于安全区域的生成方式，可以参考freespace的相关方法，或者利用文章中所提到的飞行走廊的生成方法。最终利用控制点的上下界边界，可以构造出下式的不等式约束。

![Image](/shared/imgs/optimization-basic-01/640-20210701232049266)

4. 动力学约束

利用贝塞尔曲线的第3，4条性质，我们可以施加硬约束在轨迹的高阶导数上。例如，我们可以施加每个点的速度约束和加速度约束：

![Image](/shared/imgs/optimization-basic-01/640-20210701232049267)



## 04 优化问题的矩阵形式

最终，我们可以将上述的代价函数和约束条件整合起来，构造成一个标准的二次优化问题来进行求解。其中代价函数本身已经为二次项的形式，第1，3个约束可以通过对优化变量的定义域来设置（ ![img](/shared/imgs/optimization-basic-01/640-20210701234136093) ），连续性约束可以通过等式约束来设置（ ![Image](/shared/imgs/optimization-basic-01/640-20210701232049285) ），高阶的动力学约束可以通过不等式约束来设置（ ![Image](/shared/imgs/optimization-basic-01/640-20210701232049292) ），其中 ![Image](/shared/imgs/optimization-basic-01/640-20210701232049300) ，最终该优化问题可以写成下述的形式：

![Image](/shared/imgs/optimization-basic-01/640-20210701232049317)

写成这种形式后，就可以用各种二次优化的求解器进行求解了。



## 05 最终效果

我将该算法配合flight corridor在matlab中实现了一下，下面是具体的效果图：

![Image](/shared/imgs/optimization-basic-01/640-20210701232049309)

这是论文中的效果图：

![Image](/shared/imgs/optimization-basic-01/640-20210701232049380)

可以看到，该算法在可行驶区域内，生成的轨迹是比较平滑并且能保证无碰撞的。但同时我也觉得该方法由于没有将与障碍物的距离考虑进代价函数中从而构造一个软约束，其规划出的轨迹在可行驶空间较大的情况下，还是与障碍物过近了，这样会比较危险也不太合理。感兴趣的读者可以后续研究看看。

以上，就介绍完了基于贝塞尔曲线的凸优化算法，欢迎有疑问的读者在评论区留言，也欢迎大家点赞、关注、收藏，今后会不定期分享规划控制相关算法~
