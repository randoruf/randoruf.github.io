---
layout: post
title: 'Git 命令'
date: 2022-08-18
tags: [git]
---

* TOC 
{:toc}

---


### Git Merge 

但 `main` 有更新的时候，我们想从 `main` 拉取最新的修改

```bash
git checkout ＜branchname＞
git marge main
```
### 使用 Keyring 避免重复输入密码

> **提示**:
> From 2021, GitHub would not longer to allow authentication by using the account passwords. You could generate a new token and use it as the account password. For example, when git is asking the password, **just key in the token**. 

有两种方法，
* 个人电脑: 可以 `git config credential.helper store` 保存到 `~/.git-credentials` , 由于你就是 root user, 所以没有太大问题
* 公共电脑: 可以使用 **Keyring/Keychain** 来储存你的密码。比如 macOS 就可以 `git config credential.helper osxkeychain` ，其他发行版 KDE, gnome 需要其他指令。

<https://oracleyue.github.io/post/git-keyring/>



### 新出现的文件

```bash
git ls-files -o  --exclude-standard
# git ls-files -o  --exclude-standard --full-name
# git status --short
```

> 误区1: 不用用 `git diff`, 因为新出现的文件不会被 tracked. 