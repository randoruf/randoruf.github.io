---
layout: post
title: "Debugging Workflow"
date: 2020-12-21T00:20:00Z
tags: [cpp]
---



<https://courses.engr.illinois.edu/cs225/fa2020/labs/debug/>

## Debugging Workflow

From: *DEBUGGING: The 9 Indispensable Rules for Finding Even the Most Elusive Software and Hardware Problems* by David J. Agans

1. **Understand the System.**
   - Without a solid understanding of the system (the system defined as being both the actual machine you are running on as well as the general structure behind the problem you are trying to solve), you can’t begin to narrow down where a bug may be occurring. Start off by assembling knowledge of:
     - What the task is
     - What the code’s structure is
     - What the control flow looks like
     - How the program is accomplishing things (library usage, etc)
   - When in doubt, look it up–this can be anything from using Google to find out what that system call does to simply reading through your lab’s code to see how it’s constructed.
2. **Make it Fail.**
   - The best way to understand why the bug is occurring is to make it happen again–in order to study the bug you need to be able to recreate it. And in order to be sure it’s fixed, you’ll have to verify that your fix works. In order to do that, you’ll need to have a reproducible test case for your bug.
   - A great analogy here is to turn on the water on a leaky hose–only by doing that are you able to see where the tiny holes might be (and they may be obvious with the water squirting out of them!).
   - You also need to fully understand the sequence of actions that happen up until the bug occurs. It could be specific to a certain type of input, for example, or only a certain branch of an if/else chain.
3. **Quit Thinking and Look.**
   - After you’ve seen it fail, and seen it fail multiple times, you can generally have an idea of at least what function the program may be failing in. Use this to narrow your search window initially.
   - Start instrumenting your code. In other words, add things that print out intermediate values to check assumptions that should be true of variables in your code. For instance, check that that pointer you have really is set to `NULL`.
   - Guessing initially is fine, but only if you’ve seen the bug before you attempt to fix it. Changing random lines of code won’t get you to a solution very fast, but will result in a lot of frustration (and maybe even more bugs)!
4. **Divide and Conquer.**
   - Just like you’d use binary search on an array to find a number, do this on your code to find the offending line! Figure out whether you’re upstream of downstream of your bug: if your values look fine where you’ve instrumented, you’re upstream of the bug (it’s happening later on in the code). If the values look buggy, you’re probably downstream (the bug is above you).
   - Fix the bugs as you find them–often times bugs will hide under one another. Fix the obvious ones as you see them on your way to the root cause.
5. **Change One Thing at a Time.**
   - Use the scientific method here! Make sure that you only have one variable you’re changing at each step–otherwise, you won’t necessarily know what change was the one that fixed the bug (or whether or not your one addition/modification introduces more).
   - What was the last thing that changed before it worked? If something was fine at an earlier version, chances are whatever you changed in the interim is what’s buggy.
6. **Keep an Audit Trail.**
   - Keep track of what you’ve tried! This will prevent you from trying the same thing again, as well as give you an idea of the range of things you’ve tried changing.
7. **Check the Plug.**
   - Make sure you’re assumptions are right! Things like “is my Makefile correct?” or “am I initializing everything?” are good things to make sure of before blindly assuming they’re right.
8. **Get a Fresh View.**
   - Getting a different angle on the bug will often times result in a fix: different people think differently, and they may have a different perspective on your issue.
   - Also, articulating your problem to someone often causes you to think about everything that’s going on in your control flow. You might even realize what is wrong as you are trying to describe it to someone! (This happens a lot during office hours and lab sections!)
   - When talking to someone, though, make sure you’re sticking to the facts: report what is happening, but not what you think might be wrong (unless we’re asking you what you think’s going on).
9. **If you didn’t fix it, it ain’t fixed.**
   - When you’ve got something you think works, test it! If you have a reproducible test case (you should if you’ve been following along), test it again. And test the other cases too, just to be sure that your fix of the bug didn’t break the rest of the program.

