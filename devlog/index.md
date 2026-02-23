---
layout: post
title: 'Products Under Development' 
---

- 电子病历
- 日语
- 英语
- 四川方言
- 粤语方言


## 0. 通过 Token 学习外语

- https://arxiv.org/abs/2508.17771
- GPT 等 LLM 模型通常有 Tokenizer, 有一个属于自己的 Token 词汇库。
- 这是学习外语的最好方式，因为贴近词汇的出现频率 (例如中文出现最多的是 “波多野结衣”)
- 可以做一个单词软件，利用 GPT 的 token 频率出现技术，分析单词 (类似词根记忆)
- 下面是我问 Google Gemini 的结果 
  
That's a very insightful way to think about building vocabulary! The words included in a tokenizer's vocabulary are essentially the building blocks that Large Language Models (LLMs) consider the most frequent and important.

Modern LLMs (like GPT, BERT, or Llama) use **subword tokenization** (like Byte Pair Encoding or WordPiece). This means their vocabulary is a mix of three main types of units:

1.  **High-Frequency English Words (Intact Words):** The most common words are kept as single, complete tokens because they appear so often. Learning these is essential for fluency.
2.  **Common Prefixes, Suffixes, and Root Morphemes (Subwords):** Less frequent words are broken down into meaningful chunks. Learning these chunks helps you understand new words and word parts.
3.  **Individual Characters and Digits:** A base set of characters is always included as a fallback.

Here is a breakdown of the *types* of English vocabulary you can focus on by thinking like a tokenizer:

---

### 1. High-Frequency "Whole Word" Tokens

These are the most common words in English. The tokenizer keeps them whole to be efficient. Mastering these is the fastest way to understand most English text.

| Category | Examples (Likely Single Tokens) | Why Learn Them? |
| :--- | :--- | :--- |
| **Function Words** | the, a, and, or, but, is, are, was, were, be, to, of, for, in, at, on, that, this, it, he, she, we, they, you, my, your | These are the grammatical glue of the language. They make up the bulk of any conversation or text. |
| **Common Verbs** | get, go, have, do, make, take, say, know, see, think, look, want, need, come, give, use, find | Crucial for forming basic sentences and understanding actions. |
| **High-Frequency Nouns** | time, year, people, way, day, man, thing, home, life, world, work, place, part | Essential nouns for talking about common concepts. |
| **Common Adverbs/Adj.**| very, not, only, much, well, good, new, first, old, long, great, little, other, sure | Necessary for modifying and adding detail to your sentences. |

### 2. Common Subword/Morphological Tokens

The tokenizer creates tokens for frequently occurring prefixes and suffixes so that it can build new words efficiently. Learning these will help you guess the meaning of unfamiliar words and correctly spell them.

| Subword Type | Token Examples | Full Word Examples | Meaning/Function |
| :--- | :--- | :--- | :--- |
| **Suffixes** | `ing`, `ed`, `ly`, `es`, `er`, `tion`, `able`, `ous`, `ize`, `ment`, `ness` | runn**ing**, work**ed**, quick**ly**, box**es**, fast**er**, crea**tion**, understand**able**, danger**ous**, real**ize**, develop**ment**, kind**ness** | Denote verb tense, adverbs, plurals, comparisons, or create nouns/adjectives from other word types. |
| **Prefixes** | `un`, `re`, `dis`, `pre`, `in`, `con`, `inter` | **un**happy, **re**start, **dis**agree, **pre**view, **in**complete, **con**nect, **inter**national | Often change the meaning (like `un` for "not," or `re` for "again"). |
| **Punctuation/Misc.**| `.` `! ` `? ` `, ` `( ` `)` `s` ` ##` | The tokenizer often treats punctuation with a space as its own token. The `##` (or similar marker like `Ġ` or `_` for different models) indicates a subword that follows another subword (e.g., `token` + `##ization`). | Crucial for reading fluency and sentence structure. |

### 3. Topic-Specific Vocabulary

While the majority of the vocabulary is general, the next most frequent words will be from the massive amount of text LLMs are trained on. These include many concepts from technology, science, and programming.

| Category | Examples | Why Learn Them? |
| :--- | :--- | :--- |
| **Technology/Data** | data, model, process, algorithm, machine, network, system, compute, server | Highly relevant to modern English conversation and professional contexts. |
| **Technical Verbs**| generate, provide, implement, create, configure, optimize, leverage | Common in instructions, documentation, and academic writing. |
| **Academic/Formal**| therefore, however, moreover, thus, substantial, fundamental, consequence, evidence | Improves your ability to read academic papers, news articles, and write formal essays. |

