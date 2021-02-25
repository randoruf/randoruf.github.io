#include <stdio.h>

int addition(int n, int nums[]){
    int ans = 0; 
    for (unsigned i = 0; i != n; ++i){
        ans += nums[i]; 
    }
    return ans; 
}

int main(){
    int nums[] = {1, 2, 3, 4, 5}; 

    printf("%d \n", addition(5, nums)); 

    return 0; 
}