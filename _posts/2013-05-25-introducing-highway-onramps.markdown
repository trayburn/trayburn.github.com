---
layout: post
title: "Introducing Highway Onramps"
date: 2013-05-25 20:32
comments: true
categories: Highway
---
> Don't Repeat Yourself
> -- The Pragmatic Programmer

As part of our efforts in creating the [Highway Framework](https://github.com/highwayFramework), [Devlin](http://devlinliles.com/) and I have found that there is a related but not identical other problem we wanted to solve.  [Highway.Data](http://nuget.org/packages/Highway.Data/) serves as a library extension to [Entity Framework](http://nuget.org/packages/Highway.Data.EntityFramework/), and other [ORMs](http://nuget.org/packages?q=Highway.Data), but because its a library we didn't fill it with a lot of our actual opinions on how to create working solutions.  For instance, it isn't bound to just one IoC, or Logging framework, etc.

In our next endeavor, Highway Onramps, we intend to make it possible to quickly kickstart applications with the architecture you've decided on, and we'll show you how by letting you take our opinions.  As part of this Onramps project, we are introducing three different projects, and a bunch of [NuGet](http://nuget.org/) packages:

* [Highway.Onramp.MVC](http://nuget.org/packages/Highway.Onramp.MVC/) is our basic MVC solution, using MVC 4.  Installed into a new project, it will bring in Castle.Windsor and wire-up everything needed for Dependency Injection.
 * [Highway.Onramp.MVC.Logging](http://nuget.org/packages/Highway.Onramp.MVC.Logging/) adds Castle's Logging Facility support, and wires into unhandled application errors, and logs start and stop events.
 * [Highway.Onramp.MVC.Data](http://nuget.org/packages/Highway.Onramp.MVC.Data/) adds support for Highway.Data into the mix.  Registers it with IoC, etc.
 * [Highway.Onramp.MVC.All](http://nuget.org/packages/Highway.Onramp.MVC.All/) brings in all of the above.
* [Highway.Onramp.Services](http://nuget.org/packages/Highway.Onramp.Services/) builds on top of the amazing TopShelf project to kickstart a Windows Service from a simple Console application.
 * [Highway.Onramp.Services.Data](http://nuget.org/packages/Highway.Onramp.Services.Data/) adds in support for Highway.Data and registers it with a factory for proper lifetime management in a service.
* Finally we introduce the most important of them all, [Highway.Onramper](https://github.com/HighwayFramework/Highway.OnRamper).  This project enables you to quickly and easily create projects just like those above, and keep them up to date.

The packages for all of these are already uploaded to [NuGet.org](http://nuget.org/), so feel free to dig in, but over the next few days, we'll be posting exact details of how to use these packages.

If you'd like the all-day version of those posts, then come out to [Tulsa School of Dev](http://tulsaschoolofdev.com/) where [Devlin](http://devlinliles.com/) and I will be running a full track on codifying your architecture.
