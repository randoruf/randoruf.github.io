---
layout: post
title: "修改 VS Code 的 Markdown 文件的数学公式的分隔符 (Delimiters)"
date: 2020-11-21T00:20:00Z
tags: [math]
---


现在全部转向 katex 。

由于历史原因（我很多早期笔记都是使用 Typora 作为笔记软件的， 所以只能使用 double dollar sign 作为 math delimiters. 

但是 Jekyll 和 Gitbook 都必须使用 `$$` 作为 inline-equation 的分隔符 (Delimiters). 

**而傻逼 Visual Studio Code 认为 只有 `$` 才能作为 inline-equation**。 这就麻烦了。



刚好看到 知乎 Matt 大佬写的文章 <https://zhuanlan.zhihu.com/p/82220909> ， 他直接对 Visual Studio Code 动手了， 这也启发了我，为什么不直接对 Visual Studio Code 动手呢？



配置过程如下（在安装时可能会设计 快捷键的混疊 (aliasing)，详细可以参考 [Visual Studio Code Keyboard Binding](https://code.visualstudio.com/docs/getstarted/keybindings) ， 如果插件不能正常工作不用惊慌， 先查一查你的快捷键设置)。

安装`Markdown Preview Enhanced`插件，

打开 `Markdown Preview Enhanced` 插件的 setting (extensions处对应插件的小齿轮)， 点击 `Extension Setting`. 

在弹出的窗口的 **搜索栏中**，已经有了前缀 `@ext:shd101wyy.markdown-preview-enhanced`

搜索 math Inline Delimiters，点击 `Edit in setting.json`

```json
"markdown-preview-enhanced.mathInlineDelimiters": [
    ["$$", 
     "$$"]
]
```

但是此时 block delimiter 和 inline delimiter 会冲突， 所以对 block delimiter 也需要修改。

搜索 `@ext:shd101wyy.markdown-preview-enhanced math block delimiters` , 点击 `Edit in setting.json`

```json
"markdown-preview-enhanced.mathBlockDelimiters": [
	["$$\n", "\n$$"]
]
```

对于**微软的垃圾**， 你要改成
```json
"markdown-preview-enhanced.mathBlockDelimiters": [
	["$$\r\n", "\r\n$$"]
]
```
**具体可以看一看 CRLF 和 LF 的区别! 跨平台总是个大问题。**

这个网站也可以看一下效果哦 

$$
\begin{aligned}
\nabla \cdot \mathbf{E} &= 4 \pi \rho \\
\nabla \cdot \mathbf{B} &= 0 \\
\nabla \times \mathbf{E} &= - \frac{1}{c} \frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &= \frac{1}{c} ({4 \pi} \mathbf{J} + \frac{\partial \mathbf{E}}{\partial t})
\end{aligned}
$$


这样就完成了 KaTex 在 Visual Studio Code 上的预览了， 可以抛开 Typora 了。 

---

注意一下 是 `$$\n...\n$$` 。并不是 `$$\n `和 `$$\n` ，否则因为选择的区域不对， 会把公式最后面的 `\n` 也传递给 MathJax， 就会直接报错（当然插件并不会报错，所以我 debug 了很久。。。 fail fast 真是一种好的设计思想， 错了就直接报错，别他妈的尝试修复）。 

做完以上工作后， 记得 `@ext:shd101wyy.markdown-preview-enhanced math rendering option` 在选中 `MathJax` ，默认是选择垃圾 `KaTex`的。



这个方法更简单一点，但`Markdown Preview Enhanced`渲染的公式字体有点大，还需要对公式字体进行调整。修改方法为，配置`$HOME\.mume\style.less`文件如下：

```css
.markdown-preview.markdown-preview {
  // modify your style here
  // eg: background-color: blue;  
  .katex {
    font-size: 16px; // <= font size here
  }
}
```





---

以下是原文：Matt 大佬写的文章 <https://zhuanlan.zhihu.com/p/82220909> 

## 方法1

安装`Markdown Preview Enhanced`插件，在配置的json配置文件`@ext:shd101wyy.markdown-preview-enhanced Math Inline Delimiters`里面加入：

```json
"markdown-preview-enhanced.mathInlineDelimiters": [
    ["`$", "$`"]
]
```

这个方法更简单一点，但`Markdown Preview Enhanced`渲染的公式字体有点大，还需要对公式字体进行调整。修改方法为，配置`$HOME\.mume\style.less`文件如下：

```css
.markdown-preview.markdown-preview {
  // modify your style here
  // eg: background-color: blue;  
  .katex {
    font-size: 16px; // <= font size here
  }
}
```

### 方法2

Visual Studio Code的Markdown数学公式扩展插件`Markdown+Math`不支持有道云笔记上述格式，需要自行配置。研究了一下这个插件如何实现了多种格式，包括`dollars`、`brackets`、`gitlab`、`kramdown`等，发现`gitlab`的格式和有道云笔记格式非常相似，并且这个格式是依赖`markdown-it-texmath`实现的，通过观察其js文件，模仿`gitlab`的部分新增了一个`youdao`格式。

具体操作步骤如下：

1. 在Visual Studio Code中安装`Markdown+Math`插件
2. 到插件目录下，即个人目录下的文件`$HOME\.vscode\extensions\goessner.mdmath-2.3.9\node_modules\markdown-it-texmath\texmath.js`，先复制备份一下，然后用编辑器打开`texmath.js`文件
3. 在`texmath.rules`部分，模仿`gitlab`的代码，添加了一个名为`youdao`的格式，其中调换了`inline`部分`rex`中```和`\$`位置以及`tag`中```和`$\$$`的位置：

```json
gitlab: {
        inline: [ 
            {   name: 'math_inline',
                rex: /\$`(.+?)`\$/gy,
                tmpl: '<eq>$1</eq>',
                tag: '$`'
            }
        ],
        block: [ 
            {   name: 'math_block_eqno',
                rex: /`{3}math\s+?([^`]+?)\s+?`{3}\s*?\(([^)$\r\n]+?)\)/gmy,
                tmpl: '<section class="eqno"><eqn>$1</eqn><span>($2)</span></section>',
                tag: '```math'
            },
            {   name: 'math_block',
                rex: /`{3}math\s+?([^`]+?)\s+?`{3}/gmy,
                tmpl: '<section><eqn>$1</eqn></section>',
                tag: '```math'
            }
        ]
    },
youdao: {
        inline: [ 
            {   name: 'math_inline',
                rex: /`\$(.+?)\$`/gy,
                tmpl: '<eq>$1</eq>',
                tag: '`$'
            }
        ],
        block: [ 
            {   name: 'math_block_eqno',
                rex: /`{3}math\s+?([^`]+?)\s+?`{3}\s*?\(([^)$\r\n]+?)\)/gmy,
                tmpl: '<section class="eqno"><eqn>$1</eqn><span>($2)</span></section>',
                tag: '```math'
            },
            {   name: 'math_block',
                rex: /`{3}math\s+?([^`]+?)\s+?`{3}/gmy,
                tmpl: '<section><eqn>$1</eqn></section>',
                tag: '```math'
            }
        ]
    },
```

1. 在`Markdown+Math`的配置文件`@ext:goessner.mdmath`将`Mdmath: Delimiters`改为`youdao`
2. 重启Visual Studio Code即可



编辑于 2019-09-23 by [Matt](https://www.zhihu.com/people/maoxilin) 虽未认同但仍可接受一种思想，是有学识的表现。

