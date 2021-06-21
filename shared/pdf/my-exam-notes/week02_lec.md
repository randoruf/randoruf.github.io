### [Home](./index.html)

# Boyer-Moore 

<img src="image-20210621065324614.png" alt="image-20210621065324614" style="zoom:50%;" />



## Bad Character Rule 

![image-20210621065912529](image-20210621065912529.png)

- **R(x)**  is the the **rightmost position** of occurrence of character x in pat



## Extened Bad Character Rule 

![image-20210621070059785](image-20210621070059785.png)

-  mismatched character is **x = txt[j + k − 1]**,
- `R[k][x]` is the **closest x in pat that is to the left of position k**

## Good suffix rule

![image-20210621071317449](image-20210621071317449.png)

- **Reverse** the pat and **compute Zˆ{suffix}_p**, 
- For **p** = **1** to **m-1**
  - for each **suffix** starting at position **j** in pat,
  - **j** = m - **Zˆ{suffix}_p** + 1   
  - goodsuffix(**j**) = **p**



- Case 1a : If **Good Suffix** can be found, 
  - m − goodsuffix(k + 1) places.

![image-20210621071925136](image-20210621071925136.png)

- Case 1b: If **no** good suffix 
  - m − matchedprefix(k + 1) 

![image-20210621071349354](image-20210621071349354.png)

- Case 2: fully matched 
  - m − matchedprefix(2) places.



## Galil’s optimisation

![image-20210621072757124](image-20210621072757124.png)



<img src="image-20210621072733198.png" alt="image-20210621072733198" style="zoom:50%;" />



## Time Complexity 

Given **txt**[1...10]=aaaaaaaaaa and**pat**[1...3]=aaa

Boyer-Moore will run **O(mn)**     

But Galil’s optimisation can make it linear **O(m+n)**. 





# KMP 

<img src="image-20210621073620162.png" alt="image-20210621073620162" style="zoom:50%;" />

- **SPi** is the **length of the longest proper suffix of pat[1 . . . i]** that matches a **prefix** of pat, 
  - such that pat[i + 1] != pat[SPi+1].
  - **i** = **j** + **Z_j** - 1
  - **SP_i** = **Z_j**

![image-20210621073723997](image-20210621073723997.png)

- KMP shift pat by exactly **i − SPi** places to the right.
  - If an occurrence of pat is found, **m − SPm** places.

