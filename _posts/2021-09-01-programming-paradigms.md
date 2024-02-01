---
layout: post
title: "三大编程范式 - 结构化编程"
date: 2021-09-01
tags: [functional_programming]
---



## Simon Peyton-Jones: Towards a Programming Language Nirvana

https://channel9.msdn.com/Blogs/Charles/Simon-Peyton-Jones-Towards-a-Programming-Language-Nirvana?term=simon&lang-en=true

## Channel 9 Functional Programming Fundemental 

C9 Lectures: Dr. Erik Meijer - Functional Programming Fundamentals, Chapter 1 of 13

<https://channel9.msdn.com/Series/C9-Lectures-Erik-Meijer-Functional-Programming-Fundamentals/Lecture-Series-Erik-Meijer-Functional-Programming-Fundamentals-Chapter-1> 

C9 Lectures: Dr. Ralf Lämmel - The Quick Essence of Functional Programming

<https://channel9.msdn.com/Shows/Going+Deep/C9-Lectures-Dr-Ralf-Lmmel-AFP-The-Quick-Essence-of-Functional-Programming?term=haskell&lang-en=true&pageSize=15&skip=15>

Brian Beckman: The Zen of Stateless State - The State Monad - Part 1

<https://channel9.msdn.com/Shows/Going+Deep/Brian-Beckman-The-Zen-of-Expressing-State-The-State-Monad?term=haskell&lang-en=true&pageSize=15&skip=30>

Brian Beckman: The Zen of Stateless State - The State Monad - Part 2

<https://channel9.msdn.com/Shows/Going+Deep/Brian-Beckman-The-Zen-of-Stateless-State-The-State-Monad-Part-2?term=haskell&lang-en=true&pageSize=15&skip=30>

Brian Beckman: Don't fear the Monad

<https://channel9.msdn.com/Shows/Going+Deep/Brian-Beckman-Dont-fear-the-Monads?term=haskell&lang-en=true&pageSize=15&skip=30>

YOW! 2011: Tony Morris - Functional Programming and Functional Thinking

<https://channel9.msdn.com/Blogs/Charles/YOW-2011-Tony-Morris-Functional-Programming-and-Functional-Thinking?term=haskell&lang-en=true&pageSize=15&skip=30>

The Lambda Calculus, General Term Rewriting and Food Nutrition

<https://channel9.msdn.com/Series/Beckman-Meijer-Overdrive/Beckman-Meijer-Overdrive-The-Lambda-Calculus-and-Food-Nutrition>

LINQ - Composability Guaranteed

<https://channel9.msdn.com/Series/Beckman-Meijer-Overdrive/Beckman-Meijer-Overdrive-LINQ-Composability-Guaranteed>

Brian Beckman: Hidden Markov Models, Viterbi Algorithm, LINQ, Rx and Higgs Boson

<https://channel9.msdn.com/Shows/Going+Deep/Brian-Beckman-Hidden-Markov-Models-Viterbi-Algorithm-LINQ-Rx-and-Higgs-Boson?term=haskell&lang-en=true&pageSize=15&skip=30>

Erik Meijer: Functional Programming

<https://channel9.msdn.com/Shows/Going+Deep/Erik-Meijer-Functional-Programming?term=haskell&lang-en=true&pageSize=15&skip=15>



## 用计算机做什么？

通常计算机可以做两件事

- 单纯的**数学计算**- Functional Programming 
  - 比如计算矩阵乘法、伪随机数(固定种子)
  - **不会对外部世界产生 side-effect** ，所有**执行结果**都是 deterministic 
  - 这种不产生 side-effect 的函数甚至可以脱离 冯诺依曼结构，依赖一种叫 Lambda Calculus 的计算体系。注意这也是图灵完备的。于是就有了 ***Functional Programming*** ，常见于 Parallel Computing ， 因为一定**不涉及 同步问题(Mutex)** 。
  - 有些看起来不能 Parallelize 的程序，比如 Fibonacci Sequence ，一个值以来与上一个。但 Haskell 有种 tricks 可以 平行计算。
- **控制现实世界** - Imprerative Programming 
  - 比如发射火箭、商城系统。计算机本来做的事情就是**控制系统** 。
  - 对外部世界产生 side-effect ， **执行结果**是 non-derministic ，比如 "订购" 的按钮，卖完了就没了。
  - 这种程序必须依赖于 CS 传统艺能 《计算机组成原理》、《操作系统》,  因为只要涉及到 Register , Memory 这种临时储存设备，那就**一定是与 State 有关的**。
  - 通常需要 **同步**, 常见有 锁、信号量。
- 妥协 ***Object-oriented Programming*** 
  - 利用 **封装(encupsulation)** 将 side-effect 限制到一个 scope 里。
  - 可以减少程度的复杂程度 (更少的 side-effects)

## Why Function Programming ?

Brian Beckman: Don't fear the Monad <https://www.youtube.com/watch?v=ZhuHCtR3xq8>

<iframe width="560" height="315" src="https://www.youtube.com/embed/ZhuHCtR3xq8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

基本就是 **SICP 的思想** ： **分解**、理解、破解。

其中最重要的是 **分解** ：

> 
>
> 把问题抽象分离成一个一个**很小的函数** (模块化、黑盒抽象)。 然后**组合成一个大的系统** (组合)。
>
> 

这类似于人体的细胞、器官概念 ， 这也是 Wolfram 推崇的方法论。 

把 SICP 也看完吧，加到书单里。

- <https://learningsicp.github.io>
- <https://github.com/DeathKing/Learning-SICP>
- <http://deathking.github.io/yast-cn/>

---

## Programming Paradigms 

可以参考文章 

<https://digitalfellows.commons.gc.cuny.edu/2018/03/12/an-introduction-to-programming-paradigms/>

