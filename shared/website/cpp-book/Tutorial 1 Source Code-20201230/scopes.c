/* scopes.c: global scopes and local scopes */

#include <stdio.h>

void func(void);

int main(void)
{
        func();		/* x = 1, y = 1 */
        func();		/* x = 1, y = 2 */
        func();		/* x = 1, y = 3 */
}

void func(void)
{
        int x = 0;
        static int y = 0;

        x++;
        y++;

        printf("%d %d\n", x, y);
}
