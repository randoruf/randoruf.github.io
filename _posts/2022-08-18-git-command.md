---
layout: post
title: 'Git 命令'
date: 2022-08-18
tags: [git]
---

* TOC 
{:toc}

---

### 新出现的文件

```bash
git ls-files -o  --exclude-standard
# git ls-files -o  --exclude-standard --full-name
# git status --short
```

> 误区1: 不用用 `git diff`, 因为新出现的文件不会被 tracked. 