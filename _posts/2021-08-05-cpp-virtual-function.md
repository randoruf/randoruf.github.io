---
layout: post
title: "C++ 多态(虚函数)"
date: 2021-08-05T00:20:00Z
tags: [cpp]
---

* TOC 
{:toc}




## C++ 一篇搞懂多态的实现原理 (小林 Coding)

建议阅读 <https://zhuanlan.zhihu.com/p/104605966> 

> **每一个有「虚函数」的类**（包括其**派生类**）都有一个**「虚函数表」**，该类的任何对象中都放着**虚函数表的指针**。

这可以用 Visual Studio 的 Debugger 确定，能看到内存情况。

```cpp
// 基类
class Base {
public:
    virtual void Print() { } // 虚函数
};
// 派生类
class Derived : public Base {
public:
    void Print () override { } // 虚函数
};
```

注意左边的是 **「对象」**，右边是 **类的虚函数表**。 

![img](/shared/imgs/v2-873eb53a9688bf53084c160acb32bfa4_r.jpg)



## 核心说法

> 虚函数 : 从 **类型** 到 **对象** 。

C++ 是**静态类型**，也就是一般**编译时**就可以映射**函数的调用**。

但是**虚函数**可以根据**对象**映射函数的调用，即 **this指针的 `vptr`** 。这一般在**运行时**确定。

## 多态

多态主要体现在 **"重载函数"** 和 **"重写函数"** 

- Overloading 
- Overriding 

## 静态联翩 - Overloading 

