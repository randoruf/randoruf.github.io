---
layout: post
title: "C++内存分配"
date: 2021-07-27
tags: [cpp]
---



* TOC
{:toc}

## Heap 和 Stack 

老生常谈的话题了。 **千万不要返回 local scope (stack) 的 Pointer 或者 Reference** 。

- Pointer 和 Reference 的本质是一样的。都利用了**内存地址**实现

```c++
int* f(){
  int i = 10;
  return (&i); 
}
```

还有一种错误，叫使用未分配的内存空间。这种写法多半是过不了编译器的。

```c++
int *p; 
*p = 10; 
```

关于 Stack 和 Heap 到底哪个快? (Heap 会产生**碎片问题**)

- [CS 225 - Stack and Heap Memory (illinois.edu)](https://courses.engr.illinois.edu/cs225/sp2021/resources/stack-heap/)

## 最野内存分配

用 `malloc` , 内部也不会清零

```c++
struct Point{
	int x, y; 
}; 
// 三个点的数组
Point *p = (Point*) malloc(3*sizeof(Point)); 
```

而 `calloc` 就稍微像样点， 而且会清零。

```c++
// 三个点的数组
Point *p = (Point*) calloc(3, sizeof(Point));
```

最野的内存分配返回 `void` 类型的指针，所以需要***显式地 Casting*** 。

当然， `malloc` 的好处是可以随便 **`resize`** 。 

- 在 `vector<T>.resize()` 之类的操作中， **可能用了 `realloc()`**  ， 好处是避免了再次复制 (需要确认???)。 
- **但注意需要 `resize` 解决的，肯定能用 `free`  和 再次 `malloc` 解决的。** 虽然牺牲了效率，但提高了可读性。

释放内存需要 `free()`

## 有类型的内存分配 (Type Safe)

C++ 的 `new` 和 `delete` 会**自动检测类型** ，方便太多了。不需要***显式地 Casting*** ， 也不需要指定大小。

***而且 `new` 和 `delete` 会分别调用 Constructor 和 Destructor*** 

**术语警告**：自动转换指针类型叫 ***"Type Safe"*** 。 

易错点：

- `new` 对应 `delete` 
- `new[]` 对应 `delete[]`

```c++
// 三个点的数组 
Point *p = new Point[3]; 
```

释放内存需要 `delete`

### Operator Overloading 

注意到 `malloc` 和 `free` 是不能 Operator Overloading 的。

但 `new` 和 `delete` 就可以随便定义其行为。

- **一般作为 Member Function 来 Overlaoding** 
- 注意到以下 函数签名 是固定的， **`size` 代表这个 `MyClass` 的大小。**
- **例如下面就是 `size = 4` ， 代表 `int` 的 4 Bytes** 

[最好的C++教程_哔哩哔哩_bilibili - P39 The New Keyword in C++](https://www.bilibili.com/video/BV1VJ411M7WR?p=39)

```c++
#include <iostream>
#include <stdlib.h>

class MyClass{
    int _mymember;
public:
    MyClass() { }
    ~MyClass() { }

    void *operator new(size_t size){
        std::cout << "new: Allocating " << size << " bytes of memory" << std::endl;
        void *p = malloc(size);
        return p;
    }

    void operator delete(void *p){
        std::cout << "delete: Memory is freed again " << std::endl;
        free(p);
    }
 
    void *operator new[](size_t size){
        std::cout << "new: Allocating " << size << " bytes of memory" << std::endl;
        void *p = malloc(size);
        return p;
    }

    void operator delete[](void *p){
        std::cout << "delete: Memory is freed again " << std::endl;
        free(p);
    }
  
};

// ----------------------------------------------
int main(){
    MyClass *p1 = new MyClass();
    delete p1; 
    // ------------------------------------------
    MyClass *p2 = new MyClass[3]();
    delete[] p2;
}
```

### Placement New 

有时候， 需要**多次 Reconstruct 对象**。

- 注意到 ***Reconstruct*** 只是**内容改变了，但大小却没有改变**。
- 故可以将 Allocation 和 Construction 分开。
- 具体就是： ***一次 Alllocation, 多次 Construction*** 。

```c++
void *memory = malloc(sizeof(MyClass));
MyClass *object = new (memory) MyClass;
```

但此时的 Deallocation 就要用 `free` 。不能用 Delete 。

- 先运行 Deconstructor 释放对象
- 然后释放内存

```c++
object->~MyClass();
free(memory); 
```

## 内存泄漏

### Valgrind

- Linux

```bash
valgrind --leak-check=full --show-leak-kinds=all --track-origins=yes --log-file=~/debuglog.txt ~/a.out
```

Let us look at the call parameters one by one:

- **--leak-check** : Controls the search for memory leaks when the client program finishes. If set to `summary`, it says how many leaks occurred. If set to `full`, each individual leak will be shown in detail.
- **--show-leak-kinds** : controls the set of leak kinds to show when —leak-check=full is specified. Options are `definite`, `indirect`, `possible` `reachable`, `all` and `none`
- **--track-origins** : can be used to see where uninitialised values come from.

### Visual Studio debugger

- C Run-time Library (CRT) 

- 我最喜欢的 VS [Find memory leaks with the CRT Library - Visual Studio - Microsoft Docs](https://docs.microsoft.com/en-us/visualstudio/debugger/finding-memory-leaks-using-the-crt-library?view=vs-2019)

### Xcode

- Memory Graph , 其实还行。 [Xcode Debug Memory Graph - 内存调试利器 - 简书 (jianshu.com)](https://www.jianshu.com/p/e46839e788a9)

## 深浅拷贝 和 三原则

很简单，不想说了 [CS 225 - Lectures (illinois.edu)](https://courses.engr.illinois.edu/cs225/sp2021/pages/lectures.html) 的 Week 3, Week 4 有教。 

### Deep Copy and Shallow Copy 

```c++
int *v1 = new int[3]; 
int *v2 = new int[3]; 

// Deep Copy 
*v2 = *v1; 
// Shallow Copy 
v2 = v1; 
```

### Rule of Three

只要涉及了 Pointer 之类的，都要 ***Rule of Three*** 

重点是 Deep Copying 的 Overloading 和 **三原则 Rule of Three** 

- ***Destructor*** 
- ***Copy Constructor*** 
- ***Copy Assignment Operator*** 
  - 这个比较特别。通常一个 Class **至少需要实现 Allocate 和 Deallocate 的两个辅助函数**
  - Destructor 显然用了 deallocate 
  - Copy Constructor 显然用 allocate 
  - 而 **Copy Assignment Operator = Destructor + Copy Constructor** 
  - 因为 Copy Assignment Operator 可以理解为***先清除 LHS 旧内容, 再复制 RHS 新内容 到 LHS***。

```c++
#include <stdlib.h>
#include <iostream>

class Point{
private:
    int* c_ = NULL;  // x, y 坐标系

public:
    Point(int x, int y){
        c_ = (int *)malloc(2*sizeof(int));
        *c_ = x;
        *(c_+1) = y; 
    }
    // Rule 1 : Destructor 
    ~Point(){
        free(c_);
    }
    // Rule 2 : Copy Constructor 
    Point(Point &source){
        c_ = (int *)malloc(2*sizeof(int));
        *c_ = *source.c_;
        *(c_+1) = *(source.c_+1);
    }
    // Rule 3 : Copy Assignment Operator
    Point &operator=(Point &rhs){
        // 防止自赋值(&rhs 是 rhs 的地址)
      	if (this == &rhs)		return *this; 
        // 先 Destrcute , 然后 Copy Constructe (看前面的说明) 
   			free(c_); 
        // 以下和 Copy constructe 一模一样
        c_ = (int *)malloc(2*sizeof(int));
        *c_ = *rhs.c_;
        *(c_+1) = *(rhs.c_+1);
        // (需要返回 this 指针，以实现链式赋值)
        return *this;
    }
};

int main(){
  
    Point p(2, 8);
    Point p1(p); 
    Point p2(0, 0);
    Point p3 = (p2 = p);  // 链式赋值
  
    return 0;
}

```

## 智能指针 - Part 1 

In essence, **smart pointers are classes that are wrapped around raw pointers.** 

**By overloading the `->` and `*` operators**, smart pointer objects make sure that the memory to which their internal raw pointer refers to is properly deallocated. As soon as a smart pointer **goes out of scope**, its **destructor** is called and the block of memory to which the internal raw pointer refers is properly **deallocated**.

### Resource Acquisition Is Initialization (RAII)

RAII can be used to **protect a resource** such as a file stream, a network connection or a block of memory which need proper management. Why **RAII**?

#### Acquiring and Releasing Resources

就是**上完厕所**，然后**擦屁股**。看下面的例子就知道了，打开了文件， 用完了就要关掉。

<img src="/shared/imgs/image-20210729142119369.png" alt="image-20210729142119369" style="zoom: 50%;" />

1. Allocating memory with `new` or `malloc`, which must be matched with a call to `delete` or `free`.
2. Opening a file or network connection, which must be closed again after the content has been read or written.
3. Protecting synchronization primitives such as atomic operations, memory barriers, monitors or critical sections, which must be released to allow other threads to obtain them.

<img src="/shared/imgs/image-20210729141937105.png" alt="image-20210729141937105" style="zoom:33%;" />

#### Problems with Releasing Resources 

However, there are several problems with this seemingly simple pattern:

1. The program might **throw an exception during resource use** and thus the point of release might never be reached.
2. There might be several points where **the resource could potentially be released**, making it hard for a programmer to keep track of all eventualities (例如某学 UI 库自动帮你释放，然后你*多手*多脚在中途释放，UI 库就可能会出错).
3. We might simply **forget** to release the resource again.

### C++ 智能指针

1. The **unique pointer** `std::unique_ptr` is a smart pointer which exclusively owns a dynamically allocated resource on the heap. *<u>There must not be a second unique pointer to the same resource.</u>*  
2. The **shared pointer** `std::shared_ptr` points to a heap resource but does not explicitly own it. *<u>There may even be several shared pointers to the same resource, each of which will increase an internal reference count</u>*. As soon as this count reaches zero, the resource will automatically be deallocated.
3. The **weak pointer** `std::weak_ptr` behaves similar to the shared pointer but <u>*does not increase the reference counter*.</u>

#### Unique Pointer 

- **一个资源对应一个指针**。

  - 注意***可以使用 `move` 完成两个指针之间的 ownership 转移*** (不违反 unique pointer 的定义)。
  - `move` 可以告诉编译器，  `sourcePtr`  是 Rvalue (临时值)， 所以确实可以复制指针

  <img src="/shared/imgs/image-20210729170931600.png" alt="image-20210729170931600" style="zoom: 50%;" />

- 只能**在 Scope 里面使用**
  - **因为 `unique_ptr` 一旦 get out of scope**  , 就会被自动回收。
  - ***用起来实际上跟 Stack Variable (即 Local Variable) 没有区别***。
  - **`unique_ptr` 应该是默认选择**。
  - 虽然有点反直觉，但是 `unique_ptr` 可以作为 the ***return type*** of functions 。
    - 编译器会自动使用 `move` 完成转移。

```c++
// Use factory function (推荐)
std::unique_ptr<T> p1 = make_unique<T>(...); 
// Smart Pointer Constructor 
std::unique_ptr<T> p1(new T(...)); 
// Smart Pointer Assignment Operator 
std::unique_ptr<T> p1 = new T(...); 
// Move Constructor 
std::unique_ptr<T> p2(std::move(p1)); 
// Move Assignment Operator 
std::unique_ptr<T> p3 = std::move(p2); 
// 不能用别的 Copy 类的 Constructor ，否则就破坏了 Unique Pointer 要 “一个资源对应一个指针” 
```

可能你并不习惯，如果加上 `*` 之后， 是内容的赋值了。

```c++
std::unique_ptr<std::string> p1(new string("One")); 
std::unique_ptr<std::string> p2(new string("Two"));
std::unique_ptr<std::string> p3 = make_unique<std::string>("Three"); 

p1 = p2;  	// 编译器会报错 (因为 p1 是 Unique pointer )
*p1 = *p2; 	// 把 p2 的内容复制到 p1 
```

注意到 Smart Pointer 本身是一个 Class,  ***所以自身也有 attributes/methods 可以访问*** (但是 `*` 和 `->` 被 overloading 了)

```c++
p1.get(); 							// 获得 p1 的原始指针。
p1.reset(); 						// 释放 p1 管理的资源
p1.reset(new T(...));   // 释放 p2 管理的资源，并负责管理新的资源 (指针指向别的资源）。 
T* rp1 = p1.release();  // 让 p1 放弃资源所有权， 此时 rp1 为 raw pointer 
```

#### Shared Pointer 

- 如果有**一个指针引用了资源**， 那么 Reference Counter 就会增加。
- 如果引用资源的指针 get out of scopt, Reference Counter 就会减少。
- 当 Reference Counter == 0 时， 就代表**没有任何途径可以访问到这个资源**，可以释放。
- ***用起来实际上跟 Global Variable 没有区别***。**不会被局限于一个 Scope** 。

<img src="/shared/imgs/image-20210729185237125.png" alt="image-20210729185237125" style="zoom: 50%;" />

```c++
// Use factory function (推荐)
std::shared_ptr<T> p1 = make_shared<T>(...); 
// Smart Pointer Constructor 
std::shared_ptr<T> p1(new T(...)); 
// Smart Pointer Assignment Operator 
std::shared_ptr<T> p1 = new T(...); 
// 没有必要用 Move 类 Constructor .....所以略去 (真的需要 Move 的话，为什么不用 unique_ptr...)
// copy constructor 
std::shared_ptr<T> p2(p1); 
// copy assignment operator
std::shared_ptr<T> p3 = p1; 
```

同样， `shared_ptr<T>` 自身也有 **API**  ， 可以参考 [shared_ptr class - Microsoft Docs](https://docs.microsoft.com/en-us/cpp/standard-library/shared-ptr-class)

#### Weak Pointer 

主要解决一个使用场景，叫  ***circular reference***。

<img src="/shared/imgs/image-20210729193256876.png" alt="image-20210729193256876" style="zoom:33%;" />

- 当程序要释放 `p1` 时候， 由于 Dummy 1 的 Control Block 的 Counter 为 1  (因为 Dummy 2 在引用)，
  -  所以即使 `p1` 的释放并不会同时释放 Dummy 1 
- 而 `p2` 也同样，由于 Dummy 1 没有被释放，导致其 Counter 也为 1 ，
  - 所以即使 `p2` 的释放并不会同时释放 Dummy 2 

```c++
using namespace std; 

class Dummy{
public:
    std::shared_ptr<Dummy> sibling = nullptr; 
    Dummy(){
        std::cout << "Dummy Object created at " << this << std::endl; 
    }
    ~Dummy(){
        std::cout << "Dummy Object at " << this << " was released" << std::endl; 
    }
};

int main(){
    std::shared_ptr<Dummy> p1(new Dummy);
    std::shared_ptr<Dummy> p2(new Dummy); 
  
    // 产生 circular reference
  	p1->sibling = p2; 
    p2->sibling = p1; 
    return 0;
}
```

##### Weak Pointer Example 

- 注意:  **`weak_ptr` hold a non-owning reference to an object that is managed by another `shared_ptr`.**
  - 意思是不能单独使用 `weak_ptr` ， 必须配合 `shared_ptr` 使用。
  - **管理资源/对象的主体是 `shared_ptr`**

```c++
std::weak_ptr<Dummy> p1(new Dummy); // 编译器会报错，因为没有 shared_ptr 管理资源主体
```

```c++
int main(){
    std::shared_ptr<Dummy> p1(new Dummy);
    std::cout << "shared pointer count = " << p1.use_count() << std::endl; 

    std::weak_ptr<Dummy> p2(p1); 
    std::weak_ptr<Dummy> p3(p1); 
    std::cout << "shared pointer count = " << p1.use_count() << std::endl; 

    return 0;
}
```

<img src="/shared/imgs/image-20210729194644538.png" alt="image-20210729194644538" style="zoom:50%;" />

`weak_ptr` 要注意是否过期了。 用 **`expired()`** 即可。

   

#### 指针间的转换

- **(1)** 用 `std::move`  把 `unique_ptr` 转换到 `shared_ptr`
- **(2)** 把 `weak_ptr` 转换为 `shared_ptr`  (因为 `weak_ptr` 被指向的对象可能随时失效，这种转化可以保证对象有效)
- `shared_ptr` 无法转换为其他类型的指针。因为有 reference count 。

```c++
int main(){
    // construct a unique pointer
    std::unique_ptr<int> uniquePtr(new int);
    
    // (1) shared pointer from unique pointer
    std::shared_ptr<int> sharedPtr1 = std::move(uniquePtr);

    // (2) shared pointer from weak pointer
    std::weak_ptr<int> weakPtr(sharedPtr1);
    std::shared_ptr<int> sharedPtr2 = weakPtr.lock();

    return 0;
}
```

- **(3)** 要尽量避免使用原指针。因为**获得原指针的操作不会改变 Reference Counter** 

```c++
// (3) raw pointer from shared (or unique) pointer   
int *rawPtr = sharedPtr2.get();
delete rawPtr;
```



### 其他

- **R. 20 : Use unique_ptr or shared_ptr to represent ownership**
  - *如果发生了 Exception,  是很容易造成内存泄漏的*. ( 写 SDL2 的时候应该体会很深)
  - 除了你在函数的每一个出口都考虑如何释放资源（太难了）

- **R. 21 : Prefer unique_ptr over std::shared_ptr unless you need to share ownership**
  - 同上，如果发生 Exception,  需要在函数的每一个出口都考虑如何释放资源（太难了）
  - 如果用 `unique_ptr` ， 那么只要变量被 Stack 回收，就会自动释放。不用考虑函数出口 (alternative exit) 问题。
- **R. 22 : Use make_shared() to make shared_ptr**
- **R. 23 : Use make_unique() to make std::unique_ptr**
  - 因为用 factory functions 更少 overhead , 而且可以防止 constructor 就抛出 Exception 的情况。
  - 如果 constructor 就出错，这个临时对象是无法运行 desctructor 回收的。但是 factory functions 可以防止内存泄漏。
- **R. 24 : Use weak_ptr to break cycles of shared_ptr**
  - 如上面，类似还有 weak reference 
  - 要解决也是一样的情景 (虽然 wiki 写的是 *”指不能确保其引用的对象不会被垃圾回收器回收的引用。“* , 但显然这根本不是弱引用的本质)
  - 对于 Swift 来说，这种 Strong Reference Cycles 会阻止 GC 就非常明显了。
  - [What Is Automatic Reference Counting (ARC) (cocoacasts.com)](https://cocoacasts.com/what-is-automatic-reference-counting-arc)
  - 假设 CG 想回收 A ，但是 A 被 B 引用。所以 CG 只能先去回收 B , 但是 B 又被 A 引用。所以无限循环，根本不能回收。
  - 在这种情况下， 即使 Java 和 Swift 也会产生内存泄漏。
  - [How to Break a Strong Reference Cycle (cocoacasts.com)](https://cocoacasts.com/how-to-break-a-strong-reference-cycle)
  - 要打破这种 Deadlock , **可以让其中一个为 Weak Reference (在 C++ 叫 `weak_ptr`)。**
  - 也可以两个啦。

![What Are Strong Reference Cycles](/shared/imgs/figure-strong-reference-cycle-2.jpg)

![How to Break a Strong Reference Cycle](/shared/imgs/figure-break-strong-reference-cycle-1.jpg)





## 智能指针(引用计数) - Part 2 

智能指针的用法看 [Smart pointers (Modern C++) - Microsoft Docs](https://docs.microsoft.com/en-us/cpp/cpp/smart-pointers-modern-cpp?view=msvc-160)

<img src="/shared/imgs/image-20210729165851098.png" alt="image-20210729165851098" style="zoom: 33%;" />

- [请简述智能指针原理，并实现一个简单的智能指针。__牛客网 (nowcoder.com)](https://www.nowcoder.com/questionTerminal/c2c3fef0724c4a2f8a795c3cfd70a08c)
- 每次创建类的新对象时，初始化指针并将引用计数置为1；
  - 相当于 `new sharedPtr(val)` 。其中 `val` 是给 constructor 的参数。

<img src="/shared/imgs/image-20210727153059589.png" alt="image-20210727153059589" style="zoom:33%;" />

- 如果是 Copy Constructor 
  - 因为是**指针复制指针** (指针本身就是一个类)，所以是 Shallow Copy, 让 **引用计数 增加**
  - 相当于 `new sharedPtr(p1)`

<img src="/shared/imgs/image-20210727153251572.png" alt="image-20210727153251572" style="zoom:33%;" />

- 如果是 Copy Assignment Operator 
  - 也是 **指针复制指针**
  - 为了**防止自赋值**，要**减少左边指针的引用计数**， **增加右边指针的引用计数**
  - 这是因为**左边对象少了一次引用**(因为左边指针不再引用左边的对象)
  - 而**右边对象多了一次饮用**(因为左边指针要指到右边的对象)

![image-20210727153621583](/shared/imgs/image-20210727153621583.png)

- 调用析构函数时，构造函数减少引用计数（如果引用计数减至0，则删除基础对象）。
  - 因为已经没有指针指向 对象 了，

<img src="/shared/imgs/image-20210727154046511.png" alt="image-20210727154046511" style="zoom:33%;" />

```c++
template <typename T>
//辅助类 (即 control block)，该类成员访问权限全部为private，因为不想让用户直接使用该类
class RefPtr{
    friend class SmartPtr;//定义智能指针类为友元，因为智能指针类需要直接操纵辅助类
    RefPtr(T *ptr):p(ptr), count(1) { }
    ~RefPtr() { delete p; }
    int count; //引用计数
    T *p;      //基础对象指针
};

//智能指针类
template <typename T>
class SmartPtr{
public:
    SmartPtr(T *ptr):rp(new RefPtr(ptr)) { }            		//构造函数
    SmartPtr(const SmartPtr &sp):rp(sp.rp) { ++rp->count; } //复制构造函数
    SmartPtr& operator=(const SmartPtr& rhs) {              //重载赋值操作符
        ++rhs.rp->count;                                    //首先将右操作数引用计数加1，
        if(--rp->count == 0)                                //然后将引用计数减1，可以应对自赋值
            delete rp;
        rp = rhs.rp;
        return *this;
    }
    ~SmartPtr() {                                           //析构函数
        if(--rp->count == 0)                                //当引用计数减为0时，删除辅助类对象指针，从而删除基础对象
            delete rp;
    }
private:
    RefPtr *rp;                                             //辅助类对象指针
};
```

## 左右值

以前写的，直接复制来

![image-20210727161240832](/shared/imgs/image-20210727161240832.png)

- Why Lvalue and Rvalue https://www.youtube.com/watch?v=fbYknr-HPYE

To summarise,

- **Lvalue**
  - left hand side of the assignment operator `=`
  - An expression that yields an **object** or **function**, which has an associated ***memory location***.
  - It should ***exist for a long time.***
- **Rvalue**
  - right hand side of the assignment operator `=`
  - An expression that yields a **const value** but not the associated memory location
  - A ***tempoary*** object generated by compiler (will be destroyed once the calculation finishes).

And see some examples from the vidoes above.

If you only want to use **Rule of Three**, by default, you must go with the Google C++ Style

```c++
Y function(const X& x){
  // Both Lvalue and Rvalue reference will work , 因为值不变
}
```

The Lvalue reference

```c++
int x = 10; 
int& x2 = x; 
```

The ***Rvalue reference*** (看清楚了哦，***Rvalue 也可以使用引用哦***)

```c++
const int& x2 = 10; 
```

在 C++11 , ***Rvalue Reference*** 是以下格式

原因是 `i + j` 是一个临时变量。如果 `int l = i + j`  ， 那么 `i + j` 这个临时变量，又被复制到 `l` 。

那为什么要复制一个临时变量，***不直接把 Rvalue Value 放置到 `l` 呢？*** 用了 `Rvalue Reference` 可以让临时变量直接弄到 `l` 上。

```c++
int i = 1; 
int j = 2; 
int &&l = i + j;  // Rvalue Reference 
```

That means if you label the **pass-by-reference parameter** by `const`, it should be compatible with L and R value reference.

### Move Semantics (Transfer Ownership)

- Move Semantics in C++ https://www.youtube.com/watch?v=fbYknr-HPYE
- C++ 11: Rvalue Reference -- Move Semantics https://www.youtube.com/watch?v=IOkgBrXCtfo

我们知道 **Rvalue 是临时**， 如果是**临时变量**， 可以**直接转移所有权 (Transfer Ownership)** 

The **Rvalue Reference** is `&&` instead of `&` in Lvalue reference.

#### Rvalue Reference 

正常情况下， `void myFunction(int val)` 需要在 Stack 复制 argument val ， 会浪费内存。

但如果我们知道传入 `myFunction()` 的 argument 是 **Rvalue**  , 就可以**直接转移所有权** (argument 现在为 `myFunctio` 所有， 而不是 `main` 所有)。 

```c++
void myFunction(int &&val){
    std::cout << "val = " << val << std::endl;
}

int main(){
    myFunction(42);
    return 0; 
}
```

注意， **如果 argument 是 Lvalue**  , 无法转移所有权。以下情况会编译出错。

```c++
void myFunction(int &&val){
    std::cout << "val = " << val << std::endl;
}

int main(){
    int i = 42; 
    myFunction(i);
    return 0; 
}
```

但你可以用 `std::move()`  （不推荐， 如果你后面再用了 `i`  ，就出错了）

```c++
void myFunction(int &&val){
    std::cout << "val = " << val << std::endl;
}

int main(){
    int i = 42; 
    myFunction(std::move(i));
    return 0; 
}
```

#### Move Constructor 

以下两个用 Rvalue Reference 的 **Copy Constructor** 和 **Copy Assignment Operator** 跟前面的 "**Rule of Three**" 构成了 "**Rule of Five**" 。 但本质上，还是 Rule of Three 。 因为 Rule of Five 仅仅提高了效率..... 

```c++
// --------------------------------------------------
// Rule 4 : Move Constructor 
Point(Point &&other) noexcept {
  c_ = other.c_; 		  // 把 other 的内容偷过来... 
  other.c_ = NULL;    // 原来的 other 实际上是空壳了.... 
}

// -------------------------------------------------
// Rule 5 : Move Assignment Operator 
Point &operator=(Point &&other) noexcept {
  // 防止自赋值
  if (this == &other)		return *this; 
  // 清除旧的内容
  free(c_); 
  // 偷传入对象 other 的内容 
  c_ = other.c_; 
  // 原来的对象是空壳
  other.c_ = NULL; 
  // 为了 链式赋值
  return *this; 
}
```

**Not by copying it** but ***by redirecting the data handles***. **<u>The source instance will no longer be usable afterwards.</u>** 

***The ownership has been successfully changed (or moved)*** without the need to copy the data on the heap.

<img src="/shared/imgs/image-20210727222916916.png" alt="image-20210727222916916" style="zoom: 50%;" />

#### STL 的 Move Semantics 应用

**注意到 C++ STL 全面支持 Rule of Five** 

例如 `std::vector<T>`  有两种插入操作

- `emplace_back(T&& arg)`      <https://en.cppreference.com/w/cpp/container/vector/emplace_back>
- `push_back(const T& arg)`   <https://en.cppreference.com/w/cpp/container/vector/push_back>

由于 `emplace` **本身已经是 move constructor 了**， 不需要 `std::move` 。

```c++
class Point{
public: 
  int x, y; 
}; 
// ------------------------------
std::vector<Point> v1; 
// 临时变量被复制(多了一步复制)
v1.push_back(Point(0, 0));
// 临时变量被直接偷走(效率更高)
v1.emplace_back(Point(0, 0)); 
```

**STL 容器的自动优化** 。 这种优化，几十年前就有人想到了

```c++
#include <iostream>
#include <vector>
#include <cmath>

using namespace std;

const int array_size = 1e6;
vector<int> RandomNumbers3(){
    vector<int> random_numbers;
    random_numbers.resize(array_size);
    for (int i = 0; i < array_size; i++){
        random_numbers[i] = rand();
    }
    return random_numbers; // return-by-value of the STL vector
}

int main(){
    // 即使写的是 Return-by-Value , STL 因为自动支持 Move Sematics, 会自动优化。
    vector<int> random_numbers_3 = RandomNumbers3(); 
}
```



#### Moving lvalues

At some point in your code, you might want to **transfer ownership of a resource to another part of your program as it is not needed anymore in the current scope.**

The function **`std::move`** accepts an lvalue argument and returns it as an rvalue without triggering copy construction.

Either in the form of **move constructor** or the **move assignment operator**. 

***以下代码不符合 Rule of Five*** (不是好风格) ， **因为如果要实现其中一个 Rule , 就必须要全部实现其他 Rules **。

```c++
#include <iostream>

class MyMovableClass{
private:
    int _size;
    int *_data = nullptr;

public:
    MyMovableClass(size_t size){
        _size = size;
        _data = new int[_size];
        std::cout << "CREATING instance at" << this << " with size = " << _size*sizeof(int)  << " bytes\n";
    }
  
    ~MyMovableClass(){
       if (_data){ 
        	std::cout << "DELETING instance of MyMovableClass at " << this << std::endl;
        	delete[] _data;
       }
    }
  
    // 2 : copy constructor
    MyMovableClass(const MyMovableClass &source){
        _size = source._size;
        _data = new int[_size];
        // 注意 *_data 是对象赋值!!  (不是指针赋值)
        *_data = *source._data;   
        std::cout << "COPYING content of instance " << &source << " to instance " << this << std::endl;
    }
    // 3 : copy assignment operator
    MyMovableClass &operator=(const MyMovableClass &source) {
        std::cout << "ASSIGNING content of instance " << &source << " to instance " << this << std::endl;
        if (this == &source) // 防止自赋值
            return *this;
        if (_data){          // 清除 LHS 内容
        	delete[] _data;
        }
        _data = new int[source._size];
        *_data = *source._data;  // 对象赋值 (*_data) 是对象。
        _size = source._size;
        return *this;
    }
    
	  MyMovableClass(MyMovableClass &&source) {
        std::cout << "MOVING (c’tor) instance " << &source << " to instance " << this << std::endl;
        _data = source._data;
        _size = source._size;
        source._data = nullptr;
        source._size = 0;
    }
  
    MyMovableClass &operator=(MyMovableClass &&source){
        std::cout << "MOVING (assign) instance " << &source << " to instance " << this << std::endl;
        if (this == &source)
            return *this;
      
        delete[] _data;
        _data = source._data;
        _size = source._size;
        source._data = nullptr;
        source._size = 0;
        return *this;
    }
};
```

The ownership of the resources within `obj1` was passed to the function `useObject`.

**The instance `obj1` has been invalidated** by setting its internal handle to null. 

可以看到，**用 Move Construtor 后只释放了一次空间**。

```c++
int main(){
    MyMovableClass obj1(100); // constructor
    MyMovableClass obj2(std::move(obj1));
    return 0;
}
```

![image-20210728162739961](/shared/imgs/image-20210728162739961.png)

如果 Move Assignment 

```c++
int main(){
    MyMovableClass obj1 = MyMovableClass(100); 
    MyMovableClass obj2 = std::move(obj1);
    return 0; 
}
```

![image-20210728164327795](/shared/imgs/image-20210728164327795.png)

如果使用 Copy Consturctor  

```c++
int main(){
    MyMovableClass obj1(100); // constructor
    MyMovableClass obj2(obj1);
    return 0;
}
```

![image-20210728163339506](/shared/imgs/image-20210728163339506.png)

 如果使用 Copy Assignment 

```c++
int main(){
    MyMovableClass obj1(100); // constructor
    MyMovableClass obj2 = obj1;
    return 0;
}
```

![image-20210728163445526](/shared/imgs/image-20210728163445526.png)

---

