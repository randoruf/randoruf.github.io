---
layout: post
title: 'C++ Templates 模版'
date: 2022-08-16
tags: [llvm,cpp]
---

* TOC 
{:toc}

---

## 还在装修中
Under constructions..... 

(因为我还没有能力理解 C++ 模版)


#### Curiously Recurring Template Pattern (CRTP)  

这东东在 LLVM New Pass Manager 用了。詹哥也说了，***学这些高级概念需要结合项目***。可以在

例如去参加 2022年的 **[OceanBase 数据库大赛](#花絮)** 或者阅读 LLVM 源码。


[C++ Templates - Part 4 : Curiously Recurring Template Pattern](https://www.youtube.com/watch?v=7-nHdQjSRe0)

> **这个理论好像是偶然发现的** (有点神奇，CS 竟然不是像那种业务是故意设计出来的)。

目的都是 ***Reuse of Code***, 

下面的例子是 Python 或者 Java 的 ***Deep Clone*** 的样例

```cpp
#include <vector>
#include <iostream>

struct Shape{
    virtual ~Shape() = default;

    template <typename T> 
    T* Clone() {return new T(); }
};

struct Square : public Shape{
    int x = 1; 
};

struct Rectangle : public Shape{
    int x = 1, y = 1; 
}; 


int main(){
    std::vector<Shape*> v; 
    v.push_back(new Square()); 
    v.push_back(new Rectangle()); 

    for (int i = 0; i < 2; i++){
        Shape *s = v[i]; 
        Shape *c = nullptr; 
        if (Square *ds = dynamic_cast<Square*>(s)){
            c = s->Clone<Square>(); 
        }else if (Rectangle *ds = dynamic_cast<Rectangle*>(s)){
            c = s->Clone<Rectangle>(); 
        }
    }

    return 0; 
}
```
但是使用 CRTP 的概念后 (**使用 Template 辅助传递信息**)
```cpp
struct Shape{
    virtual Shape* Clone() = 0; 
    virtual ~Shape() = default;
    virtual void print() = 0; 
};

template <typename T> 
struct ShapeCRTP : public Shape{ 
    virtual Shape* Clone() override { return new T(*static_cast<T*>(this)); }
}; 

struct Square : public ShapeCRTP<Square>{
    int x = 1; 
    virtual void print() override{
        std::cout << "Square: (" << x << ")\n";  
    }
};

struct Rectangle : public ShapeCRTP<Rectangle>{
    int x = 1, y = 1; 
    virtual void print() override{  
        std::cout << "Rectangle: (" << x << ", " << y << ")\n";  
    }   
}; 


int main(){
    std::vector<Shape*> v; 
    v.push_back(new Square); 
    v.push_back(new Rectangle); 
    for (int i = 0; i < 2; i++){
        Shape *c = v[i]->Clone(); 
        c->print(); 
    }
    return 0; 
}
```




## 花絮
![2022-08-17-19-58-59.png](https://raw.githubusercontent.com/randoruf/photo-asset-repo/main/imgs/2022-08-17-19-58-59.png)

## 参考资料 
* 
* [GoF 23种设计模式解析附C++实现源码](https://manyones.files.wordpress.com/2010/07/dp-2nd.pdf)
* [CS 106L Standard C++ Programming](http://web.stanford.edu/class/cs106l/)
* [CS106B Programming Abstractions](https://web.stanford.edu/class/cs106b/)
* [(Mixin classes) CppCon 2016: Arthur O'Dwyer “Template Normal Programming (part 1 of 2)”](https://www.youtube.com/watch?v=vwrXHznaYLA)
* [Mixin Classes: The Yang of the CRTP](https://www.fluentcpp.com/2017/12/12/mixin-classes-yang-crtp/)
* [C++ Templates - Part 1: Why do we need templates?](https://www.youtube.com/watch?v=AvUMMljFzfI&list=PLAe2BCBg8rkIicrIjA6LyjiMn8GFaS6pJ&index=5)
* [C++ Templates - Part 2: Basic syntax, specialization, tag dispatch and SFINAE](https://www.youtube.com/watch?v=Vkck4EU2lOU&list=PLAe2BCBg8rkIicrIjA6LyjiMn8GFaS6pJ&index=6)
* [C++ Templates - Part 3: Type Deduction](https://www.youtube.com/watch?v=LY2Q9ej9Zn8&list=PLAe2BCBg8rkIicrIjA6LyjiMn8GFaS6pJ&index=7)
* [C++ Templates - Part 4 : Curiously Recurring Template Pattern](https://www.youtube.com/watch?v=7-nHdQjSRe0)