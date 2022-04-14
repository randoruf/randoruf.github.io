---
layout: post
title: "Azure Custom Image"
date: 2022-03-07
tags: [cs]
---

There are two ways to create custom images for Azure. 

- capture a VM in Azure (most of YouTube will teach you how to do that)
- start from a VHD file 

## Prepare a VHD for Azure 

**Step 1:** Install the Linux in Hyper-V 

> Hyper-V drivers/modules will be automatically turned on if you use Hyper-V hypervisor. 
>
> If you use VirtualBox, you may need to install `hv_vmbus` etc. modules, and enable them in initramfs. But I have failed a few times by doing that, so I recommend Hyper-V.  
>
> You could test those modules by `lsmod | grep hv_`

**Step 2**: Prepare an Ubuntu virtual machine for Azure

[Create and upload an Ubuntu Linux VHD in Azure - Azure Virtual Machines - Microsoft Docs](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/create-upload-ubuntu)

> Follow steps, but remember to delete your personal account, and **login to the `root` account to deprovision the VM.** 
>
> You could copy all those scripts and upload to Github. In VM, clone those scripts and execute them. Before executing them, give each script the `chmod +x your.sh` and run it `./your.sh`
>
> Make sure your personal account is deleted. Note that Ubuntu Desktop does not allow you to login by `root`, so it makes more senses to install Ubuntu Server (ans SSH Port 22 is lisening). 
>
> or [Ubuntu图形桌面切换到命令行界面 - 运维密码 - 博客园 (cnblogs.com)](https://www.cnblogs.com/mefj/p/13537802.html)

**Step 3:** Upload VHD to Azure (with Azure Storage Explorer)

[How to Bring Your Own Operating System to Azure with Virtual Machine Hard Disk Images (VHD) - YouTube](https://www.youtube.com/watch?v=fVwVq_RGwc0)

>Create a Storage Account in Azure (disable the **"public access"**)
>
>and upload VHD by Azure Storage Explorer. 

