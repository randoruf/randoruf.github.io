---
layout: post
title: 'TailwindCSS Intro'
date: 2025-07-02
tags: [frontend]
---

* TOC 
{:toc}

---

雨宫天有一首歌是 Tailwind...


## TailwindCSS 核心思想

> Building complex components from a constrained set of primitive utility classes.
> 
> From <tailwindcss.com>

这里的 **utility class** 是 **“万用/工具类”** 的意思。

可以查一查 **utility knife** 在 “ウィズダム英和辞典 ” 是 ”万能ナイフ“, 也就是万用美工刀。这样 utility class 工具类 的概念就出来了，就是**那些很小很实用的原子类**，我们只能从有限的 集合类 里面挑取合适的工具类，组合成一个Component。


比如以下 Component (You style things with Tailwind by combining many single-purpose presentational classes (utility classes) directly in your markup): 

```html
  <div class="mx-auto flex max-w-sm items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
    <img class="size-12 shrink-0" src="/img/logo.svg" alt="ChitChat Logo" />
    <div>
      <div class="text-xl font-medium text-black dark:text-white">ChitChat</div>
      <p class="text-gray-500 dark:text-gray-400">You have a new message!</p>
    </div>
  </div>
```

如果想预览效果，可以在 <https://play.tailwindcss.com/> 复制以上代码。

For example, in the UI above we've used:

- The display and padding utilities (`flex`, `shrink-0`, and `p-6`) to control the overall layout
- The max-width and margin utilities (`max-w-sm` and `mx-auto`) to constrain the card width and center it horizontally
- The background-color, border-radius, and box-shadow utilities (`bg-white`, `rounded-xl`, and `shadow-lg`) to style the card's appearance
- The width and height utilities (`size-12`) to set the width and height of the logo image
- The gap utilities (`gap-x-4`) to handle the spacing between the logo and the text
- The font-size, color, and font-weight utilities (`text-xl`, `text-black`, `font-medium`, etc.) to style the card text


## TailwindCSS 的自定义类

### TailWindCSS with Pure Inline Utility Classes 

`index.html`

```html
<div class="grid grid-cols-2 gap-x-6">
    <button class="text-base font-medium rounded-lg p-3 bg-gray-100 text-black">Decline</button>
    <button class="text-base font-medium rounded-lg p-3 bg-rose-500 text-white">Accept</button>
</div>
```

<https://play.tailwindcss.com/XTk4cMO4qU?size=540x720>

### TailwindCSS with `@apply` Directives 

Encapsulate inline utility classes into a custom class.  

`style.css`

```css
.btn {
    @apply text-base font-medium rounded-lg p-3;  
}

.btn--primary {
    @apply bg-rose-500 text-white; 
}

.btn-secondary {
    @apply bg-gray-100 text-black; 
}
```

`index.html`

```html
<div class="grid grid-cols-2 gap-x-6">
    <button class="btn btn--secondary">Decline</button>
    <button class="btn btn--primary">Accept</button>
</div>
```



