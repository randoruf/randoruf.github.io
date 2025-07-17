---
layout: post
title: '【TOY PJ】基于 Next.js 构建 Duolingo 克隆 Day 01' 
date: 2025-07-16
tags: [duolingo web toy_project]
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

## Button Libraries 


