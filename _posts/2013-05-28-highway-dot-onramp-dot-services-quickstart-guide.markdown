---
layout: post
title: "Highway.Onramp.Services Quickstart Guide"
date: 2013-05-28 06:43
comments: true
categories: Highway
---

Highway.Onramp.Services is part of the [Onramp series of NuGet packages](http://timrayburn.net/blog/introducing-highway-onramps/) which all focus on providing you robust starting solutions for common team needs.  They let you skip over all that required plumbing friction, and jump straight into writing code which produces real business value.

Now, we can't do that without making some very important decisions for you.  That's why as part of this we've also produced Highway Onramper, which lets you create your own version of these Onramps with your own technology decisions made.  For this post we're just introducing our version, and in a future post we'll teach you how to make an Onramp of your own.

## 1, 2, 3 Running Service

So let's create a Windows Service, that we can actually debug, and install/uninstall, shall we?  

- Start Visual Studio and create a Console Application in C#.  When you're done, the Program.cs should look like the default:

``` 
    class Program
    {
        static void Main(string[] args)
        {
        }
    }
```

- Open the Package Manager Console, and type:

```
PM> Install-Package Highway.Onramp.Services
```


- Note: You will be prompted for permission to overwrite your Program.cs, go ahead and give permission, after all there is no useful code in that class yet.

```
File Conflict
File 'Program.cs' already exists in project 'ConsoleApplication4'. Do you want to overwrite it?
[Y] Yes  [A] Yes to All  [N] No  [L] No to All  [?] Help (default is "N"):Y
Overwrite existing file 'Program.cs'.
Successfully added 'Highway.Onramp.Services 2.0.4.0' to ConsoleApplication4.
```

- Press F5 and run your new, fully functional, Windows Service.

```
INFO> Configuration Result:
[Success] Name MyService
[Success] DisplayName My Services Long Description
[Success] Description My Services Long Description
[Success] ServiceName MyService
INFO> Topshelf v3.1.107.0, .NET Framework v4.0.30319.18046
INFO> The MyService service is now running, press Control+C to exit.
INFO> Tick Tock goes the clock
INFO> Tick Tock goes the clock
INFO> Tick Tock goes the clock
INFO> Tick Tock goes the clock
```

That's it, your service is up and running, and can be debugged.  But what decisions did we just make for you?

## Straight to Value

So before we explain how this all works, if you just want to get down to coding, then have at it.  The file you want to modify is `Services.cs` and you can change everything about that class you want to **EXCEPT** that it implements the `IHostedService` interface.  That is how our framework code tells your code when to Start and Stop.

As you can see, the default we've provided uses a simple Timer to write to the console.  But you can wire in anything you want at this point.

## The Architecture

### TopShelf

First and foremost, your new service uses the amazing [TopShelf project](http://topshelf-project.com/) to turn a simple Console application into a Windows Service.  I encourage you to go and learn more about this project, but the fundamentals are the following:

- Install the service:

```
<YourConsoleExecutable>.exe install
```

- Uninstall the service:

```
<YourConsoleExecutable>.exe uninstall
```

### Castle.Windsor

We are big believers in Dependency Injection, and so we've included [Castle.Windsor as an Inversion of Control container](http://www.castleproject.org/).  But more than that, we've already setup a the container for the basics for you.  If you go to the new `Installers` directory in your project, you will see three classes.  All of these inherit from `IWindsorInstaller` and are invoked when the service starts to configure your container.

### NLog & Castle Logging Facility

We've implemented the Castle Logging Facility, which is an abstraction over the top of any logger, and then wired that up to [NLog](http://nlog-project.org/).  There is an `NLog.config` file, and it is already setup to log to a file, and the console, and the debugger at various levels of messages.

By default the console only receives `Info` level or higher, but the debugger will receive everything.

### Dictionary Adapter

Also from Castle.Core, we've used Dictionary Adapter to provide a testable abstraction over App Settings.  This is setup in the `CastleInstaller.cs`, with the following lines of code:

```
// Our configuration magic, register all interfaces ending in Config from
// this assembly, and create implementations using DictionaryAdapter
// from the AppSettings in our app.config.
var daf = new DictionaryAdapterFactory();
container.Register(
    Types
        .FromThisAssembly()
        .Where(type => type.IsInterface && type.Name.EndsWith("Config"))
        .Configure(
            reg => reg.UsingFactoryMethod(
                (k, m, c) => daf.GetAdapter(m.Implementation, ConfigurationManager.AppSettings)
                )
        ));
```

This tells Castle to register all **Types from the current assembly** which are **Interfaces** and which have a **name that ends with "Config"**.  It then says that when such an interface is resolved, it will use the DictionaryAdapterFactory to create an instance of this interface for you, backed by the AppSettings of your project.  Now, you're probably not familiar with DictionaryAdapter, but if you'd like to learn more I'd suggest my two [blog](http://timrayburn.net/blog/dictionaryadapter-is-love-part-1/) [posts](http://timrayburn.net/blog/dictionaryadapter-is-love-part-2/) of the subject.

We've included an interface example in the `Config` folder to show you how this might work:

```
[KeyPrefix("Service.")]
public interface IServiceConfig
{
    string LongName { get; set; }
    string ShortName { get; set; }
}
```

If you take this interface as a dependency, you can invoke the LongName, or ShortName, properties and you will receive the values from your `app.config`:

```
<appSettings>
	<add key="Service.LongName" value="My Services Long Description" />
	<add key="Service.ShortName" value="MyService" />
</appSettings>
```