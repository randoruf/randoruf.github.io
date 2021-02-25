---
layout: post
title: "Gitbook 在新版 node 无法运行"
date: 2020-12-02T00:20:00Z
---

估计是 Gitbook 没人在维护。或者里面写的代码太丑陋。
在运行 `gitbook serve` 的时候，会报错

```bash
Installing GitBook 3.2.3
C:\Users\haohua\AppData\Roaming\npm\node_modules\gitbook-cli\node_modules\npm\node_modules\graceful-fs\polyfills.js:287
      if (cb) cb.apply(this, arguments)
                 ^
TypeError: cb.apply is not a function
```

可见大概率是 `polyfills.js` 这个文件出错了。

打开源文件，
```javascript
function statFix (orig) {
    if (!orig) return orig
    // Older versions of Node erroneously returned signed integers for
    // uid + gid.
    // 较旧版本的 Node 会错误地返回 有符号整数。
    return function (target, options, cb) {
        if (typeof options === 'function') {
        cb = options
        options = null
        }
        function callback (er, stats) {
        if (stats) {
            if (stats.uid < 0) stats.uid += 0x100000000
            if (stats.gid < 0) stats.gid += 0x100000000
        }
        if (cb) cb.apply(this, arguments)
        }
        return options ? orig.call(fs, target, options, callback)
        : orig.call(fs, target, callback)
    }
}
```
应该是用来试探一下是不是较旧的 node 版本。但是我用的是新版啊。这段函数可以不用。

看一下在哪里被调用了， 然后粗暴地直接 comment 掉就可以了（用 `Ctl + F` 搜索 `statFix`）。

直接 comment 掉那一段， 这样，错误的代码就不会被运行了。

```javascript
// fs.stat = statFix(fs.stat)
// fs.fstat = statFix(fs.fstat)
// fs.lstat = statFix(fs.lstat)
```

原文:<https://flaviocopes.com/cb-apply-not-a-function/>
