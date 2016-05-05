---
layout: post
title: "Windows Phone 8 Development on a Mac"
date: 2012-12-11 07:02
comments: true
categories: mobile
---

So you want to do Windows Phone 8 development on a Mac, the traditional answer to this has been, your out of luck.  The hurdles are two fold:

* The Windows Phone Emulator has always, since Windows Phone 7, been run as a HyperV virtual machine.  This means if your running Windows itself inside a VM, running the emulator is like trying to run a VM inside a VM.  This has traditionally been an unsupported scenario.
* The Windows Phone 8 Emulator raised the bar again, because it only runs on Windows 8.  That causes two problems for us.  The first is that Boot Camp hasn't been updated to support Windows 8 yet, so we can't (easily) get the necessary drivers for our Mac to run Windows 8.
* The second problem that Windows 8 requirement brings us is that HyperV in Windows 8 requires ["Second Level Address Translation"][slat] support from it's CPUs.  That means the CPU its running on has to support very new virtualization support in order to run.  That will make it even more difficult for a VM solution to work for us.

But fear not my valiant friends, for there is an answer.  [VMWare Fusion][fusion] has heard your cries, and there is a way to solve this problem.  Here are the necessary steps, care of [an awesome MSDN forums post][op]:

1. Using [VMWare Fusion 5][fusion] or better, create and install a Windows 8 virtual machine.  If you have one already, your fine.
1. Stop the virtual machine by shutting down Windows 8.
1. At the VMWare Virtual Machine list, right click Windows 8 machine then click "Show in Finder".
1. Right click the file then click "Show package contents", then find and open with a text editor a file with the extension .vmx
1. Go till the end of the file and add this two lines (first check whether they were previously added):
    <pre>
    hypervisor.cpuid.v0 = "FALSE"
    vhv.enable = "TRUE"
    </pre>
1. At the VMWare Virtual Machine list, right click Windows 8, click "Preferences" then "Advanced". Choose "Intel VT-X with EPT" as "Preferred virtualization engine".
1. Start your virtual machine, launch Visual Studio, and develop away.  The emulator will happily run.

Obviously this solution is a "It works on my machine" situation, but I'm sure you will find success down this path.

## Update 12/12/12
Several questions were asked, so quickly:

* Does Parallels support this?  As of today, no.  [See this support forum post from them.][plls]
* Does your processor have to support SLAT?  Yes, your physical hardware must be current enough to support SLAT.  For Macs, this means you need to be running an i5 or i7 mac.
* What hardware are you running?  As of today, I'm running this solution on a Thunderbolt MacBook Pro running a 2.3 Ghz i7 and Lion, not Mountain Lion.  The official Model Identifier for my mac is MacBookPro8,3.


[slat]: http://www.ryanlowdermilk.com/2012/09/does-my-computer-support-slat/
[op]: http://social.msdn.microsoft.com/Forums/en-US/wptools/thread/ed72010c-321c-4667-97b2-3ff1540e7f87
[fusion]: http://www.vmware.com/products/fusion/overview.html
[plls]: http://forum.parallels.com/showthread.php?t=264780
