---
layout: post
title: "pdf电子书的书签插入"
date: 2022-01-18
tags: [pdf]
---

---

可以用 `pdftk` 提取 pdf 的**源信息**。

```
pdftk mybook.pdf dump_data output data.txt
```

然后在里面插入 bookmarkbegin 的信息。具体可以找一本有 bookmark 的 pdf 看看。

可以写 `toc.txt` 的书签信息。

一般上网找一找豆瓣都有完整的目录，复制过来就可以。

```
目录---10
第1章    编译概观---26
    1.1  简介---26
    1.2  编译器结构---31
    1.3  转换概述---34
        1.3.1  前端---35
        1.3.2  优化器---39
        1.3.3  后端---40
    1.4  小结和展望---46
```

格式就是 `\t` 代表书签的 level , `---` 来标注书签对应页数。

此处可以利用 Regular Expression 的技巧，比如其数字格式 `1.3.1` 对应

```
([0-9]+\.[0-9]+\.[0-9]+)
```

在 replace 处可以采用变量 (括号内是变量)， 就可以很轻松给三级书签添加缩进。

```
\t\t$1
```

用一下脚本可以生成对应 bookmark 信息。

```python
# https://www.xianmin.org/post/linux-pdftk/
# Run in the shell.
#   - `pdftk mybook.pdf dump_data output toc.txt` 
#   - `pdftk mybook.pdf update_info toc.txt output bookmarked.pdf`
# https://blog.csdn.net/puran1218/article/details/105014713

def ch_to_html_encoding(s: str) -> str:
    literal = []
    for c in s:
        literal.append("&#" + str(ord(c)))
    return ";".join(literal) + ";&#0;"


def to_bookmark(title: str, level: int, page: int) -> str:
    return "BookmarkBegin\nBookmarkTitle: {title}&#0;\nBookmarkLevel: {level}\nBookmarkPageNumber: {page}".format(
        title=ch_to_html_encoding(title), level=level, page=page)


f = open("toc.txt", "r", encoding="utf-8")
for line in f:
    txt = line.strip('\n')
    level = 0
    while txt[level] == ' ':
        level = level + 1
    # print(txt[level])

    s_end = len(txt)-1
    while txt[s_end] != '-':
        s_end = s_end - 1
    page = txt[s_end+1:]

    s_end = s_end-2
    s_start = level
    title = txt[s_start:s_end]
    #print(title)

    print(to_bookmark(title, int(level*0.25)+1, int(page)+10))


f.close()
```



