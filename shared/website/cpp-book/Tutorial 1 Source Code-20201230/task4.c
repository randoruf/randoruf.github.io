#include <stdio.h>


int main(){
    char digits[3]; 

    scanf("%c%c%c", digits, digits+1, digits+2); 
    printf("%c%c%c\n", *(digits+2), *(digits+1), *digits);

    return 0;        
}