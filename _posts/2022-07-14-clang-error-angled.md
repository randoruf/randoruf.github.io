---
layout: post
title: 'Clang 提示 file not found with \<angled\> include; use "quotes" instead 错误'
date: 2022-07-14
tags: [cs,cpp,os]
---

Clang 有的时候会提示

```
xxx file not found with <angled> include; use "quotes" instead 
```

意思是找到了使用 `#include <sqlite3.h>` 的头文件包含代码。

当然我们知道这是非标准写法 `<angled>` 是系统头文件，而 `"quotes"` 是自定义头文件。

这点要记住，你不会这么写，但不代表你的同事不会这么写。

