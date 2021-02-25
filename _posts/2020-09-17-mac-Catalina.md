---
layout: post
title: "新版 Mac Catalina 的 $PATH 设置"
date: 2020-09-16T00:20:00Z
---



新版 Mac 默认用 zsh 为终端， 所以以前所有的 $PATH 教程不管用了。

 

macOS升级Catalina后环境变量更新 <https://juejin.im/post/6844904094386110478>



大致对应关系， 可以修改或者**创建** `~/.zprofile` 达到覆盖 $PATH

```zsh
~/.bashrc -> ~/.zshrc

~/.bash_profile -> ~/.zprofile
```



优先级

```zsh
# 下面三个是系统级别配置文件，系统启动就会加载。
/etc/profile/
/etc/paths
/etc/bashrc
# bash_profile文件如果存在，则后面的几个文件就会被忽略不读。
~/.bash_profile 或 ~/.bashrc
~/.bash_login
~/.bash_profile
```



有些软件会往 $PATH 里面写垃圾, 想删掉 `path_helper` 要读取的路径

```zsh
cd /etc/paths.d     
ls -l
```

然后就会看到

```zsh
-r--r--r--  1 root  wheel  47 17 Sep 22:28 com.vmware.fusion.public
```

之类。 

```zsh
cat com.vmware.fusion.public                
```

发现正是这个文件在污染

```zsh
/Applications/VMware Fusion.app/Contents/Public
```



