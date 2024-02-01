---
layout: post
title: "Linux下多线程"
date: 2021-01-28T00:20:00Z
tags: [cpp]
---



- `pthread_create() `
  - Simlar to `fork()` . Create a new **thread**. 
  - 用 `void*` 。这是早期的 **Polymorphism** 。
  - 要注意到 `     pthread_create(&thread_t, NULL, function_ptr, void *arg);` 最后是 `void *arg`， **只能传入一个参数**。
    - **解决方案就是 `struct ` 传入多个参数。**
-  `pthread_`



---

Linux 分为 **Joinable** 和 **Detached** 。

有些线程之间有依赖。比如先下载完网页，然后才打开网页。这叫 **Thread Synchronization** 。有些线程之间没有依赖， 比如 Sequential Search in an array 。

*Good Practice* ： 虽然你可以 *recursively create threads* (比如***你在一个 thead 里面又再创建另一个 thread***),  **但还是建议 thread 必须只由 main process 创建。** 你一定可以简化成这种结构的，如果太复杂只能证明你的设计不够好。

<img src="/shared/imgs/image-20210128113513826.png" alt="image-20210128113513826" style="zoom:33%;" />



- 需要 Synchronization (与其他进程有依赖) : ***Joinable***
  - 需要保留其 Stack 和 Descriptor ， 因为会被其他 Thread 使用。
  - 必须被其他线程获取或杀死(使用 `pthread_join()` 函数)，以释放内存资源。
  - `pthread_join()` 类似 `waitpid()` ， *等待某个 Joinable 线程完成*才能进行下一个动作。
- 独立的线程 : ***Detached***.
  -  不需要关心其 Stack 和 Descriptor。
  - 用 `pthread_detach()` 让某个 thread 变成 Detached 。这种进程在执行 `pthread_exit()` 后会自动释放内存资源，因为其资源不需要被其他进程使用。

- `pthread_exit()` 可以清理 thread 的资源，**避免 Zombie Threads**.  **所以用 `pthread_exit()` 代替 `exit()` 。**

```c
void print_fuck_who(void *name){
  char *my_name = (char *) name;
  printf("Fuck you - %s\n", name); 
}


pthread_t tid;
char name[] = "Randolph";
int status = pthread_create(&tid, NULL, print_fuck,  (void*) (&name));
// to make the thread as 'unjoinable' to release its resources later... 
pthread_detach(tid);
// pthread_detach
```

