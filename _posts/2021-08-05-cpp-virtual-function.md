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

### C++继承与指针： 

参考类似 <https://blog.csdn.net/Huuaaaaa/article/details/128334396>

可以尝试在 Visual Studio 里面看看有没有越界(如果A类和B类的内存结构不一样的话)。

据说是一道面试题。

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

在群里第一次问技术问题，然后海星哥说 `B* p0 = (B*) new A;` 是不安全的(未定义行为)。

> 海星哥: 
> `B* p0 = (B*) new A;` 这一行实际是有问题的。
> 但是A和B内存结构一样，所以转成功了。

然后尝试问了一下 ChatGPT, 回答真的很好（看后面有 ChatGPT的精彩回答）。

#### 知识点1: C++虚函数

出题者的本意是考察虚函数的应用。

```cpp
#include <iostream>

class A {
public:
    A() {}
    ~A() {}
    virtual void test() const {
        std::cout << "test_A\n"; 
    }
}; 

class B : public A{
    int arr[1024]; 

public:
    B()  {}
    ~B() {}
    virtual void test() const override{
        std::cout << "test_B\n";  
    }
}; 

int main(){
    B* p0 = (B*) new A; 
    A* p1 = (A*) new B; 

    p0->test();
    p1->test(); 
}
```

这样的话，输出的东西确实就是实际情况(每个类都从自己的虚函数表找到了正确的调用，这部分可能要看虚函数的实现才行)。 

虽然函数可以正常调用，`B* p0 = (B*) new A;` 是不安全的转换，仍可能导致内存越界(当内存结构/布局/Memory Layout不一样时)。


#### 知识点2: C++静态联翩/方法重写

以下回答来自 ChatGPT: 

"C++静态联编"指的是在C++中的编译时（而非运行时）决定函数或者对象的类型以及对应操作的过程。
这与动态联编（多态）形成对比，在动态联编中，这些决定是在运行时进行的。

让我们更详细地探讨一下静态联编的概念：

1. **静态联编（Static Binding）**:
   - 静态联编又被称为早期绑定，因为函数调用的解析在编译时期就完成了。
   - 在静态联编中，调用哪个函数是根据对象的声明类型而不是对象的实际类型来决定的。
   - 这意味着如果你没有使用虚函数，函数调用将不会根据对象的实际类型来决定，即使在继承体系中重写了该方法。

2. **举例说明**:
   假设有两个类，基类 `Base` 和派生类 `Derived`，它们都有一个名为 `func` 的方法。

   ```cpp
   class Base {
   public:
       void func() {
           cout << "Function of Base" << endl;
       }
   };

   class Derived : public Base {
   public:
       void func() {
           cout << "Function of Derived" << endl;
       }
   };
   ```

   在这个例子中，如果你创建一个 `Base` 类的对象并调用 `func`，即使 `Derived` 类中有一个同名的函数，也会调用 `Base` 类中的 `func`。

   ```cpp
   Base* obj = new Derived();
   obj->func();  // 将调用 Base 中的 func，而非 Derived 中的
   ```

   这就是静态联编的效果，因为编译器在编译时就决定了调用 `Base` 类的 `func` 方法，而不考虑对象的实际类型。

--- 

##### 补充: 静态绑定的细节 

要注意下面这段代码也能通过编译。

```cpp
Base* obj = nullptr; 
obj->func();  // 将调用 Base 中的 func，而非 Derived 中的
```

所以实际上编译器是根据指针 `obj` 的**静态类型**完成了相关的函数调用静态绑定。 

所以你知道为什么题目的代码运行顺序是 `B A` 了吗？

```cpp
int main(){
    B* p0 = (B*) new A; 
    A* p1 = (A*) new B; 

    p0->test();
    p1->test(); 
}
```

---

**编译器是怎么完成静态绑定?(即如何根据 `Base*` 决定调用 Base 中的 func)**

一下回答来自继续问ChatGPT。

编译器实现静态绑定的过程涉及在编译时解析函数调用，而不是在运行时。这个过程是根据调用的对象的静态类型进行的。以下是静态绑定的实现细节：

1. **静态类型检查**:
   - 编译器首先检查函数调用的对象的静态类型。静态类型是编译时已知的类型，通常是变量声明时的类型。
   - 在没有使用虚函数的情况下，编译器仅根据静态类型来解析函数调用。

2. **符号解析**:
   - 编译器在编译时期对源代码进行分析，识别所有的函数调用。
   - 对于每个函数调用，编译器查找与静态类型匹配的函数定义或声明。这一步称为符号解析。

3. **生成函数调用指令**:
   - 一旦找到匹配的函数，编译器会在生成的机器代码中插入对该函数的直接调用指令。
   - 这意味着生成的代码中会有一个明确的跳转到特定函数的地址的指令。

4. **不涉及运行时查找**:
   - 由于静态绑定是在编译时完成的，因此在运行时不需要额外的查找或决策来确定应该调用哪个函数。
   - 这与虚函数的动态绑定形成对比，在动态绑定中，运行时需要根据对象的实际类型来确定调用哪个函数。

