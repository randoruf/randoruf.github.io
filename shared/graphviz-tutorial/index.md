---
layout: page
title: GraphViz Pocket Reference
---



- [Home](index.html)
- [Examples](example.html)
- [Reference](reference.html)
- [Related Links](links.html)
- [Source] <https://graphs.grevian.org/> 



## What is this?

Some clever people recognized that CS Majors suck at drawing, but still often need to draw graphs. Those noble souls made a program to draw graphs for us called [GraphViz](http://graphviz.org/), it's free, open source, and great, but not incredibly easy to use, So I threw this web interface and tutorial on top of it to make it easy for us to make graphs for our assignments.



### Installing GraphViz

Download and install from [Graphviz - Graph Visualization Software](http://graphviz.org/) . 

Add the `dot.exe` into the system environments (This PC -> properties -> Advanced system setting -> Environment Variables -> PATH). 

The `PATH`  here is similar to `$PATH` in Unix.  Add `C:\Program Files\Graphviz\bin`  to PATH. 

Open the terminal and try 

```bash
dot -help
```

It should return somethings to you. 



## What?

Convert a simple language that describes graphs, to pretty pictures of graphs.

```
graph {
    a -- b;
    b -- c;
    a -- c;
    d -- c;
    e -- c;
    e -- a;
  }
```

![A generic square placeholder image with rounded corners in a figure.](https://graphs.grevian.org/resources/static/images/example1.png)

## Cool, Where do I start?

Take a look at some [Examples](https://graphs.grevian.org/example) to see how this works, Then open the [reference](https://graphs.grevian.org/reference) and the [Graph](https://graphs.grevian.org/graph) page and go to work.