- [Virtual Functions in C++ by The Cherno - YouTube ](https://www.youtube.com/watch?v=oIV2KchSyGQ)

- C++ 是一门静态语言，也就是如何调用方法完全依赖于**声明的类型**。
- 静态联翩指**编译时**确定函数的**调用地址**。
  - 常见有**重载函数** 来实现 **"一个函数名，多种行为"**
- 能够实现**静态联翩**的原因是 : 
  - 函数调用的内存地址偏移是可以在编译时确定的。
  - 这也解释了***为什么函数的调用依赖于类型***。

**网易面试题： **

```cpp
#include <iostream>


class A {
public:
    A() {}
    ~A() {}
    void test() const {
        std::cout << "A\n"; 
    }
}; 

class B : public A{
    int v = 0; 
    int *v_ptr; 

public:
    B()  { v_ptr = &v; }
    ~B() {}

    void test() const{
        std::cout << "B\n";  
        *v_ptr = 999; 
    }
}; 

int main(){
    B* p0 = (B*) new A; 
    A* p1 = (A*) new B; 

    p0->test();
    p1->test(); 
}
```

输出 (显然完全依赖于我们所**声明的类型** , ***Type is important in C++***)

```
B
A
```

## 动态联翩 - Overriding 

- 多态最常见的用法 : **"允许 派生类(Derived Class) 覆盖 基类(Base Class) 的方法"** 
- 我们希望在多态中达到**两个目标**
  - (继承 Methods) : **让 派生类 保留尽可能多的 基类方法 **。 
    - 没有体现多态。
  - (引用/指针/覆盖) : **让 基类 引用 派生类**
    - 多态主要体现在这里，因为子类覆盖了父类的方法，可以实现 *接口重用* 。
    - 比如**一个函数接受 Base Class 类型，就意味着其能接受 Base Class 和 Derived Class 的对象 (Object)** 。
    - [Virtual Functions in C++ by The Cherno - YouTube ](https://www.youtube.com/watch?v=oIV2KchSyGQ) ，看视频关于 Entity 和 Player 的介绍
- 多态 与 虚函数
  - C++多态由**虚函数**实现 (即 **派生类覆盖基类的方法** )
  - **虚函数** 能够实现 **动态联翩**,  也就是 **从 "根据类型(Type)" 到 "根据对象(Object)"**
    - 根据 **对象头部的 Vptr**  ， 而不再是根据 类型(Type)
  - 虚函数的覆盖要求下面两项**完全相同**： 
    - 函数名
    - 参数

### 派生类隐藏基类的方法

注意区别于 "派生类覆盖基类的方法"。

- 如果 **基类没有 `virtual`** ， 那么 派生类只能隐藏基类的方法。
- 记住 **`virtual`** 要求 **函数名** 和 **参数** 完全相同才能覆盖。

```cpp
class A {
public:
    A() {}
    ~A() {}
    void test() const {
        std::cout << "A\n"; 
    }
}; 

class B : public A{
public:
    B()  {}
    ~B() {}

    void test() const{
        std::cout << "B\n";  
    }

    int val = 999; 
}; 

int main(){
    A a = new A; 
    B b = new B; 

    a.test();
    b.test(); 
}
```

输出 

```cpp
A
B
```



### 基类指针引用派生类 (虚函数)

- **`virtual` 只建议放置于 Base Class**  (也就是通常只放在一个 Class )
- 子类覆盖父类的方法，**需要 `override` 关键字修饰**，无需 `virtual`  (**除非多重继承**) 

```c++
class A {
public:
    A() {}
    ~A() {}
    virtual void test() const {
        std::cout << "A\n"; 
    }
}; 

class B : public A{
public:
    B()  {}
    ~B() {}

    void test() const override {
        std::cout << "B\n";  
    }

    int val = 999; 
}; 

int main(){
    A* p0 = (A*) new B; 
    p0->test(); 
}
```

输出

```
A
B
```

可以看出 **虚函数** 能够实现 **动态联翩**,  也就是 **从 "根据类型(Type)" 到 "根据对象(Object)"**

这种 Type Infering based on object 在其他动态语言早就有了， 比如 Python, JavaScript ，能够**根据对象来确定类型**。

可以看到，现在不管指针对不对，输出结果是对的。

**注意:** 对象 (Object) 就是 实例 (Instance) ， 就内存中的一段数据。  

### 派生类指针引用基类 (危险) 

```cpp
class A {
public:
    A() {}
    ~A() {}
    void test() const {
        std::cout << "A\n"; 
    }
}; 

class B : public A{
public:
    B()  {}
    ~B() {}

    void test() const {
        std::cout << "B\n";  
    }

    int val = 999; 
}; 

int main(){
    B* p0 = (B*) new A; 
    p0->test();
  
    std::cout << p0->val << std::endl;  
}
```



输出

```
B
-9362176
```

**静态联翩** 把 `p0` 解读为 Class B (实际上是 Class A) , 所以 `p0->val` 访问了一个不存在的地方。

所以***把 子类 cast 到 父类 是很危险的行为***。这里演示只是为了证明下面的 Vtable 到底是什么。

### 虚函数表 

- [Virtual Functions - Ashwin H M - YouTube](https://www.youtube.com/watch?v=dX2ojPL0Y5M)
- [18.6 — The virtual table - Learn C++ (learncpp.com)](https://www.learncpp.com/cpp-tutorial/the-virtual-table/)

- **每个对象 (Object) 都会有单独的 `vptr`** 
  - **一个有虚函数的类有一个 VTable** (其派生类也有虚函数表) 。 比如 上面的例子，  A 和 B 类一共有两个 VTable 。
    - 准确来说，含有 `virtual` 的类有 VTable 。 
    - 派生类也会继承父类的 `virtual` ，所以 **基类 和 派生类 都有 VTable**
  - **`vptr` 由 当前类的 Constructor 初始化** ，并**指向 当前类的 Vtable** 
    - 所以 构造函数 不能是虚函数。

```cpp
class A {
public:
    A() {}
    ~A() {}
    virtual void test() const {
        std::cout << "A\n"; 
    }
}; 

class B : public A{
public:
    B()  {}
    ~B() {}

    void test() const override {
        std::cout << "B\n";  
    }
    
}; 

int main(){
    A a = new A; 
    B b = new B; 
  
    std::cout << p0->val << std::endl;  
}
```

- 由于**虚函数表在对象的头部**，所以 C++ 可以**根据对象来确定调用函数的地址**。
  - 即使**引用或者指针乱来** (比如多态，**让父类引用子类**) 
  - C++ 现在也能**根据 `vptr` 所指向 VTable** 来引导到正确的函数地址。 
    - 对象的 `vptr` 在 **当前类**的 Constructor 被确定
    - 对象的 `vptr` 总是指向 **当前类** 的 VTable 

```cpp
class A {
public:
    A() {}
    ~A() {}
    virtual void test() const {
        std::cout << "A\n"; 
    }
}; 

class B : public A{
public:
    B()  {}
    ~B() {}

    void test() const override{
        std::cout << "B\n";  
    }
}; 

int main(){
    B* p0 = (B*) new A; 
    A* p1 = (A*) new B; 

    p0->test();
    p1->test(); 
}
```

输出

```
A
B
```

可以看到 C++ 能**根据对象来确定调用函数了**。



#### 虚函数表图示

- 记住： ***如果使用虚函数，C++ 依靠读取对象的 `vptr` 来确定调用函数的地址***。
- Base Constructor 生成的所有对象的 `vptr` 都指向 Base VTable 
  - Base Vtable 的函数都指向带有 vitual function 的定义
  -  (这里不要和 Virtual Function 混淆了，这里的 virtual function 是有定义的，跟普通函数差不多)
- 派生类 D1 生成的所有对象 `vptr` 都指向 D1 VTable 
  - D1 VTable 只覆盖了 function1 ，所以 D1 VTable 的 function1 指向自身
  - 因为需要体现**继承**，所以 function 2 指向 Base Class 的实现

![img](/shared/imgs/VTable.gif)



#### 虚函数表可视化

**直接用 Visual Studio 的 Debugger** 就可以看到了。

C++——来讲讲虚函数、虚继承、多态和虚函数表 - KarK.Li的文章 - 知乎 <https://zhuanlan.zhihu.com/p/136478734>

整个程序的生存周期中，**每个类的虚函数表都有唯一的一个地址**，

- ***类的实例的 `vptr `  指向这个类的虚函数表***

这可以用 Visual Studio 验证的。

可见，**虚函数**只有在**引用**、**指针**时才能发挥作用。

（不能让 B 转化为 A 。。。。对象之间不能直接转化）



---

## Virtual Constructor and Destructor 

- Virtual Constructor 是**错误的**。
  - 《C++程序设计基础》 - 周歌如
  - 因为建立**派生类**时，必须**从基类的根开始**，沿着 **继承链 (Inheritance Chain)** 逐个调用类的**构造函数**。
  - https://docs.microsoft.com/en-us/cpp/cpp/constructors-cpp?view=msvc-160#order_of_construction
  - 这意味着**无法 “选择性地” 地调用构造函数**，因为所有构造函数都会来一次
-  **Virtual Destructor** 是**建议的**。
  - 因为 **Derived Type**  可能申请了**一些 Heap 空间**。
  - 所以 Virtual Destructor 可以防止 **内存泄露**。

```cpp

class A {
public:
    A () {}
    ~A () = default; 
};

class B : public A{
public: 
    B  () { 
        std::cout << "allocate B\n"; 
        arr = new int [100]; 
    }
    ~B () { 
        std::cout << "free B\n"; 
        delete[] arr; 
    }
    int* arr; 
}; 

int main() {
    A* p0 = new B; 
    delete p0; 
    // allocate B 
}
```

上面的例子会造成**内存泄露**。 修正(**把 Destructor 声明为 Virtual**). 

```cpp
class A {
public:
    A () {}
    virtual ~A () = default; 
};

class B : public A{
public: 
    B  () { 
        std::cout << "allocate B\n"; 
        arr = new int [100]; 
    }
    ~B () override { 
        std::cout << "free B\n"; 
        delete[] arr; 
    }
    int* arr; 
}; 

int main() {
    A* p0 = new B; 
    delete p0; 
  	// allocate B
		// free B
}
```

## 虚继承

C++——来讲讲虚函数、虚继承、多态和虚函数表 - KarK.Li的文章 - 知乎 <https://zhuanlan.zhihu.com/p/136478734>

虚继承是为了解决**棱形继承问题**。 

<img src="/shared/imgs/image-20210819140630815.png" alt="image-20210819140630815" style="zoom: 50%;" />

```cpp
#include <iostream>
using namespace std;
class A{
public:
	int a;
};
class B : public A{
public:
	int b;
};
class C : public A{
public:
	int c;
};
class D : public B, public C{
public:
	int d;
};

int main(){
	D d;
	cout << &d.B::a << endl;
	cout << &d.C::a << endl;
	return 0;
}
```

可以发现 **对象 d** 在同时继承 B, C 的情况下，会产生**两份 A 的副本**。

这不对劲，我们应该只想要**一份A而已**

```
0000007CF67DF948  
0000007CF67DF950
```

这个时候，我们就需要引入**虚继承**，**在需要继承的基类前加virtual关键字修饰该基类**，使其成为虚基类

- **上面 B, C 会发生冲突** (B, C 同时继承 A)
- 所以 **B, C 只要虚继承 A** 即可 

```cpp
#include <iostream>
using namespace std;
class A{
public:
	int a;
};
class B : virtual public A{
public:
	int b;
};
class C : virtual public A{
public:
	int c;
};
class D : public B, public C{
public:
	int d;
};


int main(){
	D d;
  cout << &d.a << endl; 
	cout << &d.B::a << endl;
	cout << &d.C::a << endl;
	return 0;
}
```

