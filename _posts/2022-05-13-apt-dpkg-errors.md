---
layout: post
title: "dpkg/apt 安装错误"
date: 2022-05-13
tags: [cs,os,ubuntu]
---

The dpkg sometimes may report error when its installation is imcomplete. 

For example, it may show the following message (see the appendix). 

The `--fix-broken` would not work, it says that `post-installation script subprocess returned error exit status 1`

The solution is to remove all those post-installtion script, 

See this post <https://askubuntu.com/questions/1371963/ubuntu-20-04-lts-failed-to-install-linux-image-5-4-0-89-generic>

### Method 1:  try force overwriting the files:
```
sudo dpkg -i --force-overwrite var/cache/apt/archives/linux-image*
sudo dpkg -i --force-overwrite var/cache/apt/archives/wireguard-dkms*
sudo dpkg -i --force-overwrite var/cache/apt/archives/linux-module*
sudo apt --fix-broken install
```
Meaning:

- Here, the --force-overwrite argument will force dpkg to place the files regardless of the errors. The error message seems to normal and not destructive, you can run the commands without any fear.

- In the last command the --fix-broken argument will reconfigure/reprocess the error packages.

### Method 2: 

If this didn't work then you need to remove the post-installation script of the packages:
```
sudo rm /var/lib/dpkg/info/linux-image-5.4.0-89-generic.postinst
sudo rm /var/lib/dpkg/info/wireguard-dkms.postinst
sudo rm /var/lib/dpkg/info/linux-modules-extra-5.4.0-89-generic.postinst
```

Then run a force-install:
```
sudo apt --fix-broken install
```
Then run an autoremove:
```
sudo apt autoremove && sudo apt clean
```
Meaning:
- The post-installation script of the package consists of commands to be run after the installation is complete to tell other applications about the installation of the package. Removing that will not do any harm as running --fix-broken install already ran the post-installation script.

After running the commands mentioned above, make sure to run these commands:

```
sudo apt update && sudo apt upgrade && sudo apt autoremove && sudo apt clean && sudo apt autoclean && sudo apt --fix-broken install
```

The orginal author is <https://askubuntu.com/users/1460940/someone>.



### Appendix: the error

```
randoruf@my-machine:/$ sudo apt --fix-broken install
Reading package lists... Done
Building dependency tree       
Reading state information... Done
0 to upgrade, 0 to newly install, 0 to remove and 35 not to upgrade.
4 not fully installed or removed.
After this operation, 0 B of additional disk space will be used.
Setting up linux-headers-5.4.0-109-generic (5.4.0-109.123~18.04.1) ...
/etc/kernel/header_postinst.d/dkms:
 * dkms: running auto installation service for kernel 5.4.0-109-generic
Error! Could not locate dkms.conf file.
File:  does not exist.
   ...fail!
run-parts: /etc/kernel/header_postinst.d/dkms exited with return code 4
dpkg: error processing package linux-headers-5.4.0-109-generic (--configure):
 installed linux-headers-5.4.0-109-generic package post-installation script subprocess returned error exit status 1
dpkg: dependency problems prevent configuration of linux-headers-generic-hwe-18.04:
 linux-headers-generic-hwe-18.04 depends on linux-headers-5.4.0-109-generic; however:
  Package linux-headers-5.4.0-109-generic is not configured yet.

dpkg: error processing package linux-headers-generic-hwe-18.04 (--configure):
 dependency problems - leaving unconfigured
Setting up linux-image-5.4.0-109-generic (5.4.0-109.123~18.04.1) ...
No apport report written because the error message indicates its a followup error from a previous failure.
                                                                                                          dpkg: dependency problems prevent configuration of linux-generic-hwe-18.04:
 linux-generic-hwe-18.04 depends on linux-headers-generic-hwe-18.04 (= 5.4.0.109.123~18.04.94); however:
  Package linux-headers-generic-hwe-18.04 is not configured yet.

dpkg: error processing package linux-generic-hwe-18.04 (--configure):
 dependency problems - leaving unconfigured
No apport report written because the error message indicates its a followup error from a previous failure.
                                                                                                          Processing triggers for linux-image-5.4.0-109-generic (5.4.0-109.123~18.04.1) ...
/etc/kernel/postinst.d/dkms:
 * dkms: running auto installation service for kernel 5.4.0-109-generic
Error! Could not locate dkms.conf file.
File:  does not exist.
   ...fail!
run-parts: /etc/kernel/postinst.d/dkms exited with return code 4
dpkg: error processing package linux-image-5.4.0-109-generic (--configure):
 installed linux-image-5.4.0-109-generic package post-installation script subprocess returned error exit status 1
No apport report written because MaxReports is reached already
                                                              Errors were encountered while processing:
 linux-headers-5.4.0-109-generic
 linux-headers-generic-hwe-18.04
 linux-generic-hwe-18.04
 linux-image-5.4.0-109-generic
E: Sub-process /usr/bin/dpkg returned an error code (1)
```
