---
layout: post
title: "Python Encoding : Chinese and Japanese Characters"
date: 2019-12-29T10:20:00Z
tags: [python]
---

* TOC
{:toc}
---

If you are using Mac, add the following code block to **the beginning of the file (the first line of the file)**. 

```python
#!/usr/bin/python
# -*- coding: utf-8 -*-
```

It will force the interpreter to use UTF-8 encoding method. 

If you are using Windows, it does not work. 

There are just two examples in Windows, 

```python
datetime.datetime.now().strftime('%Y{0}%m{1}%d{2}').format(*'年月日')
```
* `strftime()` is implemented in C library, and Windows does not support UTF-8 in this case. So you can replace the character later by `.format()` . see <https://stackoverflow.com/questions/16034060/python3-datetime-datetime-strftime-failed-to-accept-utf-8-string-format>


```python
open('text1.txt', "w" , encoding='utf8')
```

* `encoding` argument will force Python write text files in UTF-8 format. 