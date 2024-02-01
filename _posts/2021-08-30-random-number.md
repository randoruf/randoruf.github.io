---
layout: post
title: "随机数 - Mersenne Twister (MT19937)"
date: 2021-08-30T00:20:00Z
tags: [cs]
---



## 伪随机数

### What is Pseudorandom Number Generator (PNG)

假设 PNG 能够生成一连串的随机数字，这个叫 Pseudorandom Sequence 。

现在假设这段 Sequence 无限长 (**产生无限多个随机数**)，如果到某一点后会重复，这个位置就是 **周期**。

这个高中也有学过。

***一旦随机种子被选定，产生的 Pseudorandom Sequence 也是唯一的***。

所以在科研上，一般都会固定 Random Seed 来保证实验的可重现性 (reproducible, replicable)。

```cpp
int main(){
    mt19937 rng((unsigned int) 121);
    for (int i = 0; i < 5; i++){
        std::cout << rng() << ",";  
    }
    std::cout << "\n"; 
}
```

可以尝试一下，无论运行多少次，都是 

```
478162242,3398275541,905239816,4257211999,1000566260,
```

### Middle-Square Method 

- 选择一个 $$m$$ 位数 $$N_i$$ 作为**种子** 
- 计算 $$N_i^2$$
  - 若 $$N_{i}^2$$ 不足 $$2m$$ 位，在前面**补零**。
- 在这个数中选中间的 $$m$$ 个位，即 $$10^{\lfloor m/2\rfloor + 1}$$ 至 $$10^{\lfloor m/2\rfloor + m}$$ 
- 周期非常短，*周期取决于 Initial Random Seed 的大小*。

### Linear Congruential Generator 



<iframe width="560" height="315" src="https://www.youtube.com/embed/C82JyCmtKWg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/_tN2ev3hO14" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>



## 传统随机数

<https://www.cs.colostate.edu/~cs253/Fall19/Lecture/RandomNumbers>

已经不推荐使用了，因为有更好的随机数。

```cpp
#include <cstdlib>			/* srand, rand */
#include <ctime>				/* time */
#include <iostream>


int main() {
    std::srand(std::time(nullptr)); // use current time as seed for random generator 
    // roll 6-sided dice 20 times
    for (int n=0; n != 20; ++n) {
        int x = 7;
        while(x > 6) 
            x = 1 + std::rand()/((RAND_MAX + 1u)/6);  // Note: 1+rand()%6 is biased
        std::cout << x << ' ';
    }
}
```





## C++ 随机数

<https://www.cs.colostate.edu/~cs253/Fall19/Lecture/RandomNumbers>

- Generators
  - generates ***uniformly-distributed random integers***, typically zero or one to a big number. 
- Distributions 
  - Take uniformaly-distributed random integers
  - ***Transform*** them into other distributions with different range 

### 分布

此处只关注 ***Uniformaly-Distribution*** 和 ***Normal Distribution*** 。其他分布就太深入了。

除了可以从形状上分类，还可以从取值，即 ***Discrete*** 和 ***Continuous*** 。

### Mersenne Twister 

#### Mersenne Twister 范围

 C++ Seeding Surprises <https://www.pcg-random.org/posts/cpp-seeding-surprises.html>

我们知道 Mersenne Twister  完全取决于输入的 Random Seed 。

如果传入 random seed 的是 `unsigned int` 那么 `mt19937` 的范围是 $$[0, 2^{32}-1]$$ ，

这意味着至少需要 `unsigned int` 来储存。

- The number *4,294,967,295* is an integer equal to $$2^{32} − 1$$
- unsigned int = 4294967295 (0xffffffff)
- 这部分也可以在 Cppreference 找到

如果使用 `mt19937_64` 可以 `unsigned long long` 来保证 $$[0, 2^{64}-1]$$



## 参考 

<https://www.boost.org/doc/libs/1_66_0/doc/html/boost_random/tutorial.html>

<https://www.youtube.com/watch?v=k1lo6Wz2BbI>

<https://numpy.org/doc/stable/reference/random/bit_generators/mt19937.html>

<https://www.pcg-random.org/posts/cpp-seeding-surprises.html>

<https://www.pcg-random.org/posts/cpps-random_device.html>

