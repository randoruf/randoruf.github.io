

# 887 扔鸡蛋

国内这种公司就喜欢问一些经典的面试问题：

- 比如2个鸡蛋从100楼往下扔



不过这面试官好像对我印象不好，可能对我先入为主了，认为我做的项目很水。

我当时应该怼她，你怎么不问我 Python 和 C++ 的基础知识呢？我这种眼界这么高的人，项目水平能超过我的也就只有轮子哥、面包那些人，我做过很多东西在我自己看来都是不值得介绍给别人看的。在这种面试就很吃亏。



---


## 暴力法

只用一个鸡蛋， 一层一层从低往上扔。



## 常规思维

其实这就是一个类似 ***k-d tree*** 或者 ***collision detection 的 broad phase/narrow phase*** 就可以解决的问题。

可见 **粗检测** 是一种非常常用的手段。

比如每隔10层楼扔一次， 那就是**粗检测**。然后只要蛋碎了就可以把范围缩小到 10 层以内， 再一层一层往上增加，就是**细检测**。

 明明已经学过 ***Collision Detection*** , 连 **Broad Phase** 都不懂。

这时答案就是 19 次。



当然其实还有一种方法就是**间隔不均匀**地扔。这样可以做到平均次数最少 (能想到的都是天选之人)。

比如第一次在 14 楼扔一次， 第二次 在 14+13 楼扔一次。。。

然后就是泛化问题了，比如第一个鸡蛋选择从 n 层开始扔。要求**所有分段的总**和必须能够覆盖100层。

![image-20210318203043110](image-20210318203043110.png)



可以解出 n=14。（约等于）

这样可以保证我第二个鸡蛋在扔的时候， 所需的平均次数会在 14 ~ 12 之间。 

（比如在 14 楼扔就碎了，我还要扔13次。但如果一直到99楼扔才碎， 就需要也要14次(一共14个分段)。最差的情况也是14次）

 



## 递归/动态规划

