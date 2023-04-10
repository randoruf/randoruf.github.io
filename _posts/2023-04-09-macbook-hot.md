---
layout: post
title: 'macbook pro 2019 发热问题'
date: 2023-04-09
tags: [linux]
---

* TOC 
{:toc}

---

https://www.linxs.top/index.php/2022/03/19/macbook-pro-16%E8%8B%B1%E5%AF%B8-2019-%E5%A4%96%E6%8E%A5%E6%98%BE%E7%A4%BA%E5%99%A8%E5%8F%91%E7%83%AD%E9%97%AE%E9%A2%98%E8%A7%A3%E5%86%B3/

https://www.zhihu.com/question/416913153

https://zhuanlan.zhihu.com/p/473555097

https://discussionschinese.apple.com/thread/251092395

https://blog.csdn.net/gavin_surekam/article/details/119315071


可能原因
- Mission Control 的 Displays have seperate Spaces 
- 显示器 和 macbook 的 color space 不一致
- 没有使用官方的 Type-C 到 HDMI 转换器

> 最近入手了一台16寸i9芯片的MacBook Pro，使用过程和以往的其他Mac一样，也没太注意。结果有一次摘下耳机，发现风扇声音巨大，用手一摸，直接可以煎鸡蛋了。赶紧上网检查问题，却发现这是通病。大量的朋友都表达了自己所遭遇的类似问题，同时也提出了各类解决方案。归根结底就是拆入外接显示器，独立显卡就会自动满负荷运转，解决的方案可以简单概括为：
> 1. 软件方向：改色彩文件描述(color space)、displays seperate space 等；
> 2. 硬件方向：外接显示器、原厂显示器等。
> 然而这些方法完全没有效果，令人感到绝望。直到我无意间尝试了一个不同的转接口，才发现电脑的温度完全不同了。于是我尝试了三个转接口进行比较，分别是：
> 1. 单独的雷电转HDMI；
> 2. 100-200元的拓展坞；
> 3. 200-300元的拓展坞。
> 
> ***不得不说，一等价钱一等货，越贵的电脑温度越低***。
> 苹果原装的转接口也是不错的选择，但价格实在是贵得离谱(500元一个)，哪位氪金玩家玩一下，可以来分享一下。
> 我就不写拓展坞的品牌了，不然显得我在带货。综上，购买一个质量好的转接口或者拓展坞可以解决这个问题。
> 
> 发布于 2023-04-07 11:11
> 
> 作者：叶子
> 链接：https://www.zhihu.com/question/416913153/answer/2972356396
> 来源：知乎
> 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。


## 基本思路

通过Sensei查看温度。

## 色域/颜色描述

改完效果还挺明显的。从风扇狂转到风扇轻微转 (70度稳定到60度)。

打开 “调度中心(Mission Control)” 关闭 “Displays have seperate space”

然后在 “Displays” 选择第二个显示器，在 Color Profile (色彩颜色文件) 选择与 Built-in Display 相同的方案，比如 LCD color 

## 拓展坞

苹果官方的拓展坞要 500 人民币。而 Satachi 好像只要100-200元。

据说 macbook pro 的 GPU 最高配用了很优质的显存颗粒，发热量非常低。

真的是 ***一分钱一分货***。

- 有条件的话, ***GPU 一定要选颗粒优质的，避免发热***
- 有条件的话，***转换器选苹果官方的***(哪怕贵的离谱)



