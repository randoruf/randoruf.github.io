---
layout: post
title: "Windows Liunx Subsystem "
date: 2019-12-06T10:20:00Z
---

* TOC
{:toc}
## Summary for WSL User 

* In WSL, the `systemd` will not start up when you reboot the computer, which means any new start-up services are disabled by default.
  * `echo 0 | sudo tee /proc/sys/kernel/yama/ptrace_scope`
  * https://www.jetbrains.com/help/clion/attaching-to-local-process.html
    * So please run `sudo service procps restart` to refresh the value of `ptrace_scope` every time you reboot. And  `sysctl kernel.yama.ptrace_scope` to whether it changes. 

* In addition, you can open the Desktop folder/directory in Windows by entering `cd /mnt/c/Users/xxx/Desktop` . 



## Installing WSL

### Installing Ubuntu System 

* First enable **Developer Mode** in Windows. 
* **Enable WSL features** in Control panel. or `Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux` via Powershell.
* Go to **Microsoft Store**. 
* Install **Ubuntu 18.04 LTS**

### Customizing Ubuntu

http://cpraveen.github.io/comp/wsl.html

These tips are based on using the Ubuntu version of [WSL](https://docs.microsoft.com/en-us/windows/wsl/install-win10) which is currently at version 18.04 LTS. Before installing Ubuntu from the Microsoft Store, open Powershell as administrator and run this command

```
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux
```

Windows drives (usually called C and D) are available in `/mnt` and you can work in these drives from the Linux command line. An important point to remember: **never edit a file under Linux using a Windows program**. The best approach is to save all your work files in C or D drive and never under Linux. For example, you can create directories in D drive and make symlinks from your home directory under Linux

```
cd $HOME
mkdir /mnt/d/Work
ln -s /mnt/d/Work Work
mkdir /mnt/d/Tex
ln -s /mnt/d/Tex Tex
```

In addition, you can create symlinks to some useful Windows folders (replace USERNAME with your Windows user name)

```
cd $HOME
ln -s /mnt/c/Users/USERNAME/Desktop   Desktop
ln -s /mnt/c/Users/USERNAME/Documents Documents
ln -s /mnt/c/Users/USERNAME/Downloads Downloads
```

In Ubuntu, we install some important programs using apt

```
sudo apt install gcc gfortran
sudo apt install python                (required by spack)
sudo apt install python3-numpy
sudo apt install python3-scipy
sudo apt install python3-sympy
sudo apt install python3-matplotlib
sudo apt install jupyter
sudo apt install gnuplot               (install xming)
sudo apt install gv
sudo apt install xpdf
```

and the rest we install using [Spack](http://cpraveen.github.io/comp/spack.html). Other applications can be installed on Windows side, e.g., FileZilla, FireFox, gVim, VisIt, VLC, gmsh, SourceTree, MikTex and VS Code. We can run these Windows programs from the Linux command line by defining some aliases, see sample bashrc file [here](https://github.com/cpraveen/cfdlab/blob/master/bin/bashrc_wsl.txt) which you can add at the end of your `$HOME/.bashrc` file.

### Miscellaneous

- Search: press Windows Key and type your query.

- Lock screen: press Ctrl+Alt+Delete and select Lock, or press Windows key + L key.

- Disable Windows bell sound, etc. in bash: Open `$HOME/.inputrc` and add the lines

  ```
  set bell-style none
  set completion-ignore-case on
  set show-all-if-ambiguous on
  ```

- To set gvim font, add following line to file `/mnt/c/Users/USERNAME/.gvimrc`

  ```
  set guifont=Consolas:h11
  ```

- **OpenMPI** would give some warning message at end of each run; To get rid of this message, see the previous step about how to ***Installing OpenMPI*** 



## GUI WSL

You can use a **"monitor"** to connect WSL. 

This is very similar to that you use **SSH** to connect Raspberry Pi computer. 






## Installing OpenMPI

**IMPORTANT**: make sure you have installed `gcc`, `g++` and `make`

1. Create a temporary directory for compiling OpenMPI by typing `mkdir ~/local/openmpi`
2. Download openmpi-.tar.bz2 from official website <http://www.open-mpi.org>
   1. You can do this by typing `wget "<URL>"`
   2. You may notice `man wget` says *--directory-prefix=prefix* can specify the targed directory. The example is `wget "<URL>" --directory-prefix=~/Downloads/`
3. Move the openmpi.tar.bz2 to the directory just created `mv ~/Downloads/openmpi-x.tar.bz2 ~/local/openmpi/`
4. Enter the directory `cd ~/local/openmpi` and extract the package `tar -xzvf openmpi-x.tar.bz2`
5. Go into the source directory `cd openmpi-x`
6. Configure, compile and install 
   1. Install OpenMPI to directory **$HOME/opt/openmpi** by typing`./configure --prefix=$HOME/opt/openmpi` . (and `$HOME` and `~` are the same thing)
   2. `make all`
   3. `make install`
7. Remove downloaded files `cd ~` , `rm -R $HOME/local/openmpi`
8. Add MPI to `$PATH` and `LD_LIBRARY_PATH` environment variable
   1. Open `$HOME/.bashrc` by any text editor (must be in`sudo`)
   2. Attache to bottom of file
      1. `export PATH=\$PATH:\$HOME/opt/openmpi/bin` 
      2. `export LD_LIBRARY_PATH=\$LD_LIBRARY_PATH:\$HOME/opt/openmpi/lib`
   3. make it effect `source ~/.bashrc`
9. To delete OpenMPI, you need to delete `$HOME/opt/openmpi` directory and modify `.bashrc` to remove all \$PATH and \$LD_LIBRARY_PATH system environment variables. 



To compile you first MPI prorgram, you could try this [hello_mpi_world.c](hello_mpi_world.c) . 

```bash
mpicc hello_mpi_world.c -o hello_mpi_world
```

and 

```bash
mpirun -n 2 hello_mpi_world
```



If you are using **Windows Subsystem Linux**, you may see some warning message from openMPI. This is because openMPI does not like the value of `/proc/sys/kernel/yama/ptrace_scope` to be 1. 

You can change this value permanently by modifying `/etc/sysctl.d/10-ptrace.conf` . 

Use `sudo vim` to change the line `kernel.yama.ptrace_scope = 1` to `kernel.yama.ptrace_scope = 0`

Then `sudo service procps restart` to restart your services. 

See [Clion document](https://www.jetbrains.com/help/clion/attaching-to-local-process.html) here 

And notice that `/proc/sys/kernel/yama/ptrace_scope` is stored in RAM, the command `echo 0 | sudo tee /proc/sys/kernel/yama/ptrace_scope` could only change the value temporarily. 



