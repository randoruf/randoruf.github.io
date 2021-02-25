---
layout: post
title: "设置 Powershell "
date: 2020-09-18T00:20:00Z
---





---

新 Windows 10 默认禁用运行 Powersell 的脚本。

<https://docs.vmware.com/en/vRealize-Automation/7.1/com.vmware.vra.iaas.hp.doc/GUID-9670AFC5-76B8-4321-822A-BCE05800DB5B.html>

这是 VMware 的教程， 你可以把 PowerShell Execution Policy 从 Restricted 改到 RemoteSigned 或者 Unrestricted 来允许 PowerShell 脚本的运行。 

可以看一下 `help Set-ExecutionPolicy` 来看帮助。 

---

### 过程

- Log in as **Windows administrator** 
  - This PC > Manage > Local Users and Groups > Users 
  - Administrator properties > ***Account is disabled*** 
- Select     **Start > All Programs > Windows PowerShell version > Windows PowerShell** 
- Type `Set-ExecutionPolicy RemoteSigned` to set the policy to RemoteSigned.
- Type `Get-ExecutionPolicy` to verify the current settings for the execution policy.
- Type `Exit`.

