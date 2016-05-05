---
layout: post
title: "PowerShell for Developers - DRY"
date: 2013-05-12 21:06
comments: true
categories: PowerShell
---

DRY is an acronym that was created by [Andrew Hunt and Dave Thomas in their book The Pragmatic Programmer](http://www.amazon.com/gp/product/020161622X/ref=as_li_qf_sp_asin_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=020161622X&linkCode=as2&tag=timraybnet-20).  It stands for Don't Repeat Yourself.  We've espoused terse commands in all the previous chapters, but how to I avoid having to re-invent the wheel every time I open a PowerShell prompt.

## Profiles

There is a script which runs every time you open a PowerShell prompt, it's called your Profile.  The file name varies depending on your operating system and version, but you can find it quickly by opening a prompt and typing `$profile` like so:

```
> $profile
C:\Users\Tim\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1
```

Now if you've got a brand new environment, this file may not even exist.  You can test if it does, and then create it if it does not with the following commands:

```
> Test-Path $PROFILE
False
> New-Item -path $profile -type file -force


    Directory: C:\Users\Tim\Documents\WindowsPowerShell


Mode                LastWriteTime     Length Name
----                -------------     ------ ----
-a---         5/12/2013   6:09 PM          0 Microsoft.PowerShell_profile.ps1


> notepad $PROFILE
```
The first command ensures that the you don't already have a profile.  If it returns true, the skip the second command.

The second command created the profile, as a file, and uses -force to create any directories required to create the item along the way.  This command will work even if you don't have a `WindowsPowershell` directory in your `Documents` folder.

### What do I put in a $PROFILE?

Things you don't want to type over and over again, of course.  Don't Repeat Yourself (DRY).  Now, in reality you don't want your profile to become just a giant function library, we have a concept called Modules for that, which we will discuss in just a minute, but there are some things which belong in your $PROFILE.

#### The Prompt
There is a special function called `Prompt` which you can define, that controls how what your command prompt looks like.  You may have noticed that during this article I've had a very basic prompt that was just `> `, but most of you likely have a prompt that looks more like this `PS C:\Source>`.  There is no trickery, I just wanted to make my prompt minimalist for these articles, so I typed the following:

```
PS C:\Source> function prompt { "> " }
>
```

As you can see, instantly my prompt was set to the minimalist version you've seen in all these articles.  How is the default prompt defined?  Let's see, shall we?

```
PS C:\Source> (get-item Function:\prompt).Definition
"PS $($executionContext.SessionState.Path.CurrentLocation)$('>' * ($nestedPromptLevel + 1)) "
# .Link
# http://go.microsoft.com/fwlink/?LinkID=225750
# .ExternalHelp System.Management.Automation.dll-help.xml
```

So this prompt is defined as `PS` followed by the expression `$executionContext.SessionState.Path.CurrentLocation` which gets the current location of the execution context (aka the directory you're in).  Then, it displays one `>` for every level of `$nestedPromptLevel`, adding one.  Well if your like most people, you've likely got no idea what the heck `$nestedPromptLevel` is.  We will discuss it further, but for the most basic idea, there is a command called `$Host.EnterNestedPrompt()` which creates a new prompt.  Like so:

```
PS C:\Source> $host.EnterNestedPrompt()
PS C:\Source>> $host.EnterNestedPrompt()
PS C:\Source>>> $host.EnterNestedPrompt()
PS C:\Source>>>> exit
PS C:\Source>>> exit
PS C:\Source>> exit
PS C:\Source>
```

As you can see, each nested level of prompt adds a `>`, which makes perfect sense given the above `prompt` function definition.

## Location

Your current working directory is on display in the prompt at all times, and you know if you want to change that directory, you use `cd`.  It must be named `cd`, both DOS and LINUX agree on this, how could it possibly be named something else, right?

```
PS C:\Source> cd Highway
PS C:\Source\Highway> alias cd

CommandType     Name                                               ModuleName
-----------     ----                                               ----------
Alias           cd -> Set-Location
```

Well, as you can see, in PowerShell, which `cd` is an alias that exists by default for it, the actual command you're execution is `Set-Location`.  Well, most programs would rightly assume that whatever you can `Set-` you can also `Get-`, right?

```
PS C:\Source\Highway> Get-Location

Path
----
C:\Source\Highway


PS C:\Source\Highway> alias -Definition Get-Location

CommandType     Name                                               ModuleName
-----------     ----                                               ----------
Alias           gl -> Get-Location
Alias           pwd -> Get-Location
```

Yup, Get-Location returns the current `Path` we are at.  You can see that we have two aliases defined by default for us, one is just shorthand for Get-Item, and the other is a helper alias for our Linux friends, who use `pwd` (short for Print Working Directory) to accomplish this same task.

### Time to get pushy

Now, as it happens, in PowerShell (and Linux, and DOS) there are a couple of commands for working with Location that most people didn't learn when they were first struggling through how to work at a command prompt.  These two commands are called `pushd` and `popd` in Linux and DOS, but in PowerShell those are, of course, just aliases:

```
PS C:\Source> alias pushd

CommandType     Name                                               ModuleName
-----------     ----                                               ----------
Alias           pushd -> Push-Location


PS C:\Source> alias popd

CommandType     Name                                               ModuleName
-----------     ----                                               ----------
Alias           popd -> Pop-Location
```

So `Push-Location` and `Pop-Location` are commands that let you quickly leave your current location, but then return there very quickly.  Let me demonstrate:

```
PS C:\Source> pushd 'C:\Windows\Microsoft.NET\Framework\v4.0.30319'
PS C:\Windows\Microsoft.NET\Framework\v4.0.30319> pushd 'C:\Program Files'
PS C:\Program Files> pushd 'C:\Program Files (x86)'
PS C:\Program Files (x86)> pushd 'C:\Users\Tim\Documents\WindowsPowerShell'
PS C:\Users\Tim\Documents\WindowsPowerShell> popd
PS C:\Program Files (x86)> popd
PS C:\Program Files> popd
PS C:\Windows\Microsoft.NET\Framework\v4.0.30319> popd
PS C:\Source> popd
PS C:\Source> popd
PS C:\Source>
```
So initially, `pushd` would appear to just be a longer version of `cd`, it moves our current working directory to whichever directory we name.  But, when we then invoke `popd` the magical nature becomes clear.  When we invoke `pushd` it changes our directory, but puts the directory we're leaving on a stack of remembered directories.  [A stack, hence push and pop.](http://en.wikipedia.org/wiki/Stack_%28abstract_data_type%29)

As we pop the locations back off the stack, we are transported back to that location as our current working directory.  Pretty darn useful if you need to move from one path to another and back very quickly.

### PSDrive

Now, Location is all well and good, but that described where you are a given drive.  My default drive, and likely yours, is `C:` aka the C-Drive.  From time immemorial this has been the default hard drive letter in Windows. `A:` and `B:` were reserved for Floppy drives.  Hard drives started at the letter C and incremented from there.  But, that has been simply default for a long time now.

In PowerShell, I can still use `C:` and `D:` to move between drives.  This next set of commands will only work if you have two drives (or an SSD and a [Flash card](http://www.amazon.com/gp/product/B00AK31M3G/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B00AK31M3G&linkCode=as2&tag=timraybnet-20) as I'm using on my [Microsoft Surface Pro](http://www.amazon.com/gp/product/B00BE5T2TA/ref=as_li_qf_sp_asin_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B00BE5T2TA&linkCode=as2&tag=timraybnet-20)):

```
PS C:\Source> d:
PS D:\> dir


    Directory: D:\


Mode                LastWriteTime     Length Name
----                -------------     ------ ----
d----         5/11/2013   2:17 PM            iTunes
d----         5/11/2013   2:27 PM            iTunes Library


PS D:\> c:
PS C:\Source> dir


    Directory: C:\Source


Mode                LastWriteTime     Length Name
----                -------------     ------ ----
d----          5/7/2013   1:57 PM            Blog
d----          5/9/2013   7:06 PM            Highway
d----         5/11/2013   4:17 PM            Node
d----          5/5/2013   5:13 PM            PowerShell
d----         4/11/2013  11:58 PM            Presentation-EasyESB
d----         5/10/2013   7:55 PM            RrynVsPS
d----         4/20/2013   1:53 PM            SynTask
```

As you can see, the commands move me between those two drives.  But in reality, the concept of a *drive* has been much expanded in PowerShell.

> If it has hierarchy (aka Locations) you want to Navigate, or items you want to inspect, then in PowerShell someone will likely have made it a drive.

There is a command in PowerShell that lists all current drives:

```
PS C:\Source> Get-PSDrive

Name           Used (GB)     Free (GB) Provider      Root                                               CurrentLocation
----           ---------     --------- --------      ----                                               ---------------
Alias                                  Alias
C                  78.10         32.42 FileSystem    C:\                                                         Source
Cert                                   Certificate   \
D                   3.29         56.16 FileSystem    D:\
E                                      FileSystem    E:\
Env                                    Environment
Function                               Function
HKCU                                   Registry      HKEY_CURRENT_USER
HKLM                                   Registry      HKEY_LOCAL_MACHINE
Variable                               Variable
WSMan                                  WSMan
```

**blink** **blink** ... Ok, so that is more drives than I was expecting when I first invoked this command.  So what all drives are those, and how do I use them?

Enter `Set-Location`, aka `cd`:

```
PS C:\Source> cd alias:
PS Alias:\> ls | select -first 5

CommandType     Name                                               ModuleName
-----------     ----                                               ----------
Alias           % -> ForEach-Object
Alias           ? -> Where-Object
Alias           ac -> Add-Content
Alias           asnp -> Add-PSSnapin
Alias           cat -> Get-Content
```

Here I've `Set-Location` to the Alias drive, and listed the first 5 items.  Each PSDrive has different contents depending on what it is representing.  Here's a sum-up of the contents of the **default** set of drives:

- C, D and E drive are File System drives, representing your various mounted drives.  In my case they are my SSD, Flash card, and virtual CD drive.
- Cert represents your digital certificate store, both CurrentUser and LocalMachine, which are the two root locations.

```
PS Alias:\> cd Cert:
PS Cert:\> ls | select -first 5


Location   : CurrentUser
StoreNames : {SmartCardRoot, Root, Trust, AuthRoot...}

Location   : LocalMachine
StoreNames : {TrustedPublisher, ClientAuthIssuer, Remote Desktop, Root...}
```
- Env represents your Environment Variables, which contains all defined environment variables for your machine.

```
PS Cert:\> cd env:
PS Env:\> ls | select -first 5

Name                           Value
----                           -----
ALLUSERSPROFILE                C:\ProgramData
APPDATA                        C:\Users\Tim\AppData\Roaming
asl.log                        Destination=file
ChocolateyInstall              C:\Chocolatey
CommonProgramFiles             C:\Program Files\Common Files
```
- Function represents all functions defined in PowerShell, and in fact is how I showed you the definition of `prompt` earlier in this chapter (go ahead, look back, I don't mind)
- HKCU and HKLM represent your register, and specifically the **HKEY_CURRENT_USER** and **HKEY_LOCAL_MACHINE** sections of it.  For instance, want to know all versions of the .NET Framework 4.0 installed on your box?

```
PS Env:\> ls HKLM:\SOFTWARE\Microsoft\.NETFramework\v4.0.30319\SKUs | %{$_.Name}
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\.NETFramework\v4.0.30319\SKUs\.NETFramework,Version=v4.0
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\.NETFramework\v4.0.30319\SKUs\.NETFramework,Version=v4.0,Profile=Client
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\.NETFramework\v4.0.30319\SKUs\.NETFramework,Version=v4.0.1
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\.NETFramework\v4.0.30319\SKUs\.NETFramework,Version=v4.0.1,Profile=Client
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\.NETFramework\v4.0.30319\SKUs\.NETFramework,Version=v4.0.2
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\.NETFramework\v4.0.30319\SKUs\.NETFramework,Version=v4.0.2,Profile=Client
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\.NETFramework\v4.0.30319\SKUs\.NETFramework,Version=v4.0.3
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\.NETFramework\v4.0.30319\SKUs\.NETFramework,Version=v4.0.3,Profile=Client
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\.NETFramework\v4.0.30319\SKUs\.NETFramework,Version=v4.5
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\.NETFramework\v4.0.30319\SKUs\Client
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\.NETFramework\v4.0.30319\SKUs\Default
```

- Variable represents all current variables defined in your scope.

```
PS Env:\> ls Variable:\ | select -first 3

Name                           Value
----                           -----
$                              Get-PSDrive
?                              True
^                              Get-PSDrive
```
- WSMan represents the "Windows Remote Management" aka WinRM settings.

Moreover, these are just the beginning.  Lots of modules, which we are about to discuss, create even more drives.  With the right modules you can browse around Active Directory, SQL Servers, IIS Websites, and so much more.

## Modules Basics

Modules are a way to expand your available functions, drives, etc in PowerShell, but in an optional manner.  Any given PowerShell environment can load many different Modules, in and adhoc manner.  You can get a list of the current Modules you're running as so:

``` 
> Get-Module

ModuleType Name                                ExportedCommands
---------- ----                                ----------------
Manifest   Microsoft.PowerShell.Management     {Add-Computer, Add-Content, Checkpoint-Computer, Clear-Content...}
Manifest   Microsoft.PowerShell.Security       {ConvertFrom-SecureString, ConvertTo-SecureString, Get-Acl, Get-Authe...
Manifest   Microsoft.PowerShell.Utility        {Add-Member, Add-Type, Clear-Variable, Compare-Object...}
Manifest   Microsoft.WSMan.Management          {Connect-WSMan, Disable-WSManCredSSP, Disconnect-WSMan, Enable-WSManC...
Manifest   pki                                 {Add-CertificateEnrollmentPolicyServer, Export-Certificate, Export-Pf...
```

As you can see, I have four modules loaded at the current time.  But those are just what I have loaded.  What I have available to me is quite another thing.  If you type `Get-Module -ListAvailable` it will show you all of your possible options, but that output is large.  I'm going to limit it somewhat here:

```
> Get-Module -ListAvailable | select -first 10


    Directory: C:\Users\Tim\Documents\WindowsPowerShell\Modules


ModuleType Name                                ExportedCommands
---------- ----                                ----------------
Script     EZOut                               {Add-FormatData, Clear-FormatData, Out-FormatData, Remove-FormatData...}
Script     IsePackV2                           {Add-PowerGUIMenu, Add-IseMenu, Add-Icicle, Clear-Icicle...}
Script     Pester                              {Assert-MockCalled, Assert-VerifiableMocks, Context, Describe...}
Script     Pipeworks                           {Get-FunctionFromScript, Write-PowerShellHashtable, Import-PSData, Ex...
Script     psake                               {Assert, Exec, FormatTaskName, Framework...}
Script     PsGet                               {Get-PsGetModuleHash, Get-PsGetModuleInfo, Install-Module, Update-Mod...
Script     ScriptCop                           {Get-ScriptCopRule, Register-ScriptCopRule, Unregister-ScriptCopRule,...
Script     Send-Growl                          {Get-GrowlPath, Register-GrowlCallback, Register-GrowlType, Send-Grow...
Script     ShowUI                              {Add-CodeGenerationRule, Add-UIModule, Select-UIType, Get-AssemblyNam...
Script     TRayburn-Utils                      {New-BasicAuth, Set-AppSetting, Set-NuSpecVersion, Test-Item}
```

As you can see, I have a number of Modules installed, and they are installed by in the `WindowsPowerShell\Modules` folder of my Documents folder.  But as I said, there are alot of them:

```
> Get-Module -ListAvailable | measure


Count    : 62
Average  :
Sum      :
Maximum  :
Minimum  :
Property :
```

62 in fact, on my box alone, and it isn't part of a domain, or a server, or one of many other things which might add to that list.

### Creating your own modules

You can create your own modules very simply.  A module is just a PowerShell script, named `.psm1` instead of simply `.ps1` and which loads up a series of functions, cmdlets, aliases, etc.  The big additional requirement is that the script must also declare what it intends to make available to those who `Import` that module.  Simply defining a function in a script isn't enough, you must also `Export` that function to those who use the module.  This is done with the Cmdlet `Export-ModuleMember`.

I'm not going to go into details here about how to create a PowerShell module, there is alot of information out there on that already.  If you'd like to see the source of one, check out either [my PowerShell repository](https://github.com/trayburn/powershell), or [the repository for Pester](https://github.com/pester/pester).

To use a module you have installed, simply type:

```
> Import-Module <name>
```

### Must-Have Modules

The community of developers and administrators in the world being the wonderful geeks that they are, there are many awesome Modules that have been made available for others to consume.  While it saddens me to report that there is not one consolidated repository, like NuGet for references, there are several good places.  Both [NuGet](http://nuget.org) and [Chocolatey](http://chocolatey.org) have PowerShell modules hiding in their directories, but in my opinion the best overall implementation for PowerShell is [PsGet.net](http://psget.net).

### PsGet

PsGet is the module that drives access to the PsGet.net directory of modules.  To get started with it, simply type:

```
(new-object Net.WebClient).DownloadString("http://psget.net/GetPsGet.ps1") | iex
```

This will download and install the PsGet module.  Once it's installed, go ahead and import that module:

```
> Import-Module PsGet
```

You now have two powerful commands are your disposal:
- Install-Module
- Update-Module

With these, you can install any module from the PsGet.net directory with just one command.

### Pester

I'm a big fan of TDD/BDD and so I was sold the moment Pester was described to me as a BDD framework for PowerShell.  It allows me to test my modules with the familiar Describe, Context, It syntax.  This module was created by the awesome [Scott Muc](http://about.me/scottmuc/) and I've used it in my own PowerShell work.  Details on how to use it can be found at the [GitHub wiki](https://github.com/pester/pester/wiki) for the project, and [on Scott's blog](http://scottmuc.com/powershell-pester-2-and-1-dot-2-released/).

```
> Install-Module Pester
> Import-Module Pester
```

### PowerShell Community Extensions

So what happens when lots of people love PowerShell and start putting together their greatest hits functions and CmdLets?  PowerShell Community Extensions (PSCX) or course!  Think of this as a -contrib project for PowerShell.  It has functions that do all sorts of things, from awesome, to cute.  How many commands?  148 as of this writing.  Everything from `Out-Speech` which voice outputs any piped content, to quick helpers like `Set-ReadOnly` and `Set-Writeable`.

```
> Install-Module PSCX
> Import-Module PSCX
```
