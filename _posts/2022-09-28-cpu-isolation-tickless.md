---
layout: post
title: 'CPU Isolation (CPU隔离)'
date: 2022-09-28
tags: [linux]
---

* TOC 
{:toc}

---



## Check Interrupts 

```
sudo less /proc/interrupts
```

理想情况下，被隔离的 CPU 应该全部都是 0 的 (其实是不可能的，只要在独立的 CPU 上跑任务的时候，保证其不被中断就已经足够了)。


## Interrupts and Exceptions 

实际上只有 Hardware Interrupts 和 Software Exceptions (在 Intel 手册上又叫 software interrupts。但注意在 CSAPP 的概念分类里，Interrupts 仅考虑 Hardware Interrupts)

> x86 divides interrupts into (hardware) interrupts and software exceptions, and identifies three types of exceptions: faults, traps, and aborts.

* <https://en.wikipedia.org/wiki/Interrupt#Terminology>
* <http://www.linfo.org/software_interrupt.html>
* <https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux_for_real_time/9/html/understanding_rhel_for_real_time/index>
* Bryant, Randal E.; O’Hallaron, David R. (2016). "8.1.2 Classes of exceptions". *Computer systems: a programmer's perspective* (Third, Global ed.). Harlow. ISBN 1-292-10176-8.
* A full task-isolation mode for the kernel <https://lwn.net/Articles/816298/>
* <https://rigtorp.se/low-latency-guide/>

Hardware Interrupts 比较容易理解。看 RedHat 的书 *Understanding RHEL for Real Time* 和 CSAPP, 只要是起源于应 I/O Devices 的信号都是。 

> Hardware interrupts are used by devices to indicate a change in the physical state of the system that requires CPUs' attention.

Software Interrupts/Exceptions 一般是 运行程序的发起 **系统服务的请求** (软件如果需要访问硬件，必须发起 syscall)、程序崩溃、软件内部执行流的改变(比如 divde by zero 实际上可以在内部被处理的?)。 

> A software interrupt, also called an exception, is an interrupt that is caused by software, usually by a program in **user mode**.

通常是上下文切换(从用户态到内核态)会导致中断

> The task will lose isolation if it enters **kernel space** as the result of a system call, a page fault, an exception, or an interrupt.
> 
> from *A full task-isolation mode for the kernel* by Marta Rybczyńska 


## Interrupts-free Environment 

