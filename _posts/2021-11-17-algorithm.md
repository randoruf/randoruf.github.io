---
layout: post
title: "大家的ACM - 浅谈算法学习"
date: 2021-11-17
tags: [algorithm]
---



## The Golden Rule of Computer Science  

> ***计算机是一门 20% 听课，80% 在写代码的学科***。

以前我觉得看书跳过练习可以加快学习速度，但其实完全错误。

这个 ***Golden Rule*** 可以帮助你很好地了解自己是否在高效地学习。你刷 Leetcode 可能就有体验了，实际写代码可能比看题解时间要长。

## 我的算法学习经历 

**原文 :  [浅谈算法学习](https://segmentfault.com/a/1190000018113038)**

[**flyawayl**](https://segmentfault.com/u/flyawayl)发布于 2019-02-10

  高中浑浑噩噩度过三年，大学就读于一所二本院校(攀枝花学院) 软件工程专业。现在的我很庆幸自己选择了这个行业，我喜欢编码，也喜欢利用所学解决新的问题，尽管熬夜是常有的事情。

  在大一上C语言课的时候，我总是在想为什么主函数是`main()`而不是其他什么`function_name()`，上手的第一个demo是经典的hello world，第一次敲代码就算是照着书抄也能写错，编译错误也不会看。现在想来初学编程都会遇到这些小问题吧。

```c
#include <stdio.h>
int main() {
    printf("Hello World\n");
    return 0;
}
```

  我很感谢这位C语言任课老师， 看得出来他是有充分的备课（应该是看过浙大翁恺老师的mooc）。并且为了让我们更好的入门编程，特地搭建了一个OJ系统，在上面布置一些C语言练习题目，也设置了一些难题。

  有天老师告诉我们蓝桥杯校内选拔赛要开始了，如果通过了就能去成都参加省赛。由于当时已经快把OJ上面的30来道题目写完，我很自信地报名了校赛。结果，比赛时蒙蔽了，**约瑟夫环**不会也，**矩阵鞍点**也不会啊，总共四个题目就做出来两个题目。后来比赛人数不够啊，我也有幸去了蓝桥杯省赛。省赛那就更搞笑了。蓝桥杯喜欢考察深度优先搜索，这需要递归来实现，可我不会啊，我就一直写for循环，打了个无准备的仗。

  后来得学长指点，遂买了一本**算法导论**，看不懂。

  网上很多人推荐紫书（刘汝佳的**《算法竞赛入门经典》**），现在看来确实是一本极好的竞赛入门书籍。这本书和《算法竞赛入门经典-训练指南》陪伴了我整个算法竞赛的两年。

  参加过许多比赛，能力不足也没能取得好的成绩。大二时，在第八届蓝桥杯决赛拿了二等奖。最后一次比赛是四川省ACM省赛，获得了银牌。

  啰啰嗦嗦这么多，下面开始谈谈算法学习的一些经验体会。

### 如何学习算法

#### 入门算法竞赛

  这一部分内容说是写给想入门程序设计竞赛的读者。如果你只想要知道为了更好的工作应该如何学习算法，请看下一部分**算法与项目经验**。

  在学过一遍C语言之后，直接上手刘汝佳的《算法竞赛入门经典》，我可以负责任地说，这本书是最好的算法竞赛入门书籍。**读一本书之前，一定要仔细阅读书的前言。**前言包含了基本内容、创作意图、学习指导、相对于先前版本的更新等，下面是《算法竞赛入门经典》第二版的前言：

------

>   “听说你最近在写一本关于算法竞赛入门的书？”朋友问我。
>
>   “是的。 ”我微笑道。
>
>   “这是怎样的一本书呢？”朋友很好奇。
>
>   “C语言、 算法和题解。 ”我回答。
>
>   “什么？几样东西混着吗？”朋友很吃惊。
>
>   “对。 ”我笑了，“这是我思考许久后做出的决定。 ”
>
> **大学之前的我**
>
>   12年前，当我翻开Sam A. Abolrous所著的《C语言三日通》 的第一页时，我不会想到自己会有机会编写一本讲解C语言的书籍。 当时，我真的只用了3天就学完了这本书，并且自信满满：“我学会C语言啦！我要用它写出各种有趣、 有用的程序！”但渐渐地，我认识到了：虽然浅显易懂，但书中的内容只是C语言入门，离实际应用还有较大差距，就好比小学生学会造句以后还要下很大工夫才能写出像样的作文一样。
>
>   第二本对我影响很大的书是Sun公司Peter van der Linden（PvdL）所著的《C程序设计奥
> 秘》 。 作者称该书应该是每一位程序员“在C语言方面的第二本书”，因为“书中绝大部分内容、 技巧和技术在其他任何书中都找不到”。 原先我只把自己当成是程序员，但在阅读的过程中，我开始渐渐了解到硬件设计者、 编译程序开发者、 操作系统编写者和标准制定者是怎么想的。 继续的阅读增强了我的领悟：要学好C语言，绝非熟悉语法和语义这么简单。
>
>   后来，我自学了数据结构，懂得了编程处理数据的基本原则和方法，然后又学习了8086汇编语言，甚至曾没日没夜地用SoftICE调试《仙剑奇侠传》 ，并把学到的技巧运用到自己开发的游戏引擎中。 再后来，我通过《电脑爱好者》 杂志上一则不起眼的广告了解到全国信息学奥林匹克联赛（当时称为分区联赛，NOIP是后来的称谓）。 “学了这么久的编程，要不参加个比赛试试？”想到这里，我拉着学校里另外一个自学编程的同学，找老师带我们参加了1997年的联赛——在这之前，学校并不知道有这个比赛。 凭借自己的数学功底和对计算机的认识，我在初赛（笔试）中获得全市第二的成绩，进入了复赛（上机）。 可我的上机编程比赛的结果是“惨烈”的：第一题有一个测试点超过了整数的表示范围；第二题看漏了一个条件，一分都没得；第三题使用了穷举法，全部超时。 考完之后我原以为能得满分的，结果却只得了100分中的20多分，名落孙山。
>
>   痛定思痛，我开始反思这个比赛。 一个偶然的机会，我拿到了一本联赛培训教材。 书上说，比赛的核心是算法（Algorithm），并且推荐使用Pascal语言，因为它适合描述算法。 我复制了一份TurboPascal 7.0（那时网络并不发达）并开始研究。 由于先学的是C语言，所以我刚开始学习Pascal时感到很不习惯：赋值不是“=”而是“:=”，简洁的花括号变成了累赘的begin和end，if之后要加个then，而且和else之间不允许写分号……但很快我就发现，这些都不是本质问题。 在编写竞赛题的程序时，我并不会用到太多的高级语法。 Pascal的语法虽然稍微啰嗦一点，但总体来说是很清晰的。 就这样，我只花了不到一天的时间就把语法习惯从C转到了Pascal，剩下的知识就是在不断编程中慢慢地学习和熟练——学习C语言的过程是痛苦的，但收益也是巨大的，“轻松转到Pascal”只是其中一个小小的例子。
>
>   我学习计算机，从一开始就不是为了参加竞赛，因此，在编写算法程序之余，我几乎总是使用熟悉的C语言，有时还会用点汇编，并没有觉得有何不妥。 随着编写应用程序的经验逐渐丰富，我开始庆幸自己先学的是C语言——在我购买的各类技术书籍中，几乎全部使用的是C语言而不Pascal语言，尽管偶尔有用Delphi的文章，但这种语言似乎除了构建漂亮的界面比较方便之外，并没有太多的“技术含量”。 我始终保持着对C语言的熟悉，而事实证明这对我的职业生涯发挥了巨大的作用。
>
> **中学竞赛和教学**
>
>   在大学里参加完ACM/ICPC世界总决赛之后（当时ACM/ICPC还可以用Pascal，现在已经不能用了），我再也没有用Pascal语言做过一件“正经事”（只是偶尔用它给一些只懂Pascal的孩子讲课）。 后来我才知道，国际信息学奥林匹克系列竞赛是为数不多的几个允许使用Pascal语言的比赛之一。 IT公司举办的商业比赛往往只允许用C/C++或Java、 C#、 Python等该公司使用较为频繁的语言（顺便说一句，C语言学好以后，读者便有了坚实的基础去学习上述其他语言），而在做一些以算法为核心的项目时，一般来说也不能用Pascal语言——你的算法程序必须能和已有的系统集成，而这个“现有系统”很少是用Pascal写成的。 为什么还有那么多中学生非要用这个“以后几乎再也用不着”的语言呢？
>
>   于是，我开始在中学竞赛中推广C语言。 这并不是说我希望废除Pascal语言（事实上，我希望保留它），而是希望学生多一个选择，毕竟并不是每个参加信息学竞赛的学生都将走入IT界。 但如果简单地因为“C语言难学难用，竞赛中还容易碰到诸多问题”就放弃学习C语言，我想是很遗憾的。
>
>   然而，推广的道路是曲折的。 作为五大学科竞赛（数学、 物理、 化学、 生物、 信息学）中唯一一门高考中没有的“特殊竞赛”，学生、 教师、 家长所走的道路要比其他竞赛要艰辛得多。
>
>   第一，数理化竞赛中所学的知识，多是大学本科时期要学习的，只不过是提前灌输给高中生而已，但信息学竞赛中涉及的很多知识甚至连本科学生都不会学到，即使学到了，也只是“简单了解即可”，和“满足竞赛的要求”有着天壤之别，这极大地削减了中学生学习算法和编程的积极性。
>
>   第二，学科发展速度快。 辅导信息学竞赛的教师常常有这样的感觉：必须不停地学习学习再学习，否则很容易跟不上“潮流”。 事实上，学术上的研究成果常常在短短几年之内就体现在竞赛中。
>
>   第三，质量要求高。 想法再伟大，如果无法在比赛时间之内把它变成实际可运行的序，那么所有的心血都将白费。 数学竞赛中有可能在比赛结束前15分钟找到突破口并在交卷前一瞬间把解法写完——就算有漏洞，还有部分分数呢；但在信息学竞赛中，想到正确解法却5个小时都写不完程序的现象并不罕见。 连程序都写不完当然就是0分，即使程序写完了，如果存在关键漏洞，往往还是0分。 这不难理解——如果用这个程序控制人造卫星发射，难道当卫星爆炸之后你还可以向人炫耀说：“除了有一个加号被我粗心写成减号从而引起爆炸之外，这个卫星的发射程序几乎是完美的。 ”
>
>   在这样的情况下，让学生和教师放弃自己熟悉的Pascal语言，转向既难学又容易出错的C语言确实是难为他们了，尤其是在C语言资料如此缺乏的情况下。 等一下！C语言资料缺乏？难道市面上不是遍地都是C语言教材吗？对，C语言教材很多，但和算法竞赛相结合的书却几乎没有。 不要以为语言入门以后就能轻易地写出算法程序（这甚至是很多IT工程师的误区），多数初学者都需要详细的代码才能透彻地理解算法，只了解算法原理和步骤是远远不够的。
>
>   大家都知道，编程需要大量的练习，只看和听是不够的。 反过来，如果只是盲目练习，不看不听也是不明智的。 本书的目标很明确——提供算法竞赛入门所必需的一切“看”的蓝本。 有效的“听”要靠教师的辛勤劳动，而有效的“练”则要靠学生自己。 当然，就算是最简单的“看”，也是大有学问的。 不同的读者，往往能看到不同的深度。 请把本书理解为“蓝本”。没有一本教材能不加修改就适用于各种年龄层次、 不同学习习惯和悟性的学生，本书也不例外。 我喜欢以人为本，因材施教，不推荐按照本书的内容和顺序填鸭式地教给学生。
>
> **内容安排**
>
>   前面花了大量篇幅讨论了语言，但语言毕竟只是算法竞赛的工具——尽管这个工具非常重要，却不是核心。 正如前面所讲，算法竞赛的核心是算法。 我曾考虑过把C语言和算法分开讲解，一本书讲语言，另一本书讲基础算法。 但后来我发现，其实二者难以分开。
>
>   首先，语言部分的内容选择很难。 如果把C语言的方方面面全部讲到，篇幅肯定不短，而且和市面上已有的C语言教材基本上不存在区别；如果只是提纲挈领地讲解核心语法，并只举一些最为初级的例子，看完后读者将会处于我当初3天看完《C语言三日通》 后的状态——以为自己都懂了，慢慢才发现自己学的都是“玩具”，真正关键、 实用的东西全都不懂。
>
>   其次，算法的实现常常要求程序员对语言熟练掌握，而算法书往往对程序实现避而不谈。 即使少数书籍给出了详细代码，但代码往往十分冗长，不适合用在算法竞赛中。 更重要的是，这些书籍对算法实现中的小技巧和常见错误少有涉及，所有的经验教训都需要读者自己从头积累。 换句话说，传统的语言书和算法之间存在不小的鸿沟。
>
>   基于上述问题，本书采取一种语言和算法相结合的方法，把内容分为如下3部分：
>
>   第1部分是语言篇（第1～4章），纯粹介绍语言，几乎不涉及算法，但逐步引入一些工
> 程性的东西，如测试、 断言、 伪代码和迭代开发等。
>
>   第2部分是算法篇（第5～8章），在介绍算法的同时继续强化语言，补充了第1部分没有涉及的语言特性，如位运算、 动态内存管理等，并延续第一部分的风格，在需要时引入更多的思想和技巧。 学习完前两部分的读者应当可以完成相当数量的练习题。
>
>   第3部分是竞赛篇（第9～11章），涉及竞赛中常用的其他知识点和技巧。 和前两部分相比，第3部分涉及的内容更加广泛，其中还包括一些难以理解的“学术内容”，但其实这些才是算法的精髓。
>
>   本书最后有一个附录，介绍开发环境和开发方法，虽然它们和语言、 算法的关系都不大，却往往能极大地影响选手的成绩。 另外，本书讲解过程中所涉及的程序源代码可登录网站[http://www.tup.tsinghua.edu.c...](https://link.segmentfault.com/?enc=dOyXrPa99N9UbAubGRjZ2g%3D%3D.ZoF1P%2BEz0bJXt8pN6ZNqdx2n7CsDzueV0Zelh%2F%2Fa2TtJJ1%2BT31rO%2B0YerHIz6YiEmoZHBekwBTDgHezQpLAsy%2FDA8x8N0SCOKW%2FWpiPioUA%3D)。
>
> **致谢**
>
>   在真正动笔之前，我邀请了一些对本书有兴趣的朋友一起探讨本书的框架和内容，并请他们撰写了一定数量的文字，他们是赖笠源（语言技巧、 字符串）、 曹正（数学）、 邓凯宁（递归、 状态空间搜索）、 汪堃（数据结构基础）、 王文一（算法设计）、 胡昊（动态规划）。 尽管这些文字本身并没有在最终的书稿中出现，但我从他们的努力中获得了很多启发。 北京大学的杨斐瞳完成了本书中大部分插图的绘制，清华大学的杨锐和林芝恒对本书进行了文字校对、 题目整理等工作，在此一并表示感谢。
>
>   在本书构思和初稿写作阶段，很多在一线教学的老师给我提出了有益的意见和建议，他们是绵阳南山中学的叶诗富老师、 绵阳中学的曾贵胜老师、 成都七中的张君亮老师、 成都石室中学的文仲友老师、 成都大弯中学的李植武老师、 温州中学的舒春平老师，以及我的母校——重庆外国语学校的官兵老师等。
>
>   本书的习题主要来自UVa在线评测系统，感谢Miguel Revilla教授和Carlos M. Casas
> Cuadrado的大力支持。
>
>   最后，要特别感谢清华大学出版社的朱英彪编辑，与他的合作非常轻松、 愉快。 没有他的建议和鼓励，或许我无法鼓起勇气把“算法艺术与信息学竞赛”以丛书的全新面貌展现给读者。

------

  需要特别指出的是，本书前11章中全部155道例题的代码都可以在代码仓库中下载：[https://github.com/aoapc-book...](https://link.segmentfault.com/?enc=jQyZt1O42eyUibchVy9%2FeA%3D%3D.ffbRVkZGaNefjBYnOsHxmB6aFQnENc9cS4Dhcxt6Peuworm6RJGJbgk6njXpNomv)。 书稿中因篇幅原因未能展开叙述的算法细节和编程技巧都可以在代码仓库中找到，请读者朋友们善加利用。

  自学阅读完前言，相信你有很多体会吧。本来还想贴上目录，但目录很长，会让文章显得十分冗长。我给出本书pdf下载链接：[https://pan.baidu.com/s/1Odoa...](https://link.segmentfault.com/?enc=fGFmqPwsD8wmkBw%2F7gABWA%3D%3D.79LKCnXJah%2Bsl1ovEcP1JKTzXFePvSSV%2Fd%2FC7GZ33HsLYLpRZ5b%2Fn1C1Nzakl9wF) 提取码：1bun

  请对照pdf或纸质书籍的目录继续阅读。

  **第一部分 语言篇（1~5章）：**书本的前五章都是C和C++基础，并不涉及复杂的算法，作者意在强化读者程序设计基础，并引导读者适应写算法题。这是一个很重要的过程--**自学**，学会自己构思，学会自己实现代码，学会找出bug，学会阅读作者以及其他人的代码，学会良好的编码风格。

  **第二部分 基础篇（6~7章）：**介绍了数据结构基础：包括线性表（包括栈、 队列、 链表）、 二叉树和图；暴力求解法：深度优先搜索和广度优先搜索，解决经典问题"八皇后"和"八数码"。

  学到这里，就已经打下了坚实基础，此时参加蓝桥杯已经问题不大。现在可以开始尝试刷一些OJ的题目，国内著名OJ包括HDOJ、POJ、ZOJ，但是题目质量参差不齐。国外的包括Uva、Codeforce、SGU、TopCoder等，建议找个博客有针对性地练习。在[Virtual Judge](https://link.segmentfault.com/?enc=tWoB5HVtSEIF1kYhMl84RQ%3D%3D.CTB93X3mRFMgDgdEM55tmrSDwQhg0hbgyf%2Bu6BCXno0%3D)能找到很多OJ的题目。

  **第三部分 竞赛篇（8~12章）：**从第八章开始，难度急剧上升，需坚持下去。分治、贪心、动态规划、简单数论、图论基础都是参加竞赛最基础的东西。第12章不建议马上学习，应该先学《算法竞赛入门经典训练指南》。

  **每章的课后练习题不需要全部做，做刘汝佳推荐的一些题目就行。其实书中刘汝佳已经给出了详细的学习建议，在不同的学习章节他都给出了学习指导，这本书可以陪伴并指导你入门，但很多人都没法坚持下去。**到这里，你已经掌握了算法学习的方法。当你学完前9章，你已经知道了该如何更好的学习算法，因为你找到了自己的方法，形成了自己的思维方式。

  算法竞赛还需要模拟训练，就像考试一样。针对性地做一些比赛题才能在比赛中发挥得更好。

  很多acmer包括我自己都在问一个问题：这本书学完就能过拿奖了吗？算法竞赛中有很多比赛，包括ACM区域赛、省赛、codeforces比赛、百度之星、计蒜之道等等，难度有很大不同，有的比赛拿奖很难，有的比赛相对容易。姑且认为读者是大学生，ACM区域赛难度大，省赛相对容易很多，但省赛想拿金牌和银牌靠前需要付出很大努力，并且不同省份获奖难度不同（以北京最为变态）。

  **相比于获奖，我觉得编程能力的提升才是最宝贵的。**

#### 算法与项目经验

  学习算法能提升编程能力，一部分人是为了竞赛，但更大一部分人是为了工作，为了通过公司的上机题目，不论是什么目的，这个学习的过程提升了编程能力。

  但是我必须要指出，如果不是为了参加算法竞赛，完全没有必要学习过多的不常用算法。你只需要学习那些最基础的算法和数据结构即可，把其他的时间都用来做项目吧，提升你的项目经验。

  **根据自己的基础和薄弱的部分，有选择性地学习《算法竞赛入门经典》前七章即可，并试着用自己常用的编程语言来解决问题。尤其针对那些对简单算法不熟悉的同行，这本书很系统地指出了详细学习的路线，介绍了很多编程的使用技巧和优化方法，只要坚持下去很快就能达到一定水平，值得一读。**

  **在系统的学习完算法之后，还需要大量练习，不建议去刷课后题，因为课后题太难，而且实现起来很复杂。建议刷刷LeetCode，找工作必备吧，听说很多公司面试原题呢。**

  公司之所以问算法题，一方面是为了提高门槛，另一方面是为了考察面试者的程序设计能力以及是否能够有更多的成长空间。

  用所学去解决更多的应用问题是一件让人兴奋的事情不是吗？有一次，java老师让我们用JFrame实现一个计算器，他给了我们一个"jar包"，这个包含有计算表达式值的功能，我觉得不好用，就自己用表达式树实现了同样的功能，这是一次在项目中用到算法的例子。假如老师没有给了我jar包，我也能自己实现同样的功能。如果工作中面临同样的情况，在网上也找不到代码的时候，可以利用所学自己实现所需的功能。

### 写在最后

  算法是解决问题的办法，并不是高大上的东西，任何解决问题的办法都可以称之为"算法"。学习算法是为了更好地解决问题，写出更加完善、更加高效的代码。做项目是运用所学知识的过程，需要自己建模，需要自己找出问题并解决，是编程能力和经验的体现。学习->运用->熟练->新的体会->学习->...，这是一个看似循环，实则无限发展的过程。唯物辩证法的否定之否定规律揭示了事物发展的前进性与曲折性的统一，表明了事物的发展不是直线式前进而是螺旋式上升的。

  我没有讲述参加竞赛的经历，因为实在是很枯燥，如果有朋友想要交流经验，欢迎私信。