---
layout: post
title: "How to use .gitignore?"
date: 2020-11-21T00:20:00Z
tags: [git]
---



Delete all existing `.DS_Store` and `Icon?` to provent Git from tracking the undesired files. 

```shell
find . -name .DS_Store -print0 | xargs -0 git rm -f --ignore-unmatch
```

```shell
find . -name "Icon?" -print0 | xargs -0 git rm -f --ignore-unmatch
```

Modiy the `.gitignore` file to ignore files and directory in all subdirectories. 

```
.DS_Store
node_modules/
_book/
Icon?
```

Commit and then push. 

