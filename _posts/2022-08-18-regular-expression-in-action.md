---
layout: post
title: 'Regular Expression in Action '
date: 2022-08-18
tags: [re]
---

* TOC 
{:toc}

---

## 目的
以场景的形式学习 Regular Expression 的技巧。


#### Case 1: 改变 Delimiter / 处理隔行文本

这里有一个思想转变，就是 new line `\n` 本质跟 comma `,` 没有区别。

有如下文本，我们需要处理成一行。

```
OPENSSL_cleanup
crypto_cleanup_all_ex_data_int
CRYPTO_THREAD_lock_free
CRYPTO_free
free

....

OPENSSL_sk_free
evp_app_cleanup_int
OBJ_NAME_cleanup
OPENSSL_LH_free
```

在 Visual Studio Code 输入

```
(.*?)(\n)
```

```
"$1", 
```

在替换之后 (变成了 1 行)

```
"OPENSSL_cleanup", "crypto_cleanup_all_ex_data_int", "CRYPTO_THREAD_lock_free", "CRYPTO_free", "free", "_pthread_rwlock_destroy", "OPENSSL_sk_pop_free", "engine_cleanup_int", "CRYPTO_THREAD_get_local", "pthread_getspecific", "evp_cleanup_int", "OBJ_sigid_free",
```

> **易错点**: 
> 不要写成 `(.)*` , 否则 `$1` 只会解读为 1 个字符。