* [Shujie Cui - 学术报告 Side-channel attacks and countermeasures on Intel SGX](https://cyber.seu.edu.cn/2022/0611/c20213a411523/page.htm)
  * 如果是 Synchronous Interrupts, 我们可以把 SSA 保存起来，然后主动把 CPU 让给别的程序 (例如 nginx 等是属于 Event-driven 的程序，一直占着 CPU 其实很不合理)
  * 主要是避免 Asychronous Interrupts 


## CPU Isolation 

* [A full task-isolation mode for the kernel - Marta Rybczyńska](https://lwn.net/Articles/816298/)
* [CPU Isolation – Introduction – by SUSE Labs (part 1)](https://www.suse.com/c/cpu-isolation-introduction-part-1/)



### What is Jitter ? 

* NO_HZ: Reducing Scheduling-Clock Ticks <https://docs.kernel.org/timers/no_hz.html>
* <https://stackoverflow.com/questions/1336454/what-is-scheduling-jitter>

一般 Real-time Application 或者 Low-latency 的问题都需要**保证每个迭代的时间差**。程序在运行时，因为操作系统等原因被中断，从而造成时间差就是 Jitter 。

![](https://raw.githubusercontent.com/randoruf/photo-asset-repo/main/imgs/2022-09-30-15-28-04.png)


这里只考虑 Kernel 文档的[第三种情况](https://docs.kernel.org/timers/no_hz.html#omit-scheduling-clock-ticks-for-cpus-with-only-one-runnable-task) 。在一个运行任务的核心上忽略 ticks, 即 `CONFIG_NO_HZ_FULL=y` 。

注意该功能尽在 2018 年后的 kernel 生效，之前的版本最低是 1 HZ 的时钟。

> 其实设置 Tickless 的另一个好处是省电。如果是设置服务器的话，可以考虑 *Omit Scheduling-Clock Ticks For Idle CPUs* 的情况。 


### Case Study: [DPDK](https://www.dpdk.org/)

Sometimes, the task in the userspace can't be interrupts by any interferrences. 

> DPDK is one such example where high bandwidth networking packets are polled directly from userspace and any tiny disturbance from the kernel can cause packet loss.
> 
> ...
> 
> It is no surprise that such an interrupt executing 100 to 1000 times a second can be an issue for extreme workloads relying on an undisturbed, jitter-free CPU. Although fast, these interrupts still steal a few CPU cycles and can trash the CPU cache, resulting in cache misses when the user task resumes after the interrupts.
>  
> from *CPU Isolation – Introduction – by SUSE Labs (part 1)* by Frederic Weisbecker


> **TODO**: 
> Task isolation may cause CPU overheat (learn how DPDK solve this problem). 


### Introduction to CPU isolation

* 避免 system scheduler 把 task 分配到 被隔离的核心上。
* 关闭 internal timer / tickless
* 避免 硬中断 (IRQ) 发送到被隔离的核心上

最后通过 亲和性 绑定到特定核心上运行任务。

#### Escaping from Scheduler 

From A full task-isolation mode for the kernel https://lwn.net/Articles/816298/

The kernel must be enabled with `CONFIG_TASK_ISOLATION` (an option that is called CPU isolation). 

Then booted with the same options in `/etc/default/grub` as for nohz mode with CPU isolation:

```bash
GRUB_CMDLINE_LINUX_DEFAULT="isolcpus=nohz,domain,CPULIST"
```

* `nohz` disables the timer tick on the specified CPUs
* `domain` remove CPUs from scheduling algorithm (no tasks should run on the chosen CPUs unless you run task with CPU affinity) 


#### Timer: TickTack…Bomb

The legacy Linux kernel looks like 

![](https://raw.githubusercontent.com/randoruf/photo-asset-repo/main/imgs/2022-10-01-16-05-33.png)


By 2008, we could disable timer when the CPU is idle when the there is a 1HZ timer in the executing task. This could be achieved by `CONFIG_NO_HZ_IDLE=y` in the Kconfig kernel configuration file. 

![](https://raw.githubusercontent.com/randoruf/photo-asset-repo/main/imgs/2022-10-01-16-06-50.png)


In fact, `CONFIG_NO_HZ_IDLE` is recommended in the server as it saves a lot of energy. 

It took a few years to extend the tickless feature so that teh tick could be stopped even when the 

Since 2018 (see this post <https://www.codeblueprint.co.uk/2020/05/03/reducing-jitter-on-linux-with-task-isolation.html>), we could fully disable the 1Hz since 4.17. 


#### The History of Linux Task Isolation 

See the full list of bad kernel service that needs ticks *Adhoc: a virtual event to explore systems engineering* <https://www.youtube.com/watch?v=ZXUIFj4nRjk&t=1684s>

我们不想要

* Preemption (shared hardwar resources between tasks)
* Interrupts (hardware devices)
* Timers 
* RCU callbacks 

我们需要

* allocate dedicated hardware resources (CPU and IRQ affinity)
* Turn off kenerl features or offload to other CPUs
* Notification when isolation broken 

橘色外套黑人.jpg

The supports from the kernel 

* CPU affinity: `sched_getaffinity()` or `shed_setaffinty()` system calls. Or command line tool `taskset`
* Removing CPUs from scheduler: `isocpus=`
* Disable the interal timer
  * from 2008, the timer tick can be disabled when the CPU goes idle by `CONFIG_NO_HZ_IDLE`. 
  * from 2014, the `tickless` feature was introduced. It is confused, because a timer still fires once a second (1 Hz). It could also offload RCU callbacks throgh the `rcu_nocn=code`
  * from 2018, the fully tickless was implemented in v4.17. 
    * If you configure it correctly, you can run user space task without interruptions (the configuration is very complex, )
  * from 2020, if the application issuses a system call `prctl(PR_SET_TASK_ISOLATION,..)`, the task would be in hard isolation (get SIGKILL if any interrupts occur). 
  * TODO: add cgroups (cpusets) support. 

But, the timer tick can still be enabled for a bunch of reasons 
* perf events (perf tool)
* vmstat timer
* timers
* scheduler 
* RCU





The example of a user space CPU isolation library <https://github.com/abelits/libtmc/blob/master/isol.c>

```c
/*
 * Enter isolation mode.
 * This should be only called internally, from the request handler.
 */
static int start_isolation(int cpu){
	cpu_set_t set;

	/* Exit from isolation, if still in isolation mode */
	prctl(PR_SET_TASK_ISOLATION, 0, 0, 0, 0);

	if (mlockall(MCL_CURRENT))
		return -1;

	CPU_ZERO(&set);
	CPU_SET(cpu, &set);
	if (sched_setaffinity(0, sizeof(cpu_set_t), &set))
		return -1;

	return prctl(PR_SET_TASK_ISOLATION,
		     PR_TASK_ISOLATION_ENABLE
		     | PR_TASK_ISOLATION_USERSIG
		     | PR_TASK_ISOLATION_SET_SIG(SIGUSR1), 0, 0, 0);
}
```
#### Why Ticks are Bad? 

If we know that the appliaction will stay in a certain core, why we need ticks to interrupt its execution/computation ? 

* The ticks needs CPU cycle 
* CPU-cache trashing due to ticks 

> But the tick is needed by several subsystems that require either timed oneshot events (timer callbacks) or periodic events (scheduler, timekeeping, RCU, etc…).

To turn off the tick service, we need to provide alternaitves to those subsystems, such that these systems would not depend on the peridodic tick anymore. 

To do so, ***sacrifice at least one CPU off your isolated set in order to handle kernel boring internal work.***

***How about the system call ?***

Kernel based I/O bound workloads can result in IRQ. One way to avoid is I/O’s based on userspace drivers such as DPDK for example.

In summary, 

* sacrifice at least one CPU off your isolated set in order to handle kernel boring internal work.
* Full dynticks is only eligible for CPU bound workloads or **userspace drivers** based I/O’s.


#### Redirect Housekeeping Jobs to Other CPUs

<https://www.suse.com/c/cpu-isolation-housekeeping-and-tradeoffs-part-4/>


> ***哪有什么岁月静好，只是有人替你负重前行***
> ***There’s no such thing as a peaceful world. We feel like so because someone take on the burdens.***
> 
>  从南 (Author) 

If you want to isolate CPU 1,2,...7

```
nohz_full=1-7
```

Then CPU 0 will handle all housekeeping workload
* Unbound timer callbacks execution
* Unbound workqueues execution
* Unbound kthreads execution
* Timekeeping updates (jiffies and gettimeofday())
* RCU grace periods tracking
* RCU callbacks execution on behalf of isolated CPUs
* 1Hz residual offloaded timer ticks on behalf of isolated CPUs
* Depending on your extended setting:
  * Hardware IRQs that could be affine
  * User tasks others than the isolated workload


For a crazy server, it has serval NUMA nodes. It is easy to see that each NUMA node should have at least one housekeeping CPU (for its neighbours). 


![](https://raw.githubusercontent.com/randoruf/photo-asset-repo/main/imgs/2022-10-03-12-53-06.png)

If there are multiple NUMA nodes, then the setting should looks like 

```
nohz_full=1-7,9-15
```

Be careful that the housekeeping CPU is overwhelmed, use **top/htop** to monitor its CPU load (should be less than 100%). 


## Enough Talk ... Show Me What to Do

<https://www.suse.com/c/cpu-isolation-practical-example-part-5/>

> In this example, our setup is made of 8 CPUs. We are going to run a dummy userspace loop on the 8th CPU in a fully isolated fashion, ie: without any disturbance.


### 1) Kernel Configuration 

* `CONFIG_NO_HZ_FULL=y` - tickless (to stop the tick while running a task)
* `CONFIG_CPUSETS=y` - CPU isolation 
* `CONFIG_TRACING` - enables tracing to debug the CPU isolation.

### 2) Boot requirements

Using the “nohz_full=” boot parameter, the timer tick can be shutdown while running a single task. As we plan to isolate the 8th CPU, we need to boot the kernel with passing the following:

```
nohz_full=7
```

Also no need to set the “rcu_nocbs=” boot parameter as is commonly displayed in examples, nohz_full accomodates that automatically.

### 3) Tasks affinity

There are several ways to partition the CPUs between your isolated task and the rest of the system.

* cpuset 
* isolcpus
* taskset
* `sched_setaffinity()` syscall

#### 3.1) cpuset

The preferred way here is using [cpuset](https://www.kernel.org/doc/html/latest/admin-guide/cgroup-v1/cpusets.html).

Once the kernel has booted and in order to make sure that undesired tasks won’t disturb the CPU 7, we create two cpusets partitions.

A directory called “isolation” contains our isolated CPU that will run our isolated task in the future. Another directory called “housekeeping” takes the regular load. We force disable the load balancing to the “isolation” partition in order to make sure that no task can migrate from/to CPU 7 unless it is manually moved.

the default cpuset mount point

```bash
cd /sys/fs/cgroup/cpuset
mkdir housekeeping
mkdir isolated
echo 0-6 > housekeeping/cpuset.cpus
echo 0 > housekeeping/cpuset.mems
echo 7 > isolated/cpuset.cpus
echo 0 > isolated/cpuset.mems
echo 0 > cpuset.sched_load_balance
echo 0 > isolated/cpuset.sched_load_balance

while read P
do
  echo $P > housekeeping/cgroup.procs
done < cgroup.procs
```

Some of the writes to housekeeping/cgroup.procs may fail because kernel threads pids can’t be moved out of the root cpuset partition. However unbound kernel threads have their affinity automatically forced to the CPUs outside the nohz_full range so these failures can safely be ignored.


#### 3.2) Isolcpus

You can also achieve the same as the above cpuset setting using the “isolcpus=” kernel boot parameter. However this solution is not advised because the isolation configuration can’t be later changed on runtime. This is why “isolcpus” tends to be considered as “deprecated” despite it being still in use. It may remain useful with specialized or embedded kernels that haven’t been built with cpusets/cgroups support.

```
isolcpus=7
```

#### 3.3) Taskset, sched_setaffinity(), …

At a lower level, it is also possible to affine each individual task to the desired set of CPUs using tools like taskset or relying on APIs like sched_setaffinity().  On a setup without cpusets support, it has the advantage to allow for affinity change on runtime, unlike what “isolcpus” does. The drawback is that it requires more finegrained work.


### 4) IRQs affinity

We have dealt with tasks affinity but hardware interrupts can still fire on the isolated CPU and disturb its exclusive load. Fortunately we can arrange for firing these on the housekeeping set through the procfs interface:

```bash
# Migrate irqs to CPU 0-6 (exclude CPU 7)
for I in $(ls /proc/irq)
do
    if [[ -d "/proc/irq/$I" ]]
    then
        echo "Affining vector $I to CPUs 0-6"
        echo 0-6 > /proc/irq/$I/smp_affinity_list
    fi
done
```

> You’ll likely meet an I/O error on one of these interrupt vectors, the number 0 on x86-64 machines for example, because this is the per-CPU timer vector and it can not be moved away due to its local nature. However this issue can safely be ignored because “nohz_full” is purposely designed to address this.


### 5) Prevention from other disturbances

In this example we are dealing with straightforward scheduler and interrupt based disturbances. More advanced topics such as preventing from exceptions like page faults will be covered in subsequent articles.


### 6) The actual testing

Now most of the housekeeping load should be running on CPUs 0 to 6. The CPU 7 is expected to be ready for running userspace code without interrupting it. So let’s cook a dummy loop with a launcher.

#### 6.1) The dummy userspace loop

The following code binds the current task to the isolated cpuset (ie: CPU 7) and executes a dummy loop forever. It is intended to be started and then eventually killed by the separate launcher after running 10 seconds.

```c
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <errno.h>
int main(void)
{
    // Move the current task to the isolated cgroup (bind to CPU 7)
    int fd = open("/sys/fs/cgroup/cpuset/isolated/cgroup.procs", O_WRONLY);
    if (fd < 0) {
        perror("Can't open cpuset file...\n");
        return 0;
    }
   
    write(fd, "0\n", 2);
    close(fd);
   
    // Run an endless dummy loop until the launcher kills us
    while (1)
        ;
   
    return 0;
}
```

Include this code in a file named `user_loop.c` and build:

```
$ gcc user_loop.c -o user_loop
```


### Low-latency Tuning Guide 

<https://rigtorp.se/low-latency-guide/> 








--- 

## Backups 

Now we have many ways to disable the timer, for example `nohz_full`, `prctl`, `CONFIG_NO_HZ_FULL`

* NO_HZ: Reducing Scheduling-Clock Ticks <https://docs.kernel.org/timers/no_hz.html>
* Reducing jitter on Linux with task isolation <https://www.codeblueprint.co.uk/2020/05/03/reducing-jitter-on-linux-with-task-isolation.html>
* A full task-isolation mode for the kernel <https://lwn.net/Articles/816298/>
* dhoc: a virtual event to explore systems engineering <https://www.youtube.com/watch?v=ZXUIFj4nRjk&t=1684s>






--- 


## Backups

  

### When will tasks lose isolation (stopped by interferrences) ? 

> The task will lose isolation **if it enters kernel space as the result of a system call, a page fault, an exception, or an interrupt**.
> from *A full task-isolation mode for the kernel* by Marta Rybczyńska

The running task may leave the CPU if 
* voluntarily give up (usually symchronously) 
  * system call
* or by interferrences (usually asymchronously, handled by ISR Interrupt Service Routine)
  * exceptions 
  * interrupts (timers, kthreads/kernel threads)

This article only consider the 2nd circumstance 



### 什么是 IRQ (Interrupt Request) ? 

> An interrupt request (IRQ) is a request for service, sent at the hardware level. Interrupts can be sent by either a dedicated hardware line, or across a hardware bus as an information packet (a Message Signaled Interrupt, or MSI).

* [Introduction to Message-Signaled Interrupts - MSDN](https://learn.microsoft.com/en-us/windows-hardware/drivers/kernel/introduction-to-message-signaled-interrupts)
* [Chapter 3. Hardware interrupts on RHEL for Real Time - Red Hat](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux_for_real_time/9/html/understanding_rhel_for_real_time/assembly_hardware-interrupts-on-rhel-for-real-time_understanding-rhel-for-real-time-core-concepts)
* [4. The MSI Driver Guide HOWTO - Kernel Docs](https://docs.kernel.org/PCI/msi-howto.html)
* [4.3. Interrupts and IRQ Tuning - Red Hat Linux](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/performance_tuning_guide/s-cpu-irq)


### How to divide IRQ between cores ? 

* [4.3. Interrupts and IRQ Tuning - Red Hat Linux](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/performance_tuning_guide/s-cpu-irq)
* [SMP IRQ affinity - kernel docs](https://www.kernel.org/doc/html/latest/core-api/irq/irq-affinity.html)
* [Interrupts, and how to divide them between cores - Marcus Folkesson](https://www.marcusfolkesson.se/blog/interrupts-and-how-to-divide-them-between-cores/)
* [2.Interrupt request(IRQ) - Linux -- 进程或线程独占CPU](https://www.cnblogs.com/tuowang/p/9398837.html)

We have to modify `/proc/irq/default_smp_affinity` or `/proc/irq/IRQ#/smp_affinity` to redirect IRQ to cores. 

(an interrupt is associate with an interrupt id (TODO: not sure whether the id would be shared))... 

The default mask is `0xffffffff` (it depends on the number of cores your PC has). 

But how to calculate the CPU mask? 

See the Red Hat's document. 

* [6.3.7. Setting Interrupt Affinity on AMD64 and Intel 64 - Red Hat E Linux 7](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/performance_tuning_guide/sect-red_hat_enterprise_linux-performance_tuning_guide-cpu-configuration_suggestions#sect-Red_Hat_Enterprise_Linux-Performance_Tuning_Guide-Configuration_suggestions-Setting_interrupt_affinity)
* [RHEL7: How can I reduce jitter by using CPU and IRQ pinning without using tuna?](https://access.redhat.com/solutions/2144921)

For example, to handle interrupts by CPU 0 and CPU 1, use `0011` as the binary code in Python3:

```python
>>> hex(int('0011', 2))
0x3
>>> exit(0)
```

If isolate cpu 22 and 23, 

```python
>>> mask = '11' + '0'*(24-2)
'110000000000000000000000'
>>> mask[::-1][22]
'1'
>>> mask[::-1][23]
'1' 
```

To further redirect 



---

## Chrome


Chrome

<img src="https://raw.githubusercontent.com/randoruf/photo-asset-repo/6abb63c8f8cfe3e2ef36efd4595ff7e5c6c74005/imgs/2022-09-30-12-31-44.png" style="zoom:30%">


## 比较有用的资料

* Linux -- 进程或线程独占CPU <https://www.cnblogs.com/tuowang/p/9398837.html>
* What can interrupt execution of threads which are pinned to cores? <https://unix.stackexchange.com/questions/246087/what-can-interrupt-execution-of-threads-which-are-pinned-to-cores>
* CPU Isolation – Introduction – by SUSE Labs (part 1) <https://www.suse.com/c/cpu-isolation-introduction-part-1/>
* Performance Principles for Trusted Computing
with Intel SGX <https://munin.uit.no/bitstream/handle/10037/14666/article.pdf?sequence=3&isAllowed=y>
* Chrome 为什么多进程而不是多线程？ <https://www.zhihu.com/question/368712837>
* CS261: Security in Computer Systems <https://inst.eecs.berkeley.edu/~cs261/fa18/>