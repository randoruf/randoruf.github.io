---
layout: post
title: "在 Mac 上使用 Github "
date: 2020-09-20T00:20:00Z
---





因为 Mac OS 会有很多奇怪的图标。 例如 `Icon` 和 `.DS_Store`. 

要删除这些文件 

```
find . -type f -name 'Icon?' -print -delete
```

和 

```
find . -type f -name '.DS_Store' -print -delete
```



然后

<https://stackoverflow.com/questions/17556250/how-to-ignore-icon-in-git>