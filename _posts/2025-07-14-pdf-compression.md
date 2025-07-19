---
layout: post
title: 'PDF Compression'
date: 2025-07-14
tags: [pdf,gs]
---


WPS 要 38元 才能帮你压缩PDF 。。。

上网搜了一下(问GPT其实也行)

```
gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile="output.pdf" "input.pdf"
```

具体看 <https://www.reddit.com/r/opensource/comments/ou4y5h/is_there_an_open_source_program_to_reduce_the/>

