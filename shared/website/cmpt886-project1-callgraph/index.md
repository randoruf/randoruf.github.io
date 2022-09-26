---
layout: page
title: "CMPT 886  Automated Software Analysis & Security - Project 1 - Weighted Call Graphs"
---

This project will help you get acquainted with using infrastructures like LLVM to gather basic information about computer programs. You will also gain some experience recognizing limitations and trade-offs made when designing and constructing a dynamic analysis tool.

For this project, you will construct an LLVM tool that can compute and output a weighted dynamic call graph for an execution of an input program.

As a reminder, a call graph is a directed graph where the nodes represent the functions within a program. An edge exists from foo() to bar() when foo() may call bar(). Such call graphs can be helpful for examining the structure of a program, and they are also a crucial first step in many other analyses. They are especially useful for understanding programs with indirect calls or function pointers. For such programs, a single call site in a program may call many different functions across different program executions or even within a single execution of a program. These graphs can also be made more informative by noting the precise call sites or lines in foo() that make calls to bar().

The dynamic weighted call graphs that you construct for this project shall show the observed call targets for each call site within an execution of the program. In addition, they shall show the weight of an edge in the call graph, the number of times that particular function was the target of that call site. For example, consider the simple program:

example.c

```cpp
#include <stdio.h>

void foo(int i) {
  printf("Blimey!\n");
}


void bar(int i) {
  if (i > 0) {
    bar(i - 1);
  }
}


int main(int argc, char** argv) {
  for (unsigned i = 0; i < 10; ++i) {
    void (*fptr)(int) = (i % argc) ? foo : bar;
    fptr(i);
  }
  return 0;
}
```

Then running the commands:

```bash
clang -S -emit-llvm -g example.c
callgraph-profiler example.ll -o example
./example 2 3
```

shall produce a CSV (Comma Separated Value) file called profile-results.csv in the current directory that looks like:

```
foo, example.c, 6, printf, 6
bar, example.c, 13, bar, 18
main, example.c, 22, bar, 4
main, example.c, 22, foo, 6
```

This CSV format encodes each edge in the dynamic call graph on a separate line. The format of a single line is:

```
<caller function name>, <call site file name>, <call site line #>, <callee function name>, <(call site,callee) frequency>
```

The last column on the line is the number of times that the callee (the call target) was called from that particular call site.

The CSV format is easy for you to produce and easier for me to grade, but it is perhaps challenging to understand. You are also provided with a script that can automatically convert the CSV format into a Graphviz formatted output like:

```
digraph {
  node [shape=record];
  "main"[label="{main|<l0>example.c:22}"];
  "main":l0 -> "bar" [label="4",penwidth="1.11",labelfontcolor=black,color="#380000"];
  "main":l0 -> "foo" [label="6",penwidth="1.67",labelfontcolor=black,color="#550000"];
  "foo"[label="{foo|<l0>example.c:6}"];
  "foo":l0 -> "printf" [label="6",penwidth="1.67",labelfontcolor=black,color="#550000"];
  "bar"[label="{bar|<l0>example.c:13}"];
  "bar":l0 -> "bar" [label="18",penwidth="5.0",labelfontcolor=black,color="#ff0000"];
  "printf"[label="{printf}"];
}
```


