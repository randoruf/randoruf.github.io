---
layout: post
title: "C++ 快速排序"
date: 2021-09-08
tags: [cpp]
---

现有

```cpp
  vector<pair<int, int>> ps; 
  ps.push_back({9, -1});
  ps.push_back({4, 1});
  ps.push_back({0, -1});
  ps.push_back({4, 2}); 
  ps.push_back({10, -1});
  ps.push_back({2, -1});
  ps.push_back({8, -1});
  ps.push_back({4, 3}); 
```

## Stable Sort

```cpp
std::stable_sort(ps.begin(), ps.end(), [](const pair<int, int>& a, const pair<int, int>& b){
    return a.first < b.first; 
}); 
```

输出 (可以看到 4 的相对顺序被保留)

```
(0), (2), (4: 1), (4: 2), (4: 3), (8), (9), (10), 
```

## Unstable Sort

```cpp
std::sort(ps.begin(), ps.end(), [](const pair<int, int>& a, const pair<int, int>& b){
	return a.first < b.first; 
}); 
```

输出

```
(0), (2), (4: 3), (4: 1), (4: 2), (8), (9), (10), 
```

## C++ 弱序符号 < 和 > 

C++ sort 对 Lambda 的定义非常严格。

**必须使用弱序符号， 如 `<` 和 `>`** 。使用 `<=` 和 `>=` 会造成未定义行为。

假设输入

```cpp
vector<pair<int, int>> ps; 
for (int i = 0; i < 10; i++){
  ps.push_back({0, i});
}
```

下面的代码会直接 `[1]    11468 segmentation fault  ./a.out`

```cpp
std::sort(ps.begin(), ps.end(), [](const pair<int, int>& a, const pair<int, int>& b){
	return a.first <= b.first; 
}); 
```

这是因为 `<=` 在相等的情况下会返回 `true` , **会有类似插入排序的行为**。也就是一直往前走，直到越界。

同样，对 `stable_sort` ，**用了 `<=` 就不再 Stable** 。  

```cpp
std::stable_sort(ps.begin(), ps.end(), [](const pair<int, int>& a, const pair<int, int>& b){
    return a.first <= b.first; 
}); 
```

输出

```
(0: 9), (0: 8), (0: 7), (0: 6), (0: 5), (0: 4), (0: 3), (0: 2), (0: 1), (0: 0), 
```

具体原理貌似要看 **STL 源码**，我有时间再看吧。

