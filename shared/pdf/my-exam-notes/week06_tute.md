### [Home](./index.html)

# Fibonacci Heap 

## Insert 

- 把 **新的 node** 插入到 **Hmin的左边**

<img src="image-20210621104504874.png" alt="image-20210621104504874" style="zoom: 33%;" />

## Merge 

**更新 Hmin**,  然后连起来。 

<img src="image-20210621104557216.png" alt="image-20210621104557216" style="zoom:33%;" />

## Decrease Key

<img src="image-20210621105526130.png" alt="image-20210621105526130" style="zoom: 50%;" />

<img src="image-20210621105543694.png" alt="image-20210621105543694" style="zoom: 50%;" />

<img src="image-20210621105603870.png" alt="image-20210621105603870" style="zoom:50%;" />



<img src="image-20210621105643573.png" alt="image-20210621105643573" style="zoom: 50%;" />



<img src="image-20210621105721080.png" alt="image-20210621105721080" style="zoom:50%;" />

<img src="image-20210621105741100.png" alt="image-20210621105741100" style="zoom:50%;" />

## Extract-min

- Cut 掉 Hmin 
- 然后 **promote Hmin 的 children** 
- 找到新的 Hmin 
- 让 Curr 指向 Hmin (新的 Hmin)
- 用 Auxiliary List 记录 Curr 的 degree (即 index 是 Curr 的 degree)
- Merge 相同 degree 的 tree (用 list)

![image-20210621105132101](image-20210621105132101.png)

<img src="image-20210621105156738.png" alt="image-20210621105156738" style="zoom: 50%;" />

<img src="image-20210621105219154.png" alt="image-20210621105219154" style="zoom:40%;" />

<img src="image-20210621105345920.png" alt="image-20210621105345920" style="zoom:50%;" />