<svg style="display: block;margin:auto;" width="200pt" height="241pt" viewBox="0.00 0.00 199.50 241.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(4 237)">
<title>%3</title>
<!-- printf -->
<g id="node1" class="node"><title>printf</title>
<polygon fill="none" stroke="black" points="123,-0.5 123,-36.5 177,-36.5 177,-0.5 123,-0.5"></polygon>
<text text-anchor="middle" x="150" y="-14.8" font-family="Times,serif" font-size="14.00">printf</text>
</g>
<!-- main -->
<g id="node2" class="node"><title>main</title>
<polygon fill="none" stroke="black" points="61,-186.5 61,-232.5 151,-232.5 151,-186.5 61,-186.5"></polygon>
<text text-anchor="middle" x="106" y="-217.3" font-family="Times,serif" font-size="14.00">main</text>
<polyline fill="none" stroke="black" points="61,-209.5 151,-209.5 "></polyline>
<text text-anchor="middle" x="106" y="-194.3" font-family="Times,serif" font-size="14.00">example.c:22</text>
</g>
<!-- bar -->
<g id="node3" class="node"><title>bar</title>
<polygon fill="none" stroke="black" points="0,-88.5 0,-134.5 90,-134.5 90,-88.5 0,-88.5"></polygon>
<text text-anchor="middle" x="45" y="-119.3" font-family="Times,serif" font-size="14.00">bar</text>
<polyline fill="none" stroke="black" points="0,-111.5 90,-111.5 "></polyline>
<text text-anchor="middle" x="45" y="-96.3" font-family="Times,serif" font-size="14.00">example.c:13</text>
</g>
<!-- main&#45;&gt;bar -->
<g id="edge1" class="edge"><title>main:l0-&gt;bar</title>
<path fill="none" stroke="#380000" stroke-width="1.11111" d="M106,-186C106,-175.597 91.3472,-157.736 76.4046,-142.226"></path>
<polygon fill="#380000" stroke="#380000" stroke-width="1.11111" points="78.6276,-139.496 69.1088,-134.844 73.6489,-144.417 78.6276,-139.496"></polygon>
<text text-anchor="middle" x="101.5" y="-156.8" font-family="Times,serif" font-size="14.00">4</text>
</g>
<!-- foo -->
<g id="node4" class="node"><title>foo</title>
<polygon fill="none" stroke="black" points="108.5,-88.5 108.5,-134.5 191.5,-134.5 191.5,-88.5 108.5,-88.5"></polygon>
<text text-anchor="middle" x="150" y="-119.3" font-family="Times,serif" font-size="14.00">foo</text>
<polyline fill="none" stroke="black" points="108.5,-111.5 191.5,-111.5 "></polyline>
<text text-anchor="middle" x="150" y="-96.3" font-family="Times,serif" font-size="14.00">example.c:6</text>
</g>
<!-- main&#45;&gt;foo -->
<g id="edge2" class="edge"><title>main:l0-&gt;foo</title>
<path fill="none" stroke="#550000" stroke-width="1.66667" d="M106,-186C106,-170.412 113.376,-155.268 122.087,-142.817"></path>
<polygon fill="#550000" stroke="#550000" stroke-width="1.66667" points="125.019,-144.742 128.258,-134.654 119.435,-140.521 125.019,-144.742"></polygon>
<text text-anchor="middle" x="119.5" y="-156.8" font-family="Times,serif" font-size="14.00">6</text>
</g>
<!-- bar&#45;&gt;bar -->
<g id="edge3" class="edge"><title>bar:l0-&gt;bar</title>
<path fill="none" stroke="#ff0000" stroke-width="5" d="M49.3073,-111.712C53.6428,-130.999 52.207,-159 45,-159 41.1086,-159 38.8998,-153.08 38.3735,-145.08"></path>
<polygon fill="#ff0000" stroke="#ff0000" stroke-width="5" points="42.7497,-145.028 38.5285,-134.962 34.0007,-144.894 42.7497,-145.028"></polygon>
<text text-anchor="middle" x="45" y="-162.8" font-family="Times,serif" font-size="14.00">18</text>
</g>
<!-- foo&#45;&gt;printf -->
<g id="edge4" class="edge"><title>foo:l0-&gt;printf</title>
<path fill="none" stroke="#550000" stroke-width="1.66667" d="M150,-88C150,-74.4789 150,-59.4566 150,-46.9335"></path>
<polygon fill="#550000" stroke="#550000" stroke-width="1.66667" points="153.5,-46.6722 150,-36.6722 146.5,-46.6723 153.5,-46.6722"></polygon>
<text text-anchor="middle" x="153.5" y="-58.8" font-family="Times,serif" font-size="14.00">6</text>
</g>
</g>
</svg>
 
## Issues to keep in mind
IR Intrinsics -- LLVM inserts calls to some functions in order to represent
information within the IR.
In particular, some debugging information is anchored by calls to functions
that have names starting with `llvm.dbg`.
You should ignore these functions in your callgraph.