### How to Use This for Learning English

1.  **Prioritize the Core 1,000-5,000 Words:** The tokenizer confirms that mastering the most frequent words (Category 1) is the highest priority. Use frequency lists like the **New General Service List (NGSL)** or **Oxford 3000** for a systematic approach.
2.  **Focus on Affixes (Category 2):** When you learn a new word, look for its common prefixes and suffixes. Knowing that `un-` means "not" and `-able` means "can be done" allows you to understand dozens of new words (e.g., *unbearable*, *unforgettable*).
3.  **Read and Listen Widely:** The subword tokens are derived from sheer frequency across massive text. The best way to naturally acquire them is through extensive reading and listening to authentic English content (books, news, podcasts, videos).

 

## 0. 宠物智能项圈

- 定位
- 摄像记录
- 检测健康状况
- 拼多多打到价格最低
- 靠服务卖钱


## 0. sweetspot 

- sweetspot 
  - 1. Search
    - AI-Powered Search: Search for descriptions of contract and grant opportunities you've bid on in the past and Sweetspot will find you similar open contracts. 
  - 2. Ask 
    - Business Intelligence: Ask questions about the solicitation documents and historical contract data to make an informed bid/no-bid decision.
  - 3. Manage 
    - Pipelines & Pursuits: Streamline capture, manage pursuits, assign tasks, and update your AI Profile to match you with the most relevant contract opportunities.
  - 4. Respond 
    - Proposal Copilot: Our AI takes in context of services your business offers to help you effortlessly respond to RFPs, RFIs, and RFQs.
  - 需求1: 自动寻找潜在客户
    - 1.1 信息来源: 用户可以给定政采的信息来源
      - 如 https://www.ccgp.gov.cn/cggg/dfgg/gkzb/ 或者 https://ggzyjyzx.tl.gov.cn/jyxx/003002/003002001/trade_info.html
    - 1.2 用户关注点：
      - 比如在 https://ggzyjyzx.tl.gov.cn/jyxx/003002/003002001/20250923/7fc43875-fd9f-429e-84a8-e8efbfaa32f7.html
      - 有一份附件要求 <2025年铜陵学院工程实训中心人工智能综合实验室建设项目采购需求9.22.pdf>
      - 比如用户给定的 “用户关注点” 是 “家具 桌椅 桌凳 储藏柜” 等关键字。
      - “用户关注点” 在用户输入的时候，还会利用 LLM 智能关联相关的概念词，比如输入 “办公家具” 就会自动细化到 “桌椅 桌凳 储藏柜”等
      - 利用 Deepseek、GPT等AI模型自动扫描 网页内容 和 PDF， 结合“用户关注点”关键词, 智能识别可能相关的采购项目 
    - 1.3 每日推送
      - 每天自动从 项目来源网站 来取数据 (每天大概中午12点和下午6点更新数据，只看当天日期的招标信息)
      - 目标客户其中之一，每天会在公众号发布文章，推送工程项目，格式如下
      - 项目名称、项目预算、开标时间、获取方式、采购单位、采购单位联系方式、省份
    - 1.4 项目列表
      - 用 MongoDB 收集所有 政采 项目，有 URL 可以列出全部收集到的项目
      - 用 招标状态、开标日期、省份、预算 等 filter 
    - 1.5 项目展示页
      - 显示项目的详细信息
      - 有源头网页连接
  - 需求2: 持续追踪政采项目的后续
    - 可以查看入围企业 (入围企业的报价单？)
    - 持续后续追踪，方便反思分析
  - 需求3: 报价助手
    - 很多企业还在用 Excel 报价，为什么不用网页交互更好
  - 需求4: 标书助手
    - 市面上已经有很多“标书助手”的产品了，参考一下他们
  - 需求5: 网上展厅
    - 普通的贴图映射
    - 高斯3D泼溅

## 0. 吸水清洁器、猫砂自动清洁器、宠物自动喂食器、

- 日本一家15人的公司制作了一款 吸水清洁器(清洁头在喷水的同时马上吸水， 所以能够轻松清洗老人的身体)
  - 但这个吸水清洁器显然可以用于清洁动物的身体
- 猫砂自动清洁器，深圳一对20岁女生设计猫砂清洁器，卖到欧美，年入100万。
  - 社恐老板创办 “霍曼宠物喂食器、猫砂”

## 0. AI宠物

- 日本AI宠物，毛球小玩意，抚摸会发出声音，扭动身体，搭配AI情绪模型，能够学习主人的特性，陌生人的话抚摸会故意生气。

