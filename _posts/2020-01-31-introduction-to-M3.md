---
layout: post
title: "Introduction to M3: a high performance computing platform "
date: 2020-01-31T10:20:00Z
---



* TOC
{:toc}



## M3 Summary 

- M3 utilises **SLURM** scheduler to manage the resources. (same as MonARCH )
  - There are 5 partitions available **(partition is used to distinguish nodes with different configuration)**. 
  - Hence, it is very important to **figure out your computational requirements** and **then select the right partition**. 
  - For normal CPU computing see <https://docs.massive.org.au/M3/m3users.html#compute>, for GPU computing see <https://docs.massive.org.au/M3/m3users.html#gpu-compute>
- Useful SLURM commands 
  - `squeue` : list all jobs waiting in the queue. 
  - `show_cluster` : select a cluster with the correct configuration here!
  - `show_job` : display the status of your job. 
  - `sbatch <slurm_script_file>` : to submit a job 
  - `scontrol show job <JOBID>` : show details of particular job (with job id)
  - `scancel <JOBID>` : to cancel a job



## Login to M3 

Use **MobaXterm** or **PuTTY** on Windows, and then start a new SSH session. 

If on MacOS, `ssh` can be used. 

Then read the documentation <https://docs.massive.org.au/index.html#welcome-to-the-m3-user-guide>



## Workspace and Storage

`user_info`  to check the storage of your account. 

The M3 File system is arranged in 3 parts. <https://docs.massive.org.au/M3/file-systems-on-M3.html>

- Your home directory (with **daylily backup** and limited storage < 10GB)
- Your project directory (with **daylily backup** and limited in space)
- Project scratch space (without backup )



The path?

* Your personal directory may be `cd \home\xxxx` . 
* Your project directory may be displayed in `cd ~`. 
  * `ls -al ~/` points to the project space and scratch you have been allocated. 



## Copying and downloading files to/from M3

**FileZilla** is a **FTP protocol** software. 

By the way, Linus Torvalds published his first version of Linux operating system via FTP in University of Helsinkiin (Finland university) in 1991.  He spent two years to finish it. 

* 每天可乐披萨、三明治
* 张亚勤、Linus 在最勤奋的时候都是每天去图书馆， 编程看书做题推论文。 吃三文治。。。



## Running jobs 

<https://docs.massive.org.au/M3/slurm/slurm-overview.html>

Three steps to run a job on M3: 

- Setup and launch
- Monitor progress
- Retrieve and analyse results

### Partition and Computer Configuration 

Check the computer configuration: <https://docs.massive.org.au/M3/m3users.html#compute>

and partition available <https://docs.massive.org.au/M3/slurm/check-cluster-status.html>

This will help you run your program in a correct location. 



### Job Submission Script 

How to submit a job ? <https://docs.massive.org.au/M3/slurm/simple-batch-jobs.html>

What if I want to use MPI for parallel computing ? <https://docs.massive.org.au/M3/slurm/mpi-jobs.html>

How about MP for parallel computing? <https://docs.massive.org.au/M3/slurm/multi-threaded-jobs.html>

In terms of interactive jobs in which your need to provide some inputs, <https://docs.massive.org.au/M3/slurm/interactive-jobs.html> 

Think about Machine learning, see how to use GPU <https://docs.massive.org.au/M3/slurm/gpu-jobs.html>

If you want to manage many similar jobs, consider <https://docs.massive.org.au/M3/slurm/array-jobs.html>

Quality of Service may give more priorities to your job, <https://docs.massive.org.au/M3/slurm/using-qos.html>

Want to use the same computer architecture? (M3 will distribute your jobs to different cluster arbitrarily, the same computer architecture is critical to programs which are sensitive to time ). <https://docs.massive.org.au/M3/slurm/using-constraints.html>

Want to see how is your job going? <https://docs.massive.org.au/M3/slurm/check-job-status.html>



## Reference 

* MonARCH Welcome Guidance by Philip Chan <https://ran.moe/shared/pdf/MonARCH-Welcomes-FIT3143-S2-2019.pdf>
* MASSIVE User Guide <https://docs.massive.org.au/index.html>