Recursion -- Both direct and mutual recursion must work correctly.
For this project, recursion shouldn't pose any special problems, but it is
always a useful corner case to bear in mind.

Disconnected graphs -- Not every function may be reachable from the main
function.
As a result, the call graph may form several disconnected components.
Your implementation must be able to handle this.

Pointers -- Handling indirect function calls inherently leads to imprecision.
You must select and implement one approach for constructing a call graph even
in the presence of function pointers.
On top of learning the basics of LLVM, this issue poses the greatest challenge
for the project.
There are several different approaches that you may take for trying to compute
a more precise call graph even in the presence of function pointers.
In (I think) increasing order of difficulty, some possible approaches are:

* Use argument and return type information to disambiguate possible targets of 
  function calls.
  Don't forget that only a function that has its address taken may be the
  target of a function call (unless its address escapes somehow...).
  Some functions can take a flexible number of arguments.
* Use an existing alias analysis component to determine the possible points-to
  sets of function pointers.
  There are some resources on such components for LLVM online.
* Use class hierarchy analysis to determine possible targets for C++ programs.
  That is, if you know that a method is called upon an object of a certain
  class, the possible targets of the call are the specific functions implemented
  by that class or its subclasses.
  Be careful; C++ programs use both *call* and *invoke* to call functions
  depending on whether or not the call may throw an exception.
  The `CallSite` helper class can conveniently identify both.

The only approach you *may not* use is the naïve method of assuming that any
indirect call may point to any function that has its address taken.
You should make sure that you understand the trade offs of the particular
approach that you use.
You will be expected to discuss them in a *brief* document when you turn your
project in.


## What you turn in
You must turn in two things. Make sure that your name is clearly specified in both.

The source files for your project. Compress your project directory into a .tar.gz file in order to submit it via CourSys All projects will be built and tested on a 64-bit machine. Make sure that we can test your project by simply running the callgraph-profiler program to instrument a module and running the resulting program. Grading of the projects will be automatic, so make sure that your output format is correct!

A brief (up to 1 page) write up of your project that explains your basic design as well as the limitations and advantages of your approach. In particular, explain how you dealt with function pointers and external function calls. Are there ways that you did or could have made the analysis more efficient for common cases? Feel free to include any other points of interest, such as trade offs between design complexity and notions of efficiency.

Both of these should be submitted via CourSys by the deadline.


## Useful links

* [LLVM Doxygen](http://llvm.org/docs/doxygen/html/)
* [Debugging Information in LLVM](http://llvm.org/docs/SourceLevelDebugging.html).
  Pay extra attention to the section on C and C++ specific debugging information.
* [Function::hasAddressTaken](http://llvm.org/docs/doxygen/html/classllvm_1_1Function.html#aafc2232f97cd2d2fae9b4f5bda77a363)
* [CallSite](http://llvm.org/docs/doxygen/html/CallSite_8h_source.html)
* [DerivedTypes](http://llvm.org/docs/doxygen/html/DerivedTypes_8h_source.html)


## Additional Resources on Call Graphs

* [Optimization of Object-Oriented Programs using Static Class Hierarchy Analysis](ftp://ftp.cs.washington.edu/pub/chambers/hierarchy.ps.Z)
* [Fast Static Analysis of C++ Virtual Function Calls](http://www.cs.cornell.edu/courses/cs711/2005fa/papers/bs-oopsla96.pdf)
* [Scalable Propagation-Based Call Graph Construction Algorithms](http://web.cs.ucla.edu/~palsberg/paper/oopsla00.pdf)
* [Precise Call Graphs for C Programs with Function Pointers](http://www.cs.rpi.edu/~milanova/docs/paper_kluw.pdf)
* [A Framework for Call Graph Construction Algorithms](http://www.cs.washington.edu/research/projects/cecil/pubs/cgc-toplas.pdf)
* [Comparing Call Graphs](https://plg.uwaterloo.ca/~olhotak/pubs/paste07.pdf)
* [Efficient Construction of Approximate Call Graphs for JavaScript IDE Services](http://www.franktip.org/pubs/icse2013approximate.pdf)
* [Function pointers in C](http://blog.frama-c.com/index.php?post/2013/08/24/Function-pointers-in-C)



