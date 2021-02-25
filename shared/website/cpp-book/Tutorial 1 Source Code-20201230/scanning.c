/* scanning.c: receiving input from stdin */

#include <stdio.h>

int main(void)
{
	int day, month, year;

	printf("Enter the date: ");
	scanf("%d %d %d", &day, &month, &year);

	printf("%d-%d-%d\n", day, month, year); 
	return 0;
}