5. **优化和效率**:
   - 静态绑定允许编译器进行更多的优化，因为所有的函数调用在编译时就已经确定。
   - 这通常导致比动态绑定更高效的代码，因为避免了运行时的类型检查和决策。

6. **示例**:
   - 假设有以下代码：

     ```cpp
     class Base {
     public:
         void func() { /* ... */ }
     };

     Base obj;
     obj.func();
     ```

   - 在这里，`obj.func()` 的调用在编译时就解析为 `Base::func()`，编译器在生成的机器代码中直接插入了对 `Base::func()` 的调用指令。

总之，静态绑定是通过编译器在编译时根据静态类型解析函数调用来实现的。这种方法的优点是效率高，但缺点是缺乏运行时的灵活性。在没有虚函数的情况下，C++默认使用静态绑定。

---

1. **静态联编的优缺点**:
   - **优点**: 编译时确定函数调用可以提高运行时的效率。
   - **缺点**: 缺乏灵活性，不能利用面向对象编程的多态特性。

2. **与动态联编的对比**:
   - 在动态联编（运行时绑定）中，使用虚函数可以根据对象的实际类型（而非声明类型）来调用相应的方法。
   - 这提供了更多的灵活性，允许在运行时确定应该调用的正确的函数版本，是实现多态的关键。

了解静态联编和动态联编的区别，对于理解C++中多态性和继承的工作原理至关重要。




#### ChatGPT回答合集

--- 

这段代码是未定义的 (Undefined Behavior), 主要是不安全的类型转换和对象模型的错误使用。

1. `B* p0 = (*B) new A;` 不安全。但是内存结构一致，所以可以运行。
2. 调用 `p0->test();` 时，程序期望 `p0` 指向 `B`类型的对象，所以调用 `B`类对象。这是未定义行为。
3. `A* p1 = (A*) new B;` 是安全的。因为 `B`是从`A`继承而来的，这是向上转换(Upcasting)。
4. 调用 `p1->test();` 时，调用了 `A` 方法。但是如果 B类的`test()`声明为 `virtual`, 那么会根据多态调用`B`方法。

正确的做法是使用 `virtual`函数实现多态，而且不进行不安全的类型转换。

---

这段代码中的关键点在于对象的创建和类型转换。让我们分析一下代码中发生的情况。

1. `B* p0 = (B*) new A;` 
    - 这里创建了一个`A`类型的对象，并将其强制类型转换为`B*`类型。这是不安全的，因为`A`对象并不是`B`类型，`B`类型可能有一些`A`类型中不存在的成员。当你尝试调用`p0->test();`时，程序尝试在`A`对象上调用`B`类的`test`方法，这是未定义行为。但在你的代码和大多数实现中，这将简单地调用`A`类的`test`方法，因为`p0`实际指向的对象是`A`类型的。

2. `A* p1 = (A*) new B;`
    - 这里创建了一个`B`类型的对象，并将其转换为`A*`类型。这是安全的，因为`B`是`A`的子类，所以每个`B`对象都是一个`A`对象。因此，当你调用`p1->test();`时，它调用的是`A`类的`test`方法，因为`p1`被声明为指向`A`类型。

**这里的重点是，尽管`B`类重写了`test`方法，但由于`test`方法不是虚拟的，所以并不会发生多态。**调用的方法取决于指针的静态类型，而不是对象的实际类型。所以在这两个调用中，`test`方法都是从`A`类中调用的，因此输出是 "A\nA\n"。

然而，你提到输出是 "B\nA\n"，这实际上与上述分析不符。如果这确实是你观察到的输出，那么可能是由于编译器的特定行为或未定义行为导致的。在标准C++中，根据你的代码，预期的输出应该是 "A\nA\n"。不过，由于第一行的类型转换是不安全的，这可能会导致未定义行为，所以在不同的环境或编译器中可能会有不同的输出。

---

这段代码涉及到了C++的类继承、对象创建和类型转换，但它包含了一些潜在的问题。让我们一步步来解析。

1. **类定义**:
   - `class A` 和 `class B`，其中 `B` 继承自 `A`。
   - 每个类都有一个 `test()` 方法，`A` 的版本打印 "A\n"，而 `B` 的版本打印 "B\n"。

2. **对象创建和类型转换**:
   - `B* p0 = (B*) new A;`：这里创建了一个 `A` 类型的对象，并强制将其转换为 `B*` 类型的指针。这是不安全的，因为 `A` 对象并不是 `B` 类型，`B` 类型可能有一些 `A` 类型中不存在的成员。由于 `B` 继承自 `A`，这种转换在语法上是允许的，但实际上它可能导致未定义行为。
   - `A* p1 = (A*) new B;`：这里创建了一个 `B` 类型的对象，并将其转换为 `A*` 类型的指针。这是类型安全的，因为 `B` 是 `A` 的子类。

