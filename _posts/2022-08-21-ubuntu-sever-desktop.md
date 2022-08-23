---
layout: post
title: '如何切换到 Ubuntu Server 模式? (从 graphical view 切换)'
date: 2022-08-21
tags: [re]
---

* TOC 
{:toc}

---

很多时候**显卡驱动程序可能有 bug**, 或者 **GUI遮盖了可能的 bug**  

(Windows 一般是直接蓝屏，所以不存在这种问题。但实际上我个人更喜欢 Windows 那样的哲学，有错误就直接崩溃)。

* 切换到 Desktop 模式 (`Ctl` + `Alt` + `F1`)
* 切换到 Server 模式 (`Ctl` + `Alt` + `F2`) 

这个方法解决了我一台 NUC 长期困扰我的问题，为什么开机以后第一次登陆会失败，要再次登陆。

切换到 Server 模式就可以看到**系统日志**

```
[   37.384464] snd_hda_intel 0000:00:0e.0: No response from codec, disabling MSI: last cmd=0x20bf8100
[   38.392425] snd_hda_intel 0000:00:0e.0: No response from codec, resetting bus: last cmd=0x20bf8100
[   39.400435] snd_hda_intel 0000:00:0e.0: No response from codec, resetting bus: last cmd=0x20bf8100
[   40.408474] snd_hda_intel 0000:00:0e.0: No response from codec, resetting bus: last cmd=0x20170500
[   41.416477] snd_hda_intel 0000:00:0e.0: No response from codec, resetting bus: last cmd=0x20270500
[   42.424465] snd_hda_intel 0000:00:0e.0: No response from codec, resetting bus: last cmd=0x20370500
[   43.436496] snd_hda_intel 0000:00:0e.0: No response from codec, resetting bus: last cmd=0x20470500
[   44.448515] snd_hda_intel 0000:00:0e.0: No response from codec, resetting bus: last cmd=0x20570500
[   45.456544] snd_hda_intel 0000:00:0e.0: No response from codec, resetting bus: last cmd=0x20670500
[   46.468552] snd_hda_intel 0000:00:0e.0: No response from codec, resetting bus: last cmd=0x20770500
```

大概的解决方法是 

```
sudo tee /etc/modprobe.d/snd-hda-intel-fix.conf <<< 'options snd-hda-intel probe_mask=1'
```

或者 **升级BIOS**。 