- [887. 鸡蛋掉落 - 力扣（LeetCode） (leetcode-cn.com)](https://leetcode-cn.com/problems/super-egg-drop/)

- [复工复产找工作？先来看看这道面试题：双蛋问题_哔哩哔哩 (゜-゜)つロ 干杯~-bilibili](https://www.bilibili.com/video/BV1KE41137PK?zw)

- Leetcode 的官方解释就很不错 [鸡蛋掉落 - 鸡蛋掉落 - 力扣（LeetCode） (leetcode-cn.com)](https://leetcode-cn.com/problems/super-egg-drop/solution/ji-dan-diao-luo-by-leetcode-solution-2/)



当然这里其实考点就是**递归的思想**。

看你能不能把一个**大问题**简化为多个**小问题**。

所以用 DP 的思想就可以了。

现在有 N 个鸡蛋， 有 M 层楼。 

你可以选择从不同的楼层扔鸡蛋。比如**第 i 层**时， 我还有 **j 个鸡蛋** (原来是这么简单的二维 DP 啊)。 

这时问题就会变成两个子问题。

<img src="v2-1643703ba277151871db8a9d15d6e792_1440w.jpg" alt="img" style="zoom: 25%;" />

- **没碎**：就是鸡蛋数不变，但层数变少了(注意不止一层，是从原来的 8 层减少到 4层)。 
- **碎了**：鸡蛋数减一， 而且层数也变少了(注意不止一层，是从原来的8层减少到3层)。

**思路提示**: 由于**楼层数**和**鸡蛋数**是大问题就给定的，你大概可以推断出子问题必须需要类似的变量才能找到答案。所以能够猜出来，子问题(也就是 dp 的索引) 需要**楼层数**和**鸡蛋数**。然后就是考虑子问题时， 了解**当前状态**和**未来/过去多个可能的状态**， 这有点像**蒙特卡洛搜索树**。

- 当前状态， 比如有 $$T$$ 层需要检验， 我还有 $$N$$ 个鸡蛋 (这显然是一个子问题，例如有 $$T$$ 层和$$N$$ 个鸡蛋的答案是多少)
- **未来/过去多个可能的状态**
	- 取决是 bottom-up 还是 top-down 策略
		- **当前状态依赖于过去状态**，或者**未来分支可以逆推当前状态**。
	- ***分支通常是由于选择造成的***，
	- 从第 $$i$$ 层开始扔就会产生两个分支 (假设原来有 $$T$$ 层楼要检测，和我有 $$N$$ 个鸡蛋)。 
		- 碎了， 产生的分支就是 $$dp(i-1, N - 1) $$ 。 因为我们只需要看更低的楼层 (注意此时子问题是看 $$0$$ 到 $$i-1$$ 之间的楼层）
		- 没碎， 产生的分支就是 $$dp(T-i, N)$$ 。因为我们只需要看更高的楼层 (注意此时子问题是看 $$i+1$$ 到 $$T$$ 之间的楼层)
		- 由于你在第 $$i$$ 层扔了一次， 所以还需要在分支的基础加上1就是答案(只考虑最差的情况)。
			-  $$dp(T, N) = 1 + \max(dp(T-i, N), dp(i-1, N-1))$$

最后因为不知道应该怎么选 $$i$$ 会比较好， 所以可以用**穷举**。

注意到如果你最多只有 $$i$$ 层， 那么你也只能从 $$0$$ 到 $$i$$ 之间选择， 你只要穷举 $$0$$ 到 $$i$$ 之间的所有可能即可。



```python

levels = 100
eggs = 2

dp = []
for _ in range(levels+1):
    dp.append([float('INF')] * (eggs+1))


def egg_drop(T: int, N: int):
    """
    @param: T 为楼层数
    @param: N 为鸡蛋数
    """

    # 说好的 Base Case 呢？
    if N == 1:  # 只有一个鸡蛋就没办法了(注意到10层楼时， 你最多只要扔9次)。
        return T
    if T == 0:  # 零层楼？不用扔！
        return 0

    # 如果我已经有最优答案了
    if dp[T][N] != float('INF'):
        return dp[T][N]

    min_res = float('INF')
    # 表示现在只有 T 层，我的穷举只能从 1 到 T 开始穷举。
    for i in range(1, T + 1):
        # 碎了(N-1)： 往下面看, 上面的楼层重力更大。
        # 没碎(N)：   往上面看
        res = 1 + max(egg_drop(i-1, N - 1), egg_drop(T - i, N))
        min_res = min(min_res, res)

    # 把最优答案存一下
    dp[T][N] = min_res
    return min_res


print(egg_drop(levels, eggs))

```



 最后就是这道题**只能用 Bottom-up 的解法**。因为 Recursive 会面临爆栈的问题。

```python

levels = 2000
eggs = 4

dp = []
for _ in range(levels+1):
    dp.append([float('INF')] * (eggs+1))


# Base Case: 零层不用扔
for i in range(eggs+1):
    dp[0][i] = 0
# Base Case:
for j in range(levels+1):
    dp[j][1] = j

for N in range(1, eggs+1):
    for T in range(1, levels+1):
        min_res = float('INF')
        for i in range(1, T + 1):
            # 碎了(N-1)： 往下面看, 上面的楼层重力更大。
            # 没碎(N)：   往上面看
            res = 1 + max(dp[i - 1][N - 1], dp[T - i][N])
            min_res = min(min_res, res)
        dp[T][N] = min_res


print(dp[-1][-1])
```



但是这种解法还会超时， 时间复杂度是(还需要看应该从哪一层扔使得答案最优)
$$
O(NT^2)
$$




 我们观察到 $$\textit{dp}(T, N)$$ 是一个关于 $$T$$ 的单调递增函数，也就是说在鸡蛋数 $$N$$ 固定的情况下，楼层数 $$T$$ 越多，需要的步数一定不会变少（比如一个鸡蛋时， 你可以发现，如果层数越多，你的步数只会增加）。

<img src="image-20210318193406650.png" alt="image-20210318193406650" style="zoom:50%;" />

所以 $$dp[i - 1][N - 1]$$ 是一个随着 $$i$$ 层数增加而**单调递增**的函数(需要检验的层数在减少)。

而 $$dp[T-i][N]$$ 是一个随着 $$i$$ 层数增加而**单调递减**的函数(需要检验的层数在减少)。

如上图所示，如果这两个函数都是连续函数，**那么我们只需要找出这两个函数的交点，在交点处就能保证这两个函数的最大值最小**。

由于 Leetcode 不允许 Python 过

```cpp
#include <iostream>
#include <algorithm>


int main(){
    const int MAX_T = 10000; 
    const int MAX_N = 100; 
    const int INF   = 99999;
    int dp[MAX_T+1][MAX_N+1];

    int eggs = 2; 
    int levels = 100;

    for (int i = 0; i < (levels+1); i++){
        for (int j = 0; j < (eggs+1); j++){
            dp[i][j] = INF;
        }
    }

    for (int i = 0; i < (eggs+1); i++){
        dp[0][i] = 0; 
    }
    for (int i = 0; i < (levels+1); i++){
        dp[i][1] = i; 
    }
    
    for (int N = 1; N < (eggs+1); N++){
        for (int T = 1; T < (levels+1); T++){
            
            int lo = 1;
            int hi = T; 
            while (lo + 1 < hi){
                int x = (lo + hi) / 2; 
                int t1 = dp[x-1][N-1]; 
                int t2 = dp[T-x][N]; 

                if (t1 > t2){
                    hi = x; 
                }else if (t1 < t2){
                    lo = x; 
                }else{
                    lo = hi = x; 
                }
            }

            int min_res = INF; 
            for (int x = lo; x < (hi+1); x++){
                int res = 1 + std::max(dp[x-1][N-1], dp[T-x][N]); 
                min_res = std::min(min_res, res);
            }
            dp[T][N] = min_res;
        }
    }

    std::cout << dp[levels][eggs] << std::endl;

    return 0; 
}
```

