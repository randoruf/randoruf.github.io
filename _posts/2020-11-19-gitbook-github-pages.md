---
layout: post
title: "将 Gitbook 发布到 Github Pages"
date: 2020-11-19T00:20:00Z
---



跟一般的 HTML 没有太大区别。

唯一值得注意的是 `_book` 会被 Github 的 Jekyll 忽略掉。 

所以，如果要把 build 的文件放到一个专门命名的文件夹，比如 `docs`

```shell
gitbook build . docs
```