## 0. AI后花园乐观 wonder blocks 

- 比泡泡玛特娃娃好玩多了
- 只能喂鸟器
- 后花园 AI摄像头，偷偷看松鼠吃东西，小鸟筑巢，蜜蜂工作等等
- 谁会给鸟儿买智能手机

## 0. 社区团购

<https://www.bilibili.com/video/BV1ajuHzWE4R>

- 社区团购的核心是 App 
  - 可以是微信小程序
  - 但是遇到某些社区大妈，他们可能比较守旧。
  - 研制全链路自动 AI Agents (通过某些手段获得私信、评论，群姐自动接单，允许大家看到众筹/团购人数，像早期美团的网页)
  - 托马斯说做小程序不行，一定要维护微信群。问题是我的最终目的是想让我的技术落地到社团团购，自己做只是测试，有直接反馈可以改进而已。我不做小程序的话还做的毛。。。
- 疫情的时候兴起，大妈们可以为了3毛线，熬夜团购。
- 预售 + 自提 
  - 美团优选倒闭的原因：因为品质无法控制，买生鲜像开盲盒。。。
  - 如果做到这种品质优选 (与本地优质商户合作)，也会有搞头的
- 小程序的入口可能要以商户为主，最多下面填一填开发的公司名。
- 优点：
  - 产地直采，果蔬直通小区车库
  - 农民多赚钱，省去中间商
  - 巨头撤场后，草根玩家在社区团购赛道上的机会反而又重新浮现了出来。
    - 精细化管理、轻资产运营
    - 通过差异化服务在特定社区站稳脚跟
    - 社区团购本身没死，只是回归了零售本质
    - 服务好方圆3公里内的真实需求
    - 一群熟人、一个好团长，一场今天下单，次日取货的信任游戏

明确的商业案例：
- 微信群 -> 社区团购
  - 家附近的 “果sun林” 做的风生水起，天天晒自己的订单，才发现这种商业模式
  - 永宁大观对面的卖进口食品的店，拉了一个微信群，如果有大家需求，就去山姆买东西回来拆散卖
  
可能有用的项目：
- 尚硅谷Java项目《尚品甄选》 SpringBoot+SpringCloud萌新学会企业级java项目 <https://www.bilibili.com/video/BV1NF411S7DS>
- 前端Vue热门实战, 美团买菜团购商城系统架构移动端APP项目实战 <https://www.bilibili.com/video/BV1Em4y1E7ag>
- Build a full stack UBER EATS clone - 1/5 Days Challenge 🔴 <https://www.youtube.com/watch?v=ZPNHWlMk6_E&list=PLY3ncAV1dSVBc5v8jfQXQZrfZO93X3PGP>
- Ubereats clone Delivery Partner Assignment using Delivery Service #88 <https://www.youtube.com/watch?v=XpEcu2fHQrk&list=PLIGDNOJWiL1-Smf4ABmuvcOrV7E4mCqN3&index=91>

## 开发计划 

- [ ] 词根分析器 (github项目)
- [ ] 社区团购App

## 0. 微景观模型

- 一个山东小伙，拜师做庭院房屋的微景观模型，年入500百万。

## 0. Language Reactor 

一个Chrome的插件，可以在网页查生词、视频查生词，加入复习计划。

## 0. 语言学习伴侣 - 东南亚、东亚相亲软件

一个能够找 语伴 的相亲软件，

将东亚、东南亚文化归属一类，英联邦归属一类，穆斯林归属一类，印度归属一类，美洲、欧洲、非洲各一类。

模块化的好处是，通过文化学习语言，并且不同语言只需切换翻译就可以，大大减少课程内容的制作。

另外，最重要的功能是，能够找到一起学习语言的人，能够让中国男人外娶，也能让中国女人外嫁！

东南亚、东亚的女性在文化上中国相似，能够更容易融合到中国文化。

这个相亲软件是基于卢诗翰的《社保的石头 韩国已经摸过了》判断的。

根据韩国14年对社保、生育问题的探索，总结起来的阶段是

- 调整社保政策
- 发现社保问题是人口问题，开始提高女性权益 (具体可以看看如何开设女性岗位薅政府的羊毛)
- 兜兜转转发现导致人口问题不是女性，而是男性找不到“门当户对”的女性
  - 这个问题背后很复习，不过网络的梗也能大概了解问题的本质：
    - 女性月薪3000元等于男性月薪10000元，否则就是下嫁。
    - 女性有车有房的话，男性年入100万
  - 所以年轻人不想结婚的原因是，女孩子太难追了
