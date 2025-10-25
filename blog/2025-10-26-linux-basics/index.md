---
title: What "Linux Operating System" do you use? (INCOMPLETE)
authors: [hirusha]
tags: [linux]
---

This post is to help you learn the basics of everything so you can see the full picture. If you have no idea what you're doing or if you're new to Linux, this post is for you. There are a billion different misconceptions, misunderstandings, and incorrect interpretations of concepts related to Linux, and in this post, we'll debunk them. I'm disappointed by the fact that nobody has written something like this before. There are plenty of YouTubers and content creators who post multiple videos a week, but none of them talk about this stuff. Absolutely pathetic! This guide will assume you're a Windows user. If you're a macOS user, you shouldn't have made it to my blog.

Note that I'll only be touching the surface of everything with very brief descriptions to keep things simple. The goal here is to help you see the full picture, not to master everything.

<!--truncate-->

At the very low level, you have your hardware. 

An operating system is not just one software. They consist of multiple major components. At the core is the kernel. This is what directly communicates with your hardware and exposes them through something called system calls (commonly referred to as "syscalls"). Every time a program needs to read a file, allocate memory, or send network data, it's the kernel that actually does it on behalf of that program.

Your "Windows 11 Operating System" uses Microsoft's proprietary Windows NT kernel, which you cannot legally or technically modify. In "Linux" systems, the kernel is Linux, created by Linus Torvalds. This is an open source project (licensed under GPLv2), meaning you can inspect its code, patch it, recompile it, and even redistribute own version.

On top of that, the kernel is what handles process scheduling, memory management, file systems, networking and all the other low level operating system related functions.

## Device Drivers

Just above the kernel sits device drivers. These are small programs that tell the kernel how to talk to your specific hardware, like graphic cards, wifi adapaters and what not. In Linux, many drivers are built directly into the kernel or distributed as loadable kernel modules (LKMs) that can be dynamically added or removed (sometimes at runtime, without requiring restarts). 

One commonly talked-about topic related to drivers in Linux is the graphics drivers for NVIDIA and AMD GPUs. If your GPU is AMD, the built-in drivers should have you covered.

Historically, AMD's Linux driver support wasn't always great. Years ago, AMD provided a closed-source driver called `fglrx`, which was often buggy and hard to maintain. Eventually, AMD realized that open collaboration with the Linux community was the best way to go. Therefore, they open-sourced large parts of their driver stack, and today the `AMDGPU` driver (maintained directly in the Linux kernel) and Mesa's open-source 3D stack deliver fantastic performance. As a result of this, if you own an AMD GPU, most modern distributions should support it out of the box without you having to install anything. It will just work!

If you have an NVIDIA GPU, your life gets a little complicated. You have two options:
1. The proprietary NVIDIA driver provided by NVIDIA themselves.
2. The Nouveau open-source driver, maintained by the Linux community.



If you just want to get on with life, you should consider using the proprietary driver over the open source one. If you have ethical/freedom-related reasons, use the open source driver. If you are new to linux and you want to use your hardware to the fullest potential, use the propriatry driver (like I do). The latest versions are very identical but the propriatary version still tends to perform better and will give you access to all the features of your GPU.

Nvidia has refused to make their driver open source multiple times. The situation with Nvidia and linux is too bad that Linus Trovalds himself said "Fuck You Nvidia". This video can be found [here](https://youtu.be/iYWzMvlj2RQ).




