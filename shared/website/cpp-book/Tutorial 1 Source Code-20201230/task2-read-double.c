#include <stdio.h>
#include <math.h>
//https://docs.microsoft.com/en-us/cpp/c-runtime-library/math-constants?view=msvc-160

int main(int argc, char *argv[]){

    double r; 
    scanf("%lf", &r); 
    //scanf("%d", &r); 

    printf("circumference: %.2lf \n", 2*M_PI*r); 
    printf("area: %.2lf \n", r*r*M_PI);


    return 0; 
}