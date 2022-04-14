---
layout: post
title: "C++ Mutable 关键字"
date: 2021-08-15T00:20:00Z
tags: [cpp]
---

* TOC 
{:toc}
---

- C++中mutable关键字存在的必要性是什么？ - 朋克李PunkLi的回答 - 知乎 https://www.zhihu.com/question/64969053/answer/226195203
- C++中mutable关键字存在的必要性是什么？ - 知乎 https://www.zhihu.com/question/64969053/answer/226169333

## 未完成

因为我看不懂 《Effective Modern C++》 的 Item 16 部分。

为什么 mutex 只有 move , 没有 copy 。 所以本章还没有完成。

## 逻辑上 Constness 

《Effective C++》 **条款3** 说明了，某些函数是 **"Logical Constness"** 而不是 "**Bitwise Constness**" 。

说白了就是**不允许大幅度地修改对象内容**，但**允许某些变量被修改**。

常见的通途 (由于 `mutable` 是被隐藏的，所以下面三种用途非常安全)

- access counter 计算某个对象的访问次数
- cache 缓存
- mutex 线程安全

### Const Member Function 的隐患

和 <https://randoruf.github.io/2021/08/15/cpp-const.html> 总结的一模一样，只不过那时候我还不懂 Bitwise Constness 。

所谓的 Bitwise Constness 就是 **不会修改 `this` 对象的内容**。

那么问题来了， **成员指针指的对象算不算 `this` 对象的内容**？

答案：不算。因为编译器说不算。编译器只能**保证指针`num` 的地址不变**。

```cpp
class A{
public:
    int* num;
    A(){ num = new int(10); }
    ~A() { delete num; } 

    void setNum(int n) const{
        *num = n; 
    }
}; 
```

### 缓存

<https://github.com/kelthuzadx/EffectiveModernCppChinese/blob/master/3.MovingToModernCpp/item16.md>

例如 "多项式**求根**" 本身**不会改变多项式本身** (logical costness) ，但是多项式求根是非常消耗资源的。

所以最好缓存起来。

```cpp
class Polynomial {
public:
    using RootsType = std::vector<double>;
    
    RootsType roots() const{
        if (!rootsAreValid) {               //如果缓存不可用
            … //计算根
            //用rootVals存储它们
            rootsAreValid = true;
        }
        
        return rootVals;
    }
    
private:
    mutable bool rootsAreValid{ false };    //初始化器（initializer）的
    mutable RootsType rootVals{};           //更多信息请查看条款7
};
```



### 线程安全

上面的例子在**多线程**情况下，会有 ***Race Condition***

- **两个进程都尝试修改同一个值**，有时候会被覆盖。
- 所以需要 `mutex` 来保证这一个对象的互斥访问 (仅仅针对这一个对象)
- **注意不能用 `static` 来声明 `mutex`** ，因为你会有**很多不同的多项式**，例如 $$x^2 + x $$ 和 $x^3$ 是不一样的。

在**依旧保留 `const` 的情况下** (希望有 Logical Constness) ， 

虽然 `mutex` 确实不会改变多项式本身，但**会改变对象的 `mutex`** 。

```cpp
class Polynomial {
public:
    using RootsType = std::vector<double>;
    
    RootsType roots() const{
        std::lock_guard<std::mutex> g(m);       //锁定互斥量
       
        if (!rootsAreValid) {                   //如果缓存无效
            …                                   //计算/存储根值
            rootsAreValid = true;
        }
        
        return rootsVals;
    }                                           //解锁互斥量
    
private:
    mutable std::mutex m;
    mutable bool rootsAreValid { false };
    mutable RootsType rootsVals {};
};
```



### Access Counter 

看看函数被使用了多少次。

```cpp
class BigArray {
    vector<int> v; 
    int accessCounter;
public:
    int getItem(int index) const { 
        accessCounter++;
        return v[index];
    }
};
```



