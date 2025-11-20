---
layout: post
title: '铝窗的材料计算方法' 
date: 2025-11-19
tags: [other]
---

## 算法

贪心+暴力搜索即可。

不考虑大于6米的情况

- 假设一条6米长的材料
  - 需要获取的尺寸铝管先由大到小排序 (贪心)
  - 假设一条6米的铝管，在里面裁剪
  - 裁剪后，看看剩余的铝管是否可以继续裁剪出需要获取的尺寸 (暴力)

代码比较粗糙，有机会再重写。（另外时刻要记住，活下来比体面重要。有些创业公司天天说 Rust, Go, 分布式, 微服务，结果一看用户量10个，不到5个月就倒闭了，编程其实跟修厕所没什么区别。）

```python
cols = []
bars = []

cols.append(...)
bars.append(...)

# 默认长度是 6000
# --------------------------------------------------
alumin_batten_material_list = []
# 仓库里的压条, 假设有100条
for _ in range(100): alumin_batten_material_list.append(6000)
# --------------------------------------------------
# 添加需要的压条
# --------------------------------------------------
batten_list = bars
# -------------------------------------------------
batten_spare_used = [ False ] * len(batten_list)
total_batten_cnt = 0 
curr_material_idx = 0
curr_frontier = alumin_batten_material_list[curr_material_idx]
previous_cut = 0
while not all(batten_spare_used):
    min_left = float('inf') 
    best_fit_batten_idx = -1 
    for i, curr_batten in enumerate(batten_list):
        if batten_spare_used[i]: 
            continue
        if curr_frontier - curr_batten >= 0: 
            left = curr_frontier - curr_batten
            if left < min_left:
                min_left = left
                best_fit_batten_idx = i 

    if best_fit_batten_idx == -1: 
        print("- 剩余: ", curr_frontier, '\n第', total_batten_cnt+1, '条方铝压条(20x20)(', alumin_batten_material_list[curr_material_idx], ')\n\n----------------')
        curr_material_idx += 1
        if curr_material_idx == len(alumin_batten_material_list):
            print('[[ END ]]')
            break
        curr_frontier = alumin_batten_material_list[curr_material_idx]
        total_batten_cnt += 1 
        previous_cut = 0
    else: 
        curr_frontier -= batten_list[best_fit_batten_idx]
        batten_spare_used[best_fit_batten_idx] = True
        print(batten_list[best_fit_batten_idx] + previous_cut)  
        previous_cut = batten_list[best_fit_batten_idx] + previous_cut

if curr_material_idx < len(alumin_batten_material_list):
    print("- 剩余: ", curr_frontier, '\n第', total_batten_cnt+1, '条方铝压条(20x20)(', alumin_batten_material_list[curr_material_idx],')\n\n----------------')

# 剩余多少没有完成
batten_left_cnt = {}
for i, bat in enumerate(batten_spare_used):
    if not bat: 
        if batten_list[i] not in batten_left_cnt:
            batten_left_cnt[batten_list[i]] = 1
        else:
            batten_left_cnt[batten_list[i]] += 1
for k in batten_left_cnt.items():
    print(k[0], k[1])

total_len = sum(batten_list) 
cnt = total_len / 6000
print("\n\n\n理论条数最小值: ", cnt)

# 20x20的方压条要买
print('20x20 1.4厚 深灰色方压条 ', round(cnt),' 要买条。')
print('\n\n----------------------------\n\n')
```


