#include <stdio.h>
#include <float.h> 
// https://docs.microsoft.com/en-us/cpp/c-language/limits-on-floating-point-constants?view=msvc-160

int addition(int a, int b){
    return a+b;
}

int subtraction(int a, int b){
    return addition(a, -b); 
}

int multiplication(int a, int b){
    return a*b; 
}

double division(int a, int b){
    if (b != 0){
        return a/(float) b; 
    }
    return DBL_MAX; 
}

int main(){
    int a, b; 
    scanf("%d %d", &a, &b); 

    printf("Addition: %d \n", addition(a, b)); 
    printf("Subtraction: %d \n", subtraction(a, b)); 
    printf("Multiplication: %d \n", multiplication(a, b)); 
    printf("Division: %lf \n", division(a, b)); 

    return 0; 
}