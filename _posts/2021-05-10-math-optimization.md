---
layout: post
title: "非凸优化求解，多胞体，几何库"
date: 2021-05-08
tags: [optimization]
---

* TOC
{:toc}

---

最近看李娇扬博士的 [【AI TIME PhD AAAI-2】嘉宾：吴桐桐、李娇阳_哔哩哔哩 (゜-゜)つロ 干杯~-bilibili](https://www.bilibili.com/video/BV1X54y1h7qm) 

非约束多智能体运动规划才知道原来数学优化有很多 Library 。

- [jkchengh/s2m2 (github.com)](https://github.com/jkchengh/s2m2)
- [gurobi 高效数学规划引擎 | python3 配置、使用及建模实例 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/52371462)
- [pypoman · PyPI](https://pypi.org/project/pypoman/) - 凸多胞体的运算
- [Shapely · PyPI](https://pypi.org/project/Shapely/) - 2D 几何运算

大概发现这项工作都是**采用现有求解器**（没有发明轮子）。

核心部分也就 PBS (priority-based search) 。所以，一个研究人员是不会去碰底层的。



