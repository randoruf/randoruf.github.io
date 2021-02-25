#include <stdio.h>
#include <stdlib.h>
#include <time.h>


int main(){
    char ans[6]; 
    // printf("%d \n", RAND_MAX);  

    /* Intializes random number generator, otherwise, the random seed is the same */ 
    time_t t;
    srand((unsigned) time(&t));

    // In 64 bit computer!!!!
    int i = 6; 
    int tmp = rand() % 999999; 
    //tmp = 123456;
    while(i--){
        ans[i] = (tmp % 10) + '0';
        tmp /= 10;
    }

    i = -1; 
    while (i++ != 6){
        printf("%c", ans[i]);   
    }
    printf("\n"); 
    return 0; 
}