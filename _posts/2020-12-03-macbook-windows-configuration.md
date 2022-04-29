---
layout: post
title: "Macbook 安装 Boot Camp 后的设置"
date: 2020-12-03T00:20:00Z
tags: [macbook]
---

傻逼苹果， 没有针对 Windows 设计优化功能。
比如没有 
- CPU 性能调整
- GPU 独显 和 核显 的自动切换

正常情况下的 Boot Camp 是 开启全部核心， 和使用独显。
因为傻逼苹果业界第一的散热设计， 导致使用一段时间后，**Macbook 非常容易过热黑屏**。
我这台 Macbook Pro (16 inches, 2019) 的硬件已经不管最高配的了， 只是普通的6核 和 最低配的显卡， 竟然能经常热到死机。。。。

所以，如果在普通情况下使用，可以尝试以下设定

### 最高性能
要高性能玩游戏的话，可以尝试恢复到最高性能， 当然准备好散热方案， 比如**冰袋(用密封袋即可)**，一个**带有四个瓶盖的板子**） ，否则的话，撑不过1小时。

### 电池节能模式
这个最容易， 在右下角点击 “电池” 的图标，然后把 Power Mode 拉到最左边。
![](/shared/imgs/2020-12-02-22-59-30.png)

### 限制 CPU 频率
很多时候，双核已经足够应对非常多的情况。 不需要这么多 CPU 同时都工作。
在开始菜单搜索 `Edit Power Plan` , 然后点击 `Change advanced power settings`.
在 处理器的功率处， 把最大功率限制到 50% 。 
![](/shared/imgs/2020-12-02-23-02-36.png)
我调整过后效果非常明显。


### 限制 GPU 频率
目前没有办法。因为不能切换到核显。 

而且独显只能用 Radeon 的蓝色版本， 并不能调节频率。




### 调整风扇散热

最近 [Macs Fan Control](https://crystalidea.com/macs-fan-control) 已经支持 T2 芯片了， 可以直接控制风扇的转速（全速？不过苹果的全速也就那样，还不如小学生的风扇玩具）