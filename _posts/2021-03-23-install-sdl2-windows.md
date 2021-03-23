---
layout: post
title: "安装 SDL2 (Setup SDL2 with VS2019 and vcpkg)"
date: 2021-03-23T00:20:0Z
---



![taowyoo profile image](/shared/imgs/ed974240-0bef-41b7-8c73-6287ef3640c7.png) 1 Feb ・3 min read

## Install Visual Studio Community 2019

Download the installer of Visual Studio from https://visualstudio.microsoft.com/

[![Alt Text](/shared/imgs/eeyakzu5rrfkk27g29c8.png)](https://res.cloudinary.com/practicaldev/image/fetch/s--N8GbsM1o--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/eeyakzu5rrfkk27g29c8.png)

Install Visual Studio with from C++ selected as follow:

[![Alt Text](/shared/imgs/gqzhqkfntk5lvdup4vy0.png)](https://res.cloudinary.com/practicaldev/image/fetch/s--8fVCY_Ig--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/gqzhqkfntk5lvdup4vy0.png)

## Install vcpkg

Install [Git](https://git-scm.com/)

1. Download and run Git installer from https://git-scm.com/downloads
2. Select all default options during the Git Setup Wizard to install the Git.

Clone and build vcpkg to where you like:

```bash
git clone https://github.com/microsoft/vcpkg
.\vcpkg\bootstrap-vcpkg.bat
```

In order to use vcpkg with Visual Studio, run the following command (may require administrator elevation):

```
.\vcpkg\vcpkg integrate install
```

I recommend add `vcpkg` to the **system path**. In the following steps, I assume the `vcpkg.exe` has been added to the system path. 



## Install SDL2 through vcpkg

In the folder where you cloned the vcpkg:

```bash
vcpkg install sdl2:x64-windows
vcpkg install sdl2-image:x64-windows
vcpkg install sdl2-ttf:x64-windows
```

If you want to install the 32-bit version of SDL2:

```bash
vcpkg install sdl2:x86-windows
vcpkg install sdl2-image:x86-windows
vcpkg install sdl2-ttf:x86-windows
```

**Hints**: If you want to see what other dependencies you may need, try to search for a package. 

```bash
vcpgk search sdl2
```



## Setup an example project in Visual Studio

Start up Visual Studio and create a new empty C++ project
[![Alt Text](/shared/imgs/6ic0923wwmcan70yzmpt.png)](https://res.cloudinary.com/practicaldev/image/fetch/s--crpzmXwL--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/6ic0923wwmcan70yzmpt.png)

Give your project/solution whatever name you'd like and place it where ever you'd like

1. Now, if your default build setting is Debug x86, you may need to change it:
	[![Alt Text](/shared/imgs/993c6bo8q4bi186qnhfd.png)](https://res.cloudinary.com/practicaldev/image/fetch/s--G7cEhawQ--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/993c6bo8q4bi186qnhfd.png)

	* If you installed the x86 version of SDL2 above, you do not need to do this.

2. Because the [SDL2 redefine the main function](https://vcpkg.readthedocs.io/en/latest/users/integration/), so the vcpkg won't help us auto link the SDL2main.lib

3. Let's manually link the SDL2main.lib

	1. Go to project properties: <br>![Alt Text](/shared/imgs/yl8f67ddggiitwreud5j.png)
	2. Go to **Configuration Properties -> VC++ Directories -> Library Directories -> Edit**.<br>![Alt Text](/shared/imgs/fdfdeqeqtidofdrj7h79.png)
	3. And then add the directory where SDL2main.lib located: `$(VcpkgCurrentInstalledDir)$(VcpkgConfigSubdir)lib\manual-link\` or  <br> `...\vcpkg\installed\x86-windows\debug\lib\manual-link`    
	4. Then told linker to link the `SDL2maind.lib`, go to **Configuration Properties -> Linker -> Input-> Additional Dependencies -> Edit** <br>![image-20210323171312517](/shared/imgs/image-20210323171312517.png)Then add <br>![image-20210323171347840](/shared/imgs/image-20210323171347840.png)
	5. Now we finished all we need before coding, close the property page.

4. Finally, create an example program to test the configuration

	Create a new source code file:

	[![Alt Text](/shared/imgs/f5g8a529pyf06k46nhmc.png)](https://res.cloudinary.com/practicaldev/image/fetch/s--1KVWvNL3--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/f5g8a529pyf06k46nhmc.png)

	Then add following code into it:

```cpp
//Using SDL and standard IO
#include <SDL2/SDL.h>
#include <stdio.h>

//Screen dimension constants
const int SCREEN_WIDTH = 640;
const int SCREEN_HEIGHT = 480;

int main(int argc, char* args[])
{
    //The window we'll be rendering to
    SDL_Window* window = NULL;

    //The surface contained by the window
    SDL_Surface* screenSurface = NULL;

    //Initialize SDL
    if (SDL_Init(SDL_INIT_VIDEO) < 0)
    {
        printf("SDL could not initialize! SDL_Error: %s\n", SDL_GetError());
    }
    else
    {
        //Create window
        window = SDL_CreateWindow("SDL Tutorial", SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED, SCREEN_WIDTH, SCREEN_HEIGHT, SDL_WINDOW_SHOWN);
        if (window == NULL)
        {
            printf("Window could not be created! SDL_Error: %s\n", SDL_GetError());
        }
        else
        {
            //Get window surface
            screenSurface = SDL_GetWindowSurface(window);

            //Fill the surface white
            SDL_FillRect(screenSurface, NULL, SDL_MapRGB(screenSurface->format, 0xFF, 0xFF, 0xFF));

            //Update the surface
            SDL_UpdateWindowSurface(window);

            //Wait two seconds
            SDL_Delay(2000);
        }
    }

    //Destroy window
    SDL_DestroyWindow(window);

    //Quit SDL subsystems
    SDL_Quit();

    return 0;
}
```

After press Ctrl+F5, if all right, you could see a white window pop up for about 2 seconds and then closed.