详细介绍了 三大编程范式

- Imprerative 
- Functional 
- Object-oriented 

<img src="/shared/imgs/paradigms-1170x669.jpg" alt="img" style="zoom:50%;" />

---

## Side-effect & State 

这些编程范式都在关心一个问题 **Side-effect** 和 **State** 。

- 可以结合 图灵机 的 State 来理解，例如 **有限状态机** 需要 **输入** 和 **当前状态**  完成 **state transitions**. 

- 但是**数学表达式可没有 State** ， 表达式(纯函数) 只需要 **输入**， 不需要 当前状态。于是有数学家提出另一种计算模型，叫 Lambda Calculus 。神奇的是，尽管 Lambda Calculus 没有 迭代结构(for/while), 只有 Recursion, 但实际上是 **图灵完备的**。

这就是为什么 Functional Programming 可以 safe ，因为直接 avoid state ，其行为是都是确定的。

所以并行计算 (parallel computing) 上特别喜欢 Functional Programming, 而不是 Mutex 这种同步机制，直接规避了 Race Conditions 。

---

而 Object-oriented Programming 就是一种折中方案。

OO ***最重要的特征是 封装(encapsulation)*** ， 其次才是 **继承(inheritance)** 和 **多态(polymorphism)**。

继承、多态 和 封装 比起来，更像是 语法糖，可以方便以后的各种设计模式。

因为 **封装 直接将 Side Effect 限定在一个范围内** (Object-oriented programs couple state with functions that work on that state) ，

即只 **允许特定的 Methods 去 修改 State** 。

---

## Which Paradigm to Choose ?

基本上可以告别 Imprerative 。**能用 Object-oriented 的话，尽量用**。那什么时候用 Functional 呢？

> One important consideration when comparing **functional** and **object-oriented programming** is **concurrency**. 
>
> ===  *An Introduction to Programming Paradigms* by Patrick Smyth

刚才说了 Functional Programming 没有 Side-effect ，那就意味着可以轻松 parallelism ，**完全不用管 Race Condition 和 Interleaving。**要知道 Race Condition 在并发情况下是大问题 (特别是 Python 这种 GIL ，完全不是 thread-safe 的)。

所以 Haskell, Elixir, Scala, Go 更加适用于 平行计算 (parallel computing) 。

我想我有时间也学一下 Scala 吧。 或者等 C++ 完全支持 Functional Programming 。

- Go 为什么不支持 Generic programming， 为什么 Go 语言没有泛型 <https://draveness.me/whys-the-design-go-generics/>
- Elixir 为什么是 dynamic typing ，Elixir 从入门到放弃 <https://draveness.me/elixir-or-not/>
- Haskell 连个输出都要 Monad, 与 OO 风格差别太大，学习成本太大 , Haskell Sucks! <https://www.youtube.com/watch?v=rvRD_LRaiRs>

可以看一下 Simon 如何评价 Haskell - 直接 Haskell is useless 。<https://www.youtube.com/watch?v=iSmkqocn0oQ>

<iframe width="560" height="315" src="https://www.youtube.com/embed/iSmkqocn0oQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

这些编程语言都特别诡异，我觉得 C++ 和 Scala 有比较值得深入学习的价值，可以搞平行计算 (OpenMPI)。

---

## Glossary 

这篇文章最后还复习了一下 常见编程范式的概念

### Functional Concepts

- [Higher-order functions](https://eloquentjavascript.net/05_higher_order.html) – Functions that take functions as arguments. The ability to create higher-order functions leads to some interesting techniques.
- [Closures](https://reprog.wordpress.com/2010/02/27/closures-finally-explained/) – A function that, when you give it some information and call it, returns another function. Basically, a function that allows you to create specialized functions on demand.
- [Referential transparency / functional purity](https://en.wikipedia.org/wiki/Referential_transparency) – The idea that, when given a certain set of arguments, a function should always give the same output, no matter the context.
- [Recursion](http://www.catb.org/jargon/html/R/recursion.html) – In programming, the ability of a function to be defined in terms of itself. A frequently-used technique in functional languages.
- [Immutability](https://en.wikipedia.org/wiki/Immutable_object) – The idea that a variable’s value must not change after it is set.
- [MapReduce](https://en.wikipedia.org/wiki/MapReduce) – A technique for parallel computation based loosely on two functional programming concepts, map and reduce.
- [Lambda calculus](https://en.wikipedia.org/wiki/Lambda_calculus) – A formal mathematical and computational system based entirely on functions and substitutions.

### Object-Oriented Concepts

- [Class](https://simple.wikipedia.org/wiki/Class_(programming)) – An abstraction or template from which objects are created.
- [Instantiation](https://www.computerhope.com/jargon/i/instantiation.htm) – Creating an object based on a class.
- [Attribute](http://www.ozedweb.com/infotech/it_oops_lesson23_attributes.htm) – A variable defined in a class or object. Also called fields, members, or class variables.
- [Encapsulation](https://stackify.com/oop-concept-for-beginners-what-is-encapsulation/) – In object-oriented programming, requiring that access to attributes of an object go through designated methods. A technique for hiding parts of your program from other parts of your program.
- [Method](https://brilliant.org/wiki/methods-oop/) – A function inside a class or object.
- [Polymorphism](https://stackoverflow.com/questions/1031273/what-is-polymorphism-what-is-it-for-and-how-is-it-used) – Basically, the idea that different types or objects with different functionality will have the same interface
- [Inheritance](http://www-numi.fnal.gov/offline_software/srt_public_context/WebDocs/Companion/cxx_crib/inheritance.html) – The ability of a more specific class to copy certain methods or attributes from a more general class. The Cat class, for example, might inherit from the Animal class, meaning that Cat objects will have access to the methods and attributes in the Animal class.





