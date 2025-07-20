---
layout: post
title: '【TOY PJ】基于 Next.js 构建 Duolingo 克隆 Day 01' 
date: 2025-07-16
tags: [duolingo,web,toy_project]
---

## Project Setup 

1. 新建一个 Next.js 应用

```
npx create-next-app@latest
```

2. 安装 shadcn/ui 

文档 <https://ui.shadcn.com/docs/cli>

> Use the init command to initialize configuration and dependencies for a new project.

(pnpm、npm、bun是什么区别?)

```
npx shadcn@latest init
```

3. 测试

```bash
npm run dev
```

## TailwindCSS 

1. test tailwindcss, open `src/app/page.tsx`

```tsx
export default function Home() {
  return (
    <div>
      <p className="text-green-500 font-bold text-20xl">Hello Lingo!</p>
    </div>
  );   
}
```

Read <https://tailwindcss.com/docs/installation/tailwind-cli>

Read <https://randoruf.github.io/2025/07/02/tailwindcss.html>

## Shadcn UI 

1. add a shadcn ui component 

(read <https://ui.shadcn.com/docs/installation/next>)

(read component libraries <https://ui.shadcn.com/docs/components>)

You can now start adding components to your project.

```bash
npx shadcn@latest add button
```

import the component in `src/app/page.tsx`. 

```tsx
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <Button size="lg" variant="destructive">Click Me</Button>
    </div>
  );   
}
```

2. Shadcn UI component variant. 

The `variant="destructive"` 代表变体，具体参数设置可以在 `@/components/ui/button`

```css
variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        }
    }
```

## Router

1. create a new folder `src/app/console` and a page file `src/app/console/page.tsx`

```tsx
import { Button } from "@/components/ui/button";

const ConsolePage = () => {
    return (
        <div>
            <div>Console Page</div>
            <div className="p-4 space-y-4 flex flex-col lg:flex-row">
                <Button>Primary</Button>
                <Button>Primary Outline</Button>
            </div>
        </div>
    );
}; 

export default ConsolePage; 
```

or 

```tsx
export default function ConsolePage() {
    return (
        <div>
            <div>Console Page</div>
            <div className="p-4 space-y-4 flex flex-col lg:flex-row max-w-[200px]">
                <Button>Primary</Button>
                <Button>Primary Outline</Button>
            </div>
        </div>
    );
}
```

- 其中 `border-b-4` 和 `border-b-[4px]` 后面是具体数字。

## A Duolingo Button 

如何制作多邻国的动画效果。

```
"bg-white text-black border-slate-200 border-2 border-b-4 active:border-b-2 hover:bg-slate-100 text-slate-500"
```

- `border-slate-200` 边框颜色
- `border-b-4` border bottom 的边框宽度

Create a button UI libraries for Duolingo with shadcn/ui and tailwindcss. 

(see <https://youtu.be/dP75Khfy4s4?si=2q3dlULHuZkRTlbs&t=1770>)

```tsx
      variant: {
        default:
          "bg-white text-black border-slate-200 border-2 border-b-4 active:border-b-2 hover:bg-slate-100 text-slate-500",
        primary: 
          "bg-sky-400 text-primary-foreground border-sky-500 border-b-4 hover:bg-sky-400/90 active:border-b-1", 
        primaryOutline:
          "bg-white text-sky-500 hover:bg-slate-100", 
        secondary:
          "bg-green-500 text-primary-foreground border-green-600 border-b-4 hover:bg-green-500/90 active:border-b-1", 
        secondaryOutline:
          "bg-white text-green-500 hover:bg-slate-100", 
        danger:
          "bg-rose-500 text-primary-foreground border-rose-600 border-b-4 hover:bg-rose-500/90 active:border-b-1", 
        dangerOutline:
          "bg-white text-rose-500 hover:bg-slate-100", 
        super:
          "bg-indigo-500 text-primary-foreground border-indigo-600 border-b-4 hover:bg-indigo-500/90 active:border-b-1", 
        superOutline:
          "bg-white text-indigo-500 hover:bg-slate-100", 
        ghost:
          "bg-transparent text-slate-500 border-transparent border-0 hover:bg-slate-100", 
        sidebar:
          "bg-transparent text-slate-500 border-2 hover:bg-slate-100 transition-none", 
        sidebarOutline:
          "bg-sky-500/15 text-sky-500 border-sky-300 border-2 hover:bg-sky-500/20 transition-none"
      },
```


## Next.js File Conventions  

<https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes>

### Dynamic Route Segments

If we want to build a blog system, the blog page with dynamic data can be render by providing the route segment names. 

For example, the blog page `app/blog/[id]/page.tsx`

```tsx
export default async function Page({ params }: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params; 
  const { title, content } = await queryPost(id); /* send request to the database/JDBC */; 

  return 
    <div>
      <h2>Title: {title} </h2>
      <p>Content: {content}</p>
    </div>
}
```


### Path Name with Parenthese in Next.js 

A **route group** can be created by wrapping a folder's name in parenthesis: `(folderName)`.

This convention indicates the folder is for organizational purposes and should not be included in the route's URL path.


```
app 
    (admin)
        dashboard 
            page.js     -> /dashboard
    (marketing)
        about
            page.js     -> /about
        blog 
            page.js     -> /blog
```

In this case, we can ***group*** different kinds of routes by a directory whose name is wrapped by a pair of parenthesis. 

