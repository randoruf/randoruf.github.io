---
layout: post
title: "End of Line Characters"
date: 2019-12-20T10:20:00Z
tags: [windows]
---

* TOC
{:toc}
---

Source : 

* http://www.wilsonmar.com/1eschars.htm
* Julia

![image-20191220150059183](/shared/imgs/image-20191220150059183.png)

But Macintosh now is using `\n`  (linefeed) as default. 



You can visualize the `CRLF` in windows. 

![img](/shared/imgs/image-2019122015030000.jpg)



## Why it matters? 

In C/C++ program, there are many IO operation require to identify the end of line character. 

We usually write `\n` to indicate the end of line. However, if in windows, it will be a problem. 

Text files in Windows end in  `\r\n` , it means `\r` may be recognized as a character ! (but this is not true!)

