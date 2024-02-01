---
layout: post
title: "C++ 左值引用 和 右值引用"
date: 2021-05-17
tags: [cpp]
---

* TOC
{:toc}

---


出处 ： [C++的&和&& - tlanyan](https://tlanyan.me/and-operator-in-cpp/#bnp_i_2)

## 指针引用

这个大家很熟悉。数据类型有个 `*`

```c++
TreeNode* root; 
```

## 左值引用

这个刚熟悉 C++ 的也很熟悉 ，数据类型有个 `&` ， 一般推荐和 `const` 使用

```c++
const TreeNode& root;  
```

## 右值引用

右值引用是 C++11 引入的。 

如果用 `std::vector<T>` 的时候， 需要插入新的 element 可以使用

- `push_back()`
- `emplace_back()`

两者实际上都是在 `vector<T>` 的结尾加上一个新的元素， 不同的是 `emplace_back()` 用的是右值引用， 并且速度一般比 `push_back()` 更快（因为知道是临时变量， 避免了重复复制）。 

注意到其他使用 `vector<T>` 实现的数据结构都有类似的特点， 例如 `queue, stack, heap` 等等。

右值引用是数据类型有个 `&&` ， 注意**被引用的右值没有变量名**。

```c++
std::vector<Complex> stack; 
stack.emplace_back(Complex(2, 3)); // 虚数 2 + 3i  
```

注意到 `emplace_back` 的函数原型(function prototype)为 ， 看到 `&&` 了吗？[std::vector::emplace_back - cppreference.com](https://en.cppreference.com/w/cpp/container/vector/emplace_back)

```c++
void emplace_back( Args&&... args );
```

还有一种比较少见的用法 [c++ - What does auto&& tell us? - Stack Overflow](https://stackoverflow.com/questions/13230480/what-does-auto-tell-us) , 就是类似左值引用。

```c++
auto&& vec = some_expression_that_may_be_rvalue_or_lvalue;
```

（具体有什么用我还不知道。。。。）