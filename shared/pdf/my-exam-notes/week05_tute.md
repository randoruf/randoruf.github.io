### [Home](./index.html)

# Binomial Heap 

## Insert 

- 创建一个新的 node ，然后 Merge 。





## Extract-Min 

**易错点**：

- ***Extract-Min 之后忘记了 Consolidate*** 
  - Extract-Min 之后 Promote 可能有 degree 相同的树 (所以要合并)

- 提醒：就算是 Fibonacci Heap ***, 在 Extract-min 之后也要 Consolidate 。***

<img src="image-20210621102901271.png" alt="image-20210621102901271" style="zoom:33%;" />



- 上面是 `[10 (head), 1 (min), 3]`
- **Extract-Min 之后**
  -    [10(head), 12, 22, 3(min)]
       [10(head), 22, 3(min)]
       **[10(head), 3(min)]**



## Merge 

- 模拟**加减法**
- **进位有可能被顶下去**

![image-20210621101858061](image-20210621101858061.png)



![image-20210621101915369](image-20210621101915369.png)

## Decrease-key

修改那个 node ， 一直 bubble up 直到不违反 Heap 的规则

(即 **parent node 总是小于 child node**)

<img src="image-20210621104128002.png" alt="image-20210621104128002" style="zoom: 50%;" />

decrease key(48, 9)

<img src="image-20210621104149330.png" alt="image-20210621104149330" style="zoom:50%;" />









## Tree Property 

- **Bk** has **2^k** node
  - **Base Case** :  k == 0
  - **Inductive Hypothesis** : k **>=** 0  
  - `B_{k+1} = B_{k} + B_{k}`
- **Bk** has height **k**  
  - **Base Case** :  k == 0
  - **Inductive Hypothesis** : k **>=** 0  
  - `B_{k+1} = B_{k} + 1`  to construct `B_{k+1}` from `B_k`  (a child of ...)
- **Bk** at depth, the number of nodes is ***k choose d*** 
  - **Base Case**: B0, B1, B2
  - **Inductive Case**:  

<img src="image-20210621101626438.png" alt="image-20210621101626438" style="zoom:50%;" />



## Time Complexity 

![image-20210621103719143](image-20210621103719143.png)

![image-20210621103727848](image-20210621103727848.png)

![image-20210621103749510](image-20210621103749510.png)

![image-20210621103759263](image-20210621103759263.png)