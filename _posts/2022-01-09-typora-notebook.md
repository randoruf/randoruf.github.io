---
layout: post
title: "如何构建自己的知识库？"
date: 2022-01-09
tags: [jinsei]
---

参考 [如何打造自己的私人知识库 (qq.com)](https://mp.weixin.qq.com/s/-IgE6VatXejv4SZ3L25aVQ)

---

就是用 ***Typora + PicGo*** 自动传图

- 配置 PicGo <https://support.typora.io/Upload-Image/#picgo-core-command-line-opensource>
- 如果 `nodejs` 遇到权限错误，多半是 `-g` 装到系统目录了，要手动纠正过来。
  - [Resolving EACCES permissions errors when installing packages globally - npm Docs (npmjs.com)](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally)
  - 注意 macOS 换了 `zsh` 的 Terminal, 要 source `./zshrc` 更新。
  - [linux - Adding a new entry to the PATH variable in ZSH - Stack Overflow](https://stackoverflow.com/questions/11530090/adding-a-new-entry-to-the-path-variable-in-zsh)
- [配置文件 -  PicGo-Core](https://picgo.github.io/PicGo-Core-Doc/zh/guide/config.html#picbed-smms)
- [Upload Images (typora.io)](https://support.typora.io/Upload-Image/#option-2-config-via-cli)
  - 自定义命令 `[your node path] [your picgo-core path] upload `
  - `/usr/local/bin/node /Users/haohua/.npm-global/lib/node_modules/picgo/bin/picgo upload` 


