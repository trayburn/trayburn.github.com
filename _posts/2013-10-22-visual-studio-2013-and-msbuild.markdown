---
layout: post
title: "Visual Studio 2013 and MSBuild"
date: 2013-10-22 22:01
comments: true
categories:
---
I am an incredible believer in the need for build automation on projects.  I believe that every developer should be commonly issueing a command, be that via `PSake` or `rake` or something else, which builds and tests the project outside the confines of Visual Studio.  As such, `MSBuild.exe` is incredibly important, as it is how you compile your SLN files.

## MSBuild.exe has moved...

In Visual Studio 2013, there is an amazingly important change that you must be aware of, or you will go insane trying to figure out what is going to.  Microsoft has moved MSBuild to another directory!  Now the reasons they've done this are all good, `MSBuild.exe` and the various compilers now are the responsibility of Visual Studio, not of the Framework itself.  As such, instead of being located in `C:\Windows\Microsoft.NET\Framework\v4.0.30319\MSBuild.exe` as you might normally expect on a 64-bit machine, it is instead located in `C:\Program Files (x86)\MSBuild\12.0\bin\amd64\msbuild.exe`.

## But it has also NOT moved...

Unfortunately, because of dependencies from Visual Studio 2012, the path `C:\Windows\Microsoft.NET\Framework\v4.0.30319\MSBuild.exe` also still has the executable.  And if you run VS2013 projects through that version of `MSBuild.exe` then you will get errors, usually about unable to find some kind of MSBuild `.targets` file.

Please be careful, and adjust your builds accordingly.
