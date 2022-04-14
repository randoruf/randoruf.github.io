---
layout: post
title: "C++ 类型声明易错点 (Forward Declaration)"
date: 2021-07-12
tags: [cpp]
---



## 前向声明（Forward Declaration）

>在[程序设计](https://zh.wikipedia.org/wiki/程序设计)中，**前向声明**（**Forward Declaration**）是指声明[标识符](https://zh.wikipedia.org/wiki/标识符)(表示编程的实体，如数据类型、变量、函数)时还没有给出完整的定义。
>
>[前向声明 - 维基百科，自由的百科全书 (wikipedia.org)](https://zh.wikipedia.org/wiki/前向声明)

向前声明 `A`  ， 即 原型(Prototype)。 

```c++
class A; 
```

必须在某处提供这个被声明的函数的定义（其他文件）。 

C++ 的 **两个结构体之间相互引用**、**自引用** 会经常遇到 此问题。

### 自引用

```c++
class BinaryTree {
    int data;   // Data area
    BinaryTree left;
    BinaryTree right;
};
```

<img src="/shared/imgs/image-20210712135632118.png" alt="image-20210712135632118" style="zoom:50%;" />

此时会提示， `field has incomplete type 'BinaryTree'` 。

因为此时 BinaryTree **在被完整定义 (即 `}`) 之前**被引用了。

- 原因也很简单， 在编译 BinaryTree 的时候， 编译器在 `{...}` 里面发现了 BinaryTree
- 所以编译器继续看 `BinaryTree` 的完整定义是什么....
- 显然这样会造成**死循环**



#### 自引用解决方法

- [Can a C++ class have an object of self type? - GeeksforGeeks](https://www.geeksforgeeks.org/can-a-c-class-have-an-object-of-self-type/)
  - **static object** of self type
  - **pointer** to self type
- 为什么 static object / pointer 可以解决 ？ 
  - compiler has no way to find out **size of the objects of the class**.

```c++
class Test {
  static Test self;
};
```

```c++
class BinaryTree {
    int data;   // Data area
    BinaryTree* left;
    BinaryTree* right;
};
```



### 相互引用 / 前向引用

```c++
class A{
public:
  B val; 
};

class B{
public:
  A val; 
}
```

- 同样会造成**死循环** 。 `A` 需要 `B` ， 但是 `B` 又需要 `A` 。

#### 相互引用 / 前向引用 解决方法

- **引用**
- **指针**
- **static object**

```c++
class B;  // 向前声明
class A{
public:
  B val; 
};


class B{
public:
  A val; 
}
```