- 韩国有些地方政府开始发现问题，尝试组织外国女性和本地韩男结婚，因为韩女看不上韩男的话，也不尝试说服她们
- 结果这些女权就开始大闹相亲会
- 韩国慢慢意识到问题，尝试改善男性权益，比如生三个孩子可以免除兵役
- 生育率反而开始提升

回顾可以发现

- 穆斯林国家的女性权益非常低，生育率却很高
- 印度的女性权益低，生育率却很高
- 反而是女权盛行的 北欧四国、西方国家、韩国、日本，生育率惨不忍睹
- 这说明其实满足男性的欲望，反而更容易促进生育，这个结论很反直觉

可以开始提前布局了，

- 社保阶段尽量不要创业，会被收税搞的很惨
- 女权阶段可以


## 1. Macaron 

全新的 AI Agent, 拥有 Memory Sysytem, 会记住你爱好、你的脾性，像你的女朋友！
可以跟她培养感情！
  
## 1. 谷歌notebookLM和Capwords 

- 根据词典的解释分别生成对应的选词填空
  - 主要通过听写，填完之后会重复读2-3次，也就是通过记忆句子的方式记忆单词
- 小仙儿的妹妹是卡卡发布了一篇小红书笔记，快来看吧！ 
  - http://xhslink.com/m/6Fj9Q53B3eu 
- Capwords
  - 【独立开发闪卡 app #capwords #app #独立开发 #初创启动台】 <https://www.bilibili.com/video/BV1keTtzEEk6/>
- 奶酪单词
  - 【大型纪录片《奶酪单词传奇》】 <https://www.bilibili.com/video/BV1xH4y1Z73k/>
- 坚果单词 App
  - (优先级0) ***语境查词***
    - 能够从短句子中自动筛选出最有可能的词汇解释。
    - 比如对于句子 "strong winds can often indicate changing weather **conditions**" 假设要查 condtions 的意思，是会自动考虑整个句子，不会单独查词。
      - condition: 
        - medical 
          - the physical state of sb's health 
          - an illness or a medical problem that suffered from a long time 
        - state of sth 
          - the state of sth
        - circumstances 
          - the circumstances or situation in which people live
          - the physical situation that affects how sth happens
        - rule 
          - a rule or decision that you must agree to. 
        - necessary situation 
          - a situation that must exist in order for sth else to happen
        - state of group 
          - the state of a particular group of people 
    - 应该属于 circumstances, 指环境条件，或者是 state of sth, 某种状态。
    - 英和字典 Widsom 会按照词汇解释的出现频率排序 (比如 fan 作为风扇还是粉丝的频率高)
  - (优先级1) 场景记忆单词: 
    - 类似完形填空，通过AI对话， 在下划线处填入单词。做完后会显示选项的意思（完形填空）
    - 一篇文章挖空，填入刚才学习的单词。
  - (优先级1) 深度理解
    - 分析词义：解释词的起源
    - 常见搭配：类似 英和Wisdom词典的 词组搭配
    - 使用场景和频率：
      - 例如 barometer 在日常生活中较少使用，主要用于气象、天气预报和科学领域。用于衡量大气气压，帮助预测天气，常用于新闻、气象报告和科学讨论中，
- (优先级1) 新东方包钢背单词的练习
  - Vocabulary Basic 
  - Vocabulary 6000
  - Vocabulary 12000
  - Vocabulary 36000
  - 模仿里面的单词练习，同义词/反义词连线，完形填空练习。
- (优先级2) 如何正确拼写单词?（坚固单词拼写和语法）
  - 最原始的方式是在白纸上用纸和笔一遍一遍默写单词，进一步是在电脑上写。
  - 如果只是单纯拼写单词，一是无聊，二是无法写出正确的语法形式（日语、英语尤为明显）
  - 所以“单词卡片”、“单词拼写” 的复习模式要完全摈弃
  - 可替代方式：
    - “句子挖空，填写单词的正确形式(同时考察单词和语法)”，
    - “句子挖空，同义词填写(考察同义词、同义词组的运用)”，
    - 以上既可以是书写模式，也可以是停歇模式。
- (优先级3) 社交属性
  - 天梯排行榜
  - 每天打卡活动
  - 与朋友单词竞赛 (LeetCode赢了有积分，不然只能充钱买 tokens)
