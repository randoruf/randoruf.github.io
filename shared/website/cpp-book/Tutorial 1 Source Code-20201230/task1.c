#include <stdio.h>
#include <ctype.h>

const int MAX_STR_LENGTH = 20; 
int main(int argc, char *argv[]){
    
    char first_name[MAX_STR_LENGTH], last_name[MAX_STR_LENGTH]; 
    
    //scanf("%s %s", &first_name, &last_name); 
    scanf("%s %s", first_name, last_name);
    printf("%c. %c. \n", toupper(first_name[0]), toupper(last_name[0])); 

    return 0; 
}