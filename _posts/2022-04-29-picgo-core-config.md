---
layout: post
title: "配置 PicGo-core 的图床"
date: 2022-04-29
tags: [cs]
---
Notion 实际上可以用，把图片和资源全部弄到 github 和 icloud 上就可以了。

其中图床需要 **PicGo-core**  配置一下。

[Typora + PicGo-Core + Custom Command 实现上传图片到图床_班纳的博客-CSDN博客](https://blog.csdn.net/sinat_36112136/article/details/107708042)

[配置手册 | PicGo](https://picgo.github.io/PicGo-Doc/zh/guide/config.html)

---

### Typora 

Typora 在 Image 选 Custom Commands 。

```bash
/usr/local/bin/node /Users/haohua/.npm-global/lib/node_modules/picgo/bin/picgo upload
```

### PicGo-Core

```bash
picgo set uploader
```

然后按照指示设置就可以了。