3. **方法调用**:
   - `p0->test();`：由于 `p0` 是一个指向 `A` 对象的 `B*` 类型指针，调用 `test()` 时，理论上应该调用 `B` 的版本。然而，因为 `p0` 实际上指向的是 `A` 类型的对象，所以这里的行为是未定义的。在大多数实现中，这会导致调用 `A` 类的 `test()` 方法。
   - `p1->test();`：`p1` 是指向 `B` 对象的 `A*` 类型指针。因为 `test()` 方法在这里不是虚拟的，所以调用的是 `p1` 指针类型（即 `A` 类型）的 `test()` 方法。

综上所述，理论上，这段代码的行为是未定义的，特别是对 `p0->test();` 的调用。然而，在大多数情况下，你可能会看到输出 "A\nA\n"，因为两次调用都将最终调用 `A` 类的 `test()` 方法。如果你看到不同的输出，那可能是因为编译器或运行时环境的特定行为导致的。

---

为了确保代码的安全性和正确性，最佳实践是避免不安全的类型转换，并确保对象的类型与其使用方式相匹配。针对您提供的代码示例，我们可以进行以下改进：

1. **使用虚函数实现多态**:
   如果您希望通过基类指针调用派生类的函数，则应将基类中的函数声明为虚函数。这样，C++ 运行时可以正确地根据对象的实际类型来调用相应的函数。

   ```cpp
   class A {
   public:
       virtual void test() const {
           std::cout << "A\n"; 
       }
   };

   class B : public A {
   public:
       void test() const override {
           std::cout << "B\n";  
       }
   };
   ```

2. **避免不安全的类型转换**:
   - 不要强制将一个类的对象转换为另一个不兼容类的类型。在您的例子中，创建 `A` 类型的对象并将其转换为 `B*` 类型是不安全的，因为 `A` 并不是 `B`。正确的做法是创建与指针类型相匹配的对象。

3. **正确创建和使用对象**:
   - 创建与指针类型匹配的对象。这样，当你通过这些指针调用方法时，你可以确保它们表现出正确的行为。

   ```cpp
   int main() {
       A* p1 = new A;  // 创建 A 类型的对象
       B* p2 = new B;  // 创建 B 类型的对象

       p1->test();     // 调用 A 的 test 方法
       p2->test();     // 由于多态，这里会调用 B 的 test 方法

       delete p1;      // 释放对象
       delete p2;      // 释放对象
   }
   ```

这样修改后，代码不仅更安全，也更容易理解和维护。使用虚函数和正确的类型可以确保当你通过基类指针调用方法时，将会调用正确的派生类方法（如果有的话）。同时，正确的对象创建和类型匹配可以避免未定义行为的风险。

---


在C++中，进行安全的类型转换意味着确保在转换过程中不会丢失数据或破坏对象的类型安全性。针对您提供的类 `A` 和 `B`，以下是一些常见的安全类型转换方法：

1. **静态类型转换 (`static_cast`)**:
   用于在相关类型之间转换，例如将派生类指针转换为基类指针。这种转换在编译时检查，但不执行运行时类型检查。

   ```cpp
   B* b = new B;
   A* a = static_cast<A*>(b);  // 将派生类指针转换为基类指针
   ```

2. **动态类型转换 (`dynamic_cast`)**:
   主要用于处理多态。它在运行时检查对象的类型，确保转换的安全性。如果转换无效，对于指针类型，它会返回空指针。

   ```cpp
   A* a = new B;
   B* b = dynamic_cast<B*>(a);  // 安全转换，因为 a 实际上指向一个 B 对象
   if (b) {
       // 转换成功
   }
   ```

   这种转换只适用于包含虚函数的类。

3. **const类型转换 (`const_cast`)**:
   用于添加或移除对象的 `const` 属性。这种转换不改变对象的实际类型，而是改变我们访问对象的方式。

   ```cpp
   const A* a = new A;
   A* non_const_a = const_cast<A*>(a);  // 移除 const 属性
   ```

4. **重新解释类型转换 (`reinterpret_cast`)**:
   这是一种强大但危险的转换，用于将任何指针类型转换为任何其他指针类型（甚至无关类型）。它不检查安全性，因此除非绝对必要，否则应避免使用。

   ```cpp
   A* a = new A;
   B* b = reinterpret_cast<B*>(a);  // 强制转换，不考虑类型安全
   ```

在您的原始代码中，强制将 `A` 类型对象转换为 `B*` 类型是不安全的，因为 `A` 并非 `B` 的子类。在这种情况下，使用 `dynamic_cast` 或 `static_cast`（如果你确定转换是安全的）是更好的选择。然而，如果不确定转换是否安全，最好是避免这种类型的转换。

### C++继承

尝试验证 C++继承 是否是像 Java继承，运行下面的代码。

```cpp
#include <iostream>

class A {
public:
    A() {
        std::cout << "initialize A\n"; 
    }
    ~A() {}
    void test() const {
        std::cout << "test_A\n"; 
    }
}; 

class B : public A{
public:
    B()  {
        std::cout << "initialize B\n"; 
    }
    ~B() {}
    void test() const{
        std::cout << "test_B\n";  
    }
}; 

int main(){
    B* p0 = (B*) new A; 
    A* p1 = (A*) new B; 

    p0->test();
    p1->test(); 
}

```

输出的结果是

```
initialize A
initialize A
initialize B
test_B
test_A
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

