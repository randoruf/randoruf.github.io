---
layout: post
title: "统计代码行数"
date: 2021-03-21T00:20:0Z
---







用 Cloc 就可以了。 官方网站就有介绍怎么搞。

[AlDanial/cloc: cloc counts blank lines, comment lines, and physical lines of source code in many programming languages. (github.com)](https://github.com/AlDanial/cloc#install-via-package-manager)

用 Package Manager 安装 cloc

```
choco install cloc
```

然后可以统计一个文件

```
cloc hello.c
```

或者一个文件夹

```
cloc C:/hello/
```

什么？你不懂 System Path ？你不适合学 CS ， 尽早退学吧。