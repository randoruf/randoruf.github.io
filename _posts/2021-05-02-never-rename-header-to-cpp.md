---
layout: post
title: "Visual Studio LNK4042 和 LNK2019 (直接改 Header file 到 Cpp 拓展名引发的错误)"
date: 2021-05-02
tags: [cpp]
---

* TOC
{:toc}

---

要注意， Visual Studio 对 Header 和 C++ file 有严格的区分。
如果你尝试直接把 Header File 的名字从 `hello.h` 直接更改为 `hello.cpp` ， 后续的编译可能会发生以下错误：

[c++ - Visual Studio 2010's strange "warning LNK4042" - Stack Overflow](https://stackoverflow.com/questions/3695174/visual-studio-2010s-strange-warning-lnk4042)

如果你把 header 移除，然后在 Visual Studio 重新加入 header file, 你发现有两个配置文件发生变化。

<img src="/shared/imgs/image-20210502170231412.png" alt="image-20210502170231412" style="zoom: 50%;" />

还有

<img src="/shared/imgs/image-20210502170247895.png" alt="image-20210502170247895" style="zoom:50%;" />

显然可以看出， 在之前， 

`DataRecorder.h` 被当成了 `cpp` 文件编译。 

然后如果你碰巧再写了一个 `DataRecorder.cpp` 文件， 就会提示编译重复。

就是如下错误

```
1 Debug\is.obj : warning LNK4042: object specified more than once; extras ignored

1 Debug\make.obj : warning LNK4042: object specified more than once; extras ignored

1 Debug\view.obj : warning LNK4042: object specified more than once; extras ignored

1 identity.obj : error LNK2019: unresolved external symbol void __cdecl
  test::identity::view(void) (?view@identity@test@@YAXXZ) referenced in function void __cdecl test::identity::identity(void) (?identity@0test@@YAXXZ)

1 identity.obj : error LNK2019: unresolved external symbol void __cdecl test::identity::make(void) (?make@identity@test@@YAXXZ) referenced in function void __cdecl test::identity::identity(void) (?identity@0test@@YAXXZ)

1 range.obj : error LNK2019: unresolved external symbol void __cdecl test::range::is(void) (?is@range@test@@YAXXZ) referenced in function void __cdecl test::range::range(void) (?range@0test@@YAXXZ)
```

