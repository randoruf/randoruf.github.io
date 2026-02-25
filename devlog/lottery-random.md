---
layout: post
title: 'Lottery Random Number Picker' 
---

## Python 版本

### 随机数来源 

这是一个非常有意思的想法！相比于计算机内置的伪随机数生成器（PRNG），使用物理世界中的“真随机”熵源（如大气噪声或量子波动）确实能让你的号码听起来更有“天命感”。

虽然 Cloudflare 的熔岩灯墙（Entropy Lighthouse）并没有直接对外的实时 API，但我们可以调用同样权威的

-  **澳大利亚国立大学（ANU）量子随机数服务器** 或者
-  **RANDOM.ORG（基于大气噪声）。**
-  其实 Linux 系统的 `/dev/urandom` 也会收集硬件噪声（磁盘波动、指令时间差异等），这在本质上也是一种物理随机。

### 核心原理解析

- 真随机源 (Entropy Source)：
  - 代码通过 requests 访问 ANU 的 API。他们通过测量真空零点能的量子涨落来产生数据，这被认为是宇宙中最纯粹的随机来源。
  - 如果你想模拟 Cloudflare 的逻辑，其实 Linux 系统的 `/dev/urandom` 也会收集硬件噪声（磁盘波动、指令时间差异等），这在本质上也是一种物理随机。
- 大乐透逻辑：
  - 前区：从 1 到 35 中不重复地抽取 5 个数。
  - 后区：从 1 到 12 中不重复地抽取 2 个数。
  - 使用 `self.rng.sample` 确保了号码不会重复，并且 `sorted()` 让输出符合购票习惯。

### 安全性与确定性：

虽然种子是“真随机”的，但一旦种子确定，生成的序列就是确定的。这意味着如果你保存了那个数字（Seed），你就能重现这一组号码。

### 进阶建议
- 多源融合：你可以同时获取 ANU 的量子随机数和 NIST（美国国家标准与技术研究院）的 Beacon 随机数，把它们做异或（XOR）运算，得到一个“双重保险”的终极种子。
- 图形化：如果你想看“熔岩灯”那种视觉效果，可以用 Python 的 matplotlib 库把这些随机数画成散点图，随机性越好，点阵越均匀。
- 温馨提示：随机数发生器只能保证过程的“公平”，不能提高中奖的“概率”。买彩票请保持理性心态，就当是给体育公益事业做贡献了！

你想让我帮你把这个程序改写成支持更多体彩品种（如 7 星彩、排列 5），还是想加入一个可视化界面？


## JavaScript 版本

为了实现这个目标，我们需要解决一个 JavaScript 中的核心问题：标准的 `Math.random()` 是不能手动设置种子的。

因此，我们的 JavaScript 代码需要包含以下几个部分：

- HTML/CSS: 构建一个现代、简洁的界面。
- API 获取模块: 异步请求 ANU 的量子数据。
- 自定义的随机数生成器 (PRNG): 我们需要内置一个小型的算法（比如 `mulberry32`），它接受我们获取的“真随机数”作为种子，然后生成后续的随机数。
- 体彩逻辑模块: 使用自定义 PRNG 生成大乐透、排列3等号码。

> **Mulberry32**: 
> Mulberry32 is a fast, 32-bit state, seedable pseudo-random number generator (PRNG) that is particularly well-suited for JavaScript applications. It is designed to be a lightweight, high-performance alternative to Math.random() when deterministic (repeatable) output is required, such as in games, procedural generation, or simulations.

这是一个单文件解决方案 (index.html)，你可以直接将它上传到 GitHub Pages 的仓库根目录即可运行。


## 关键技术点解释
- 解决 JS 无种子的难题 (mulberry32 算法)：
  - 标准 JS 的 `Math.random()` 不接受种子。为了让我们的“真随机数”真正起作用并控制后续的生成过程，我在代码中第 127-142 行实现了一个名为 `mulberry32` 的轻量级伪随机数生成器。
  - `initializeSeed(seedValue)` 函数接收我们从网络获取的真随机数，初始化生成器的状态。
  - `nextRandom()` 函数替代了 `Math.random()`，它基于当前的种子状态经过一系列位运算生成新的随机数，确保了只要种子定了，生成的号码序列就是确定的（这是计算机生成随机数的特性）。
- 真随机源与回退机制 (fetchQuantumSeed 函数)：
  - 代码尝试连接 ANU (澳大利亚国立大学) 的量子 API。
  - 重要改进：我增加了一个 `AbortController` 来设置 8 秒超时。如果 ANU 的服务器在国内访问慢或者挂了，用户界面不会一直卡死。
  - 回退方案 (Fallback)：如果 API 请求失败或超时，代码会捕获错误，并自动切换使用浏览器内置的 `window.crypto.getRandomValues()`。这是一个密码学安全的伪随机数生成器，虽然不是物理真随机，但比普通的 `Math.random()` 安全得多，足以作为备用方案。
- 界面交互优化：
  - 在种子尚未获取成功时，生成按钮是禁用的 (disabled)，防止用户在没有种子的情况下生成号码。
  - 状态栏会根据连接状态（加载中、量子成功、回退本地）改变颜色，提供直观的反馈。
  - CSS 采用了毛玻璃效果和渐变背景，看起来更现代。
- 注数选择器：允许你选择一次生成的注数（1-100 注）。
- 批量生成逻辑：点击“批量生成大乐透”后，程序会基于量子种子连续计算出多组号码。
- 滚动列表展示：生成的号码会以列表形式排版，方便查看。

