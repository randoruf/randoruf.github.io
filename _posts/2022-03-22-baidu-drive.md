---
layout: post
title: "安装百度网盘之后需要做的事"
date: 2022-03-22
tags: [cs,linux,baidu]
---

[百度网盘后台自动占用，有办法关掉吗？ - V2EX](https://v2ex.com/t/813161)

baiduNetdiskSync 会在后台自动运行。

- 关闭自动备份
- 把 `baidu.app\` 下的 baiduNetdiskSync 的权限调到最低。用的时候再开 execution mode 。这样就不需要每次用完就删掉了。

一般人可能觉得无所谓。但我有程序洁癖，连那些效果很漂亮的前端都觉得在浪费我的电。

---