## Print (`std::cout`) Statements!

`__LINE__` is a special compiler macro containing the current line number of the file.

```cpp
std::cout << "line " << __LINE__ << ": x = " << x << std::endl;
```

Try adding print statements before and after the calls to `original->readFromFile()`, `width()`, and `height()`. 

Then it is easy to know **which function call fails**. 



## Memory Checking

<https://courses.engr.illinois.edu/cs225/fa2020/labs/memory/>

The first utility you will learn about is Valgrind. 

Valgrind will help you detect **memory errors** and practice implementing the [big three](https://en.wikipedia.org/wiki/Rule_of_three_(C%2B%2B_programming)).

Valgrind is an extremely useful tool for debugging memory problems and for fixing segfaults or other crashes. 

**we will be checking for memory errors and leaks on your assignments**.

- Memory error (segmentation faults)
- Memory leak (dynamic memory management)

You should also be aware that Valgrind will only detect a leak if your program allocates memory and then fails to deallocate it. It **cannot find a leak unless the code containing the leak is executed** when the program runs.  

To check your program, run 

```cpp
valgrind --leak-check=full ./yourprogram
```

('full' will check both memory errors and leaks). 



Here is a list of some of the errors that Valgrind can detect and report. (Note that not all of these errors are present in the exercise code.)

- **Invalid read/write errors in heap.** This error will happen when your code reads or writes to a memory address which you did not allocate. Sometimes this error occurs when an array is indexed beyond its boundary, which is referred to as an “overrun” error. Unfortunately, ***Valgrind is unable to check for locally-allocated arrays (i.e., those that are on the stack.)*** Overrun checking is only performed for dynamic memory.

```cpp
int * arr = new int[6];
arr[10] = -5;  
```

- **Use of an uninitialized value.** This type of error will occur when your code uses a declared variable before any kind of explicit assignment is made to the variable.

```cpp
int x;
cout << x << endl;
```

- **Invalid free error.** This occurs when your code attempts to delete allocated memory twice, or delete memory that was not allocated with `new`.

```cpp
int * x = new int;
delete x;
delete x;
```

- **Mismatched `free() / delete / delete []`.** Valgrind keeps track of the method your code uses when allocating memory. If it is deallocated with different method, you will be notified about the error.

```cpp
int * x = new int[6];
delete x;
```

- Memory leak detection. Valgrind can detect three sources of memory leakage.
  - A **still reachable block** happens when you forget to delete an object, the pointer to the object still exists, and the memory for object is still allocated.
  - A **lost block** is a little tricky. A pointer to some part of the block of memory still exists, but it is not clear whether it is pointing to the block or is independent of it.
  - A **definitely lost block** occurs when the block is not deleted but no pointer to it is found.

```cpp
int * x = new int[6]; // no corresponding delete x
```

More information about the Valgrind utility can be found at the following links:

- <http://www.valgrind.org/docs/manual/quick-start.html>
- <http://www.valgrind.org/docs/manual/faq.html#faq.reports>
- <http://www.valgrind.org/docs/manual/manual.html>



## GDB: A Debugger

While Valgrind tells you what went wrong in your program after it has been executed, GDB is a debugging tool that allows you to see what is going on ‘inside’ your program WHILE it executes! It can also be used after your program has crashed for debugging purposes as well. In particular, **Valgrind works well for memory related errors**, **but GDB can handle crashes from those as well as other classes of bugs, such as logic errors**. To learn how to use GDB for your lab and mps, visit this page:

### 3 lines to find your segfault with GDB (use LLDB for macOS)

```bash
$ gdb allocate # "allocate" is the name of your executable file
(gdb) r # short for "run"
(gdb) bt # short for "backtrace"
```

 **Note** Throughout the lab, we’ll use the notation

```
(gdb) command...
```

to indicate that the `command` should be run from within GDB.

[Learn GDB](/shared/pdf/docs/CS225_GDB.pdf)