- (优先级3) 三年级的小孩：
  - 1. 读英语原著 罗尔德达尔 
    - (利用NotebookLM和Genimi超长上下文，生成对应的英语练习，如完形填空、单词填空、阅读理解，参考http://xhslink.com/m/3gNeoc6YDPX )
  - 2. 英语新闻 (同上，阅读中背单词 http://xhslink.com/m/8q2NlaXV9et 和  http://xhslink.com/m/3aGNcznHGoJ )
  - 3. 初中数学奥赛(华东师范 小蓝本)
  - 4. 高中数学奥赛(华东师范 小蓝本)
- NotebookLM
  - 【[中英+文稿] 谷歌NotebookLM简直是学英语的绝配】 <https://www.bilibili.com/video/BV17gNkz5EWg/>
  - 目标受众是英语老师
  - 能根据视频自动生成英语题，还能考察语法等常见初高中英语题目，根据英语小说生成练习题，比如北京一年级的小学生要求读The ink drinker的儿童文学，然后做相关练习题。
  - 后期加入语法分析、词性分析，语法学习，语法纠正并给出参考资料，具体到语法书的规则。
  - 后期还有雅思作文辅导。
  - 后期还有听力题目辅导。
  - 雅思题目转化为其他语言做成大统一语言题目模板。
  - 后期还要融合清华wantwords,优化字典的解释等，例如用LLM技术颠覆过去的英汉字典
  - 清华妈妈快跟不上北京一年级难度了 <http://xhslink.com/m/22aAJqQMiNM>
  - 打卡6月26日世界头条英语新闻，高效积累5500词！ <http://xhslink.com/m/51aD8AuzAbo>
- Moji字典、背单词
- 母语星球外教机 (消音设备、同声传译)
- 日本三省堂 Daily Consice 日英、英日词典(日英收录8.8万，英日收录7.8万)
  
明确的商业场景：谷歌notebookLM国产化(解决大部分不上外网的缺点)，小红书的背单词软件，带字幕的英语教学视频，都有不错的销量。

可能有用的项目

- Claude Code 逆向工程研究仓库 https://github.com/shareAI-lab/analysis_claude_code
- 复习飞桨创造营的课程
- 写一个OCR识别网页的开源工具
- 在7个月内学完MIT数学基础课程
- 每天上午六点半起床坚持写博客
- 每天至少去健身房锻炼1小时
- 读完Vue的源码分析


## 2. 智能机器人玩具

- 朱爸爸带娃记：还有10分钟就迟到了，他说改完这点程序就去上学。
- FACTR: RSS 2025 卡内基梅隆大学，开源的低功耗带有力反馈的遥操作系统
- 如具有多模态的机械臂伴侣，大玩具机器人
  - (深圳一个18岁的男孩创业无人机，主要是做无人机玩具定制外销，能在大疆的重围中突破。而且玩具用开源产品改的话，也合理有销路，主要是面对教育和娱乐场景)
  - 【18岁CEO管理12名员工，背后“推手”拉开神秘面纱。】 <https://www.bilibili.com/video/BV1HF31zgEpT/>
- 共享相机柜
  - 19岁小伙和高中室友创业编程自制CCD共享柜，平均月收入可达5000元 <https://news.qq.com/rain/a/20250714V0646U00>
- AI研究室 帆哥 AI助手 
  - 【当我给AI装了只手，他能做哪些事？-- 小白怎么玩智能硬件?】 <https://www.bilibili.com/video/BV1Fv3Xz8EPZ/>
- 开源人形机器人
  - 【K-Scale 实验室机器人开源教程-学习如何制作和训练机器人】 <https://www.bilibili.com/video/BV1s27VzgE34/>
  - 【【自制】我做了个能动的迷你电脑配件！【软核】】 <https://www.bilibili.com/video/BV1ka411b76m/>
  - 【【自制】我造了一台钢铁侠的迷你机械臂 ！【硬核】】 <https://www.bilibili.com/video/BV12341117rG/>
- 微信视频号 "Jungle的阿古兽"，乐高机器人编程，咖啡店
  - 顶着名校毕业生的光环，创业十年，开了一家小咖啡店，一家创客编程机构，很多人觉得我浪费了一手好牌…… 但我还是遵从内心的节奏，我相信只要章法不乱，迟早有一天，到我叫胡！我系Pizza，一个颈渴嘅积木佬，谨以此视频，致敬各位“失败的……man”！

明确的商业场景：AI研究室 帆哥 AI助手 / 大象机器人，外五县小孩编程班/乐高机器人


## 3. AI Imaging

CT, MR <https://www.youtube.com/@UCDRadiology/videos>

## 4. 机器人养老
- 麻省理工新成果 E-Bar 养老机器人帮助老人 洗澡、如厕、弯腰 <https://www.bilibili.com/video/BV1jiK6zkE12/>


明确的商业场景：暂无




