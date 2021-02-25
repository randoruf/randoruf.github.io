---
layout: post
title: "conda安装包报错/"
date: 2021-02-22T00:20:00Z
---



[conda安装环境报错 - Tools&Platform Guide (tools-platform-guide.readthedocs.io)](https://tools-platform-guide.readthedocs.io/zh_CN/latest/anaconda/conda安装环境报错/)

使用`conda`安装时经常遇到以下问题：

```
$ conda install -c conda-forge opencv=4.2.0
Collecting package metadata (current_repodata.json): done
Solving environment: failed with initial frozen solve. Retrying with flexible solve.
Solving environment: / failed with repodata from current_repodata.json, will retry with next repodata source.
...
```

参考[conda安装环境报错：Solving environment: failed with initial frozen solve.](https://blog.csdn.net/weixin_41622348/article/details/100582862)

```
conda update -n base conda
conda update --all
```

全部更新后再安装

```
conda install -c conda-forge opencv=4.2.0 
```



