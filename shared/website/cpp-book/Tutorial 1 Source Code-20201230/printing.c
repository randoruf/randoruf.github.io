/* printing.c: sending output to stdout */

#include <stdio.h>

int main(void)
{
	int number = 1;
	char unit_code[] = "FIT2100";

	printf("This is Tutorial %d for %s\n", number, unit_code);
	return 0;
}
