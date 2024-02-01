---
layout: post
title: "Byte alignment of x86_64 Linux runtime stack"
date: 2022-04-15
tags: [cs, os]
---

[Byte alignment of x86_64 Linux runtime stack | Develop Paper](https://developpaper.com/byte-alignment-of-x86_64-linux-runtime-stack/)

[epc-14-haase-svenhendrik-alignmentinc-presentation.pdf (vi4io.org)](https://hps.vi4io.org/_media/teaching/wintersemester_2013_2014/epc-14-haase-svenhendrik-alignmentinc-presentation.pdf)

---

> x86_64 always uses **16 byte** in the stack aligment

Not sure about Windows... 

## Simple Calling 

A simple function 

```c
void hello(){
    float f = 3.14;
    float *fp = &f;
    int x = *(int *)fp; 
}
```

The assembly code. 

```assembly
	.section	__TEXT,__text,regular,pure_instructions
	.build_version macos, 12, 0	sdk_version 12, 3
	.section	__TEXT,__literal4,4byte_literals
	.p2align	2                           ## -- Begin function hello
LCPI0_0:
	.long	0x4048f5c3                      ## float 3.1400001
	.section	__TEXT,__text,regular,pure_instructions
	.globl	_hello
	.p2align	4, 0x90
_hello:                                 ## @hello
	.cfi_startproc
## %bb.0:
	pushq	%rbp
	.cfi_def_cfa_offset 16
	.cfi_offset %rbp, -16
	movq	%rsp, %rbp
	.cfi_def_cfa_register %rbp
	movss	LCPI0_0(%rip), %xmm0            ## xmm0 = mem[0],zero,zero,zero
	movss	%xmm0, -4(%rbp)
	leaq	-4(%rbp), %rax
	movq	%rax, -16(%rbp)
	movq	-16(%rbp), %rax
	movl	(%rax), %eax
	movl	%eax, -20(%rbp)
	popq	%rbp
	retq
	.cfi_endproc
                                        ## -- End function
.subsections_via_symbols
```

The function frame is known in the compile time. 

<img src="https://raw.githubusercontent.com/randoruf/photo-asset-repo/main/imgs/image-20220411105253840.png" alt="image-20220411105253840" style="zoom:50%;" />

> **Note**:
>
> -  X86_64 is little endian (think about how this will affect the starting address of an object)  
> -  The pointer type `*fp` must be **8 byte aligment!** 

## Nested Calling 

### Simple Nested Calling 

We will see how nested calling works (and why **frame pointer** is important). 

```cpp
void hello2(){
    int num = 0; 
}

void hello(){
    float f = 3.14;
    float *fp = &f;
    int x = *(int *)fp; 
    hello2(); 
}
```

```assembly
_hello2:                                ## @hello2
	.cfi_startproc
## %bb.0:
	pushq	%rbp
	movq	%rsp, %rbp
	movl	$0, -4(%rbp)
	popq	%rbp
	retq
                                        
_hello:                                 ## @hello
## %bb.0:
	pushq	%rbp
	movq	%rsp, %rbp
	subq	$32, %rsp
	movss	LCPI1_0(%rip), %xmm0            ## xmm0 = mem[0],zero,zero,zero
	movss	%xmm0, -4(%rbp)
	leaq	-4(%rbp), %rax
	movq	%rax, -16(%rbp)
	movq	-16(%rbp), %rax
	movl	(%rax), %eax
	movl	%eax, -20(%rbp)
	callq	_hello2
	addq	$32, %rsp
	popq	%rbp
	retq
```

![image-20220411112038375](https://raw.githubusercontent.com/randoruf/photo-asset-repo/main/imgs/image-20220411112038375.png)

We can see there are a lot of padding in the frame, this is to ensure the memory alignment. 

### Nested Calling with Parameters 
