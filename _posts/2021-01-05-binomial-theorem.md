---
layout: post
title: "二项式定理 与 帕斯卡三角形"
date: 2021-01-04T00:20:00Z
tags: [math]
---

<https://blog.nowcoder.net/n/fa32a258416d4431bedc02475fc224ef>

杨辉三角的数字和二项式展开的系数有对应关系:

![](/shared/imgs/2021-01-05-21-45-03.png)

<div style="background-color:white"><img src="/shared/imgs/2021-01-05-21-45-32.png" style="zoom:100%;" /></div>


根据帕斯卡三角形形成的规律（上面两个数相加等于下面的数）有


$$
{n \choose i} =  {n-1 \choose i-1} +  {n-1 \choose i}
$$


其中 $$ n-1 $$ 代表上一行。



除了这种关系外，如果你写同一行（ $$n$$ 指同一行）， 与前一个的关系


$$
{n \choose i-1} = \frac{n!}{(i-1)!(n-(i-1))!} = \frac{n!}{(i-1)!(n-i+1)!} = \frac{n!}{(i-1)!(n-i+1)(n-i)!} \\
{n \choose i} = \frac{n!}{i!(n-i)!}
$$


显然有


$$
{n \choose i} =  \frac{n-i+1}{i} {n \choose i-1}
$$



第一种方法用代码表示 

```cpp
int n;
long long c[maxn][maxn];
void init(){
    for(int i = 0;i <= n;i++){  // 行数
        c[i][0] = 1; 
        for(int j = 1;j <= i;j++){ // i行的每个系数（第 i 行有 i 个系数）
            c[i][j] = (c[i-1][j-1]+c[i-1][j]);
        }
    }
}
```

第二种方法用代码表示

```cpp
int n;
long long c[maxn];
void init(){
    c[0] = 1;
    for(int i = 1;i <= n;i++){
        c[i] = c[i-1]*(n-i+1)/i;
    }
} 
```

