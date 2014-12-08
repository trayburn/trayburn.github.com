---
layout: post
title: "PowerShell for Developers - Cmdlets"
date: 2013-05-08 22:38
comments: true
categories: PowerShell
---
## Cmdlets (Command-lets)

In PowerShell we have a concept called Cmdlets, these are the functions we use.  We've already seem some of them, but this chapter will introduce you to the must-know Cmdlets.  This is not a catalog of all Cmdlets, not even close.  As of PowerShell 3.0 there are 2,430 in Windows Server 2012, without adding those available from the community.

Microsoft's commitment is unfailing, they've committed to shipping PowerShell Cmdlets for every server product.  If you use SQL Server, Exchange, BizTalk, SharePoint or any of the other server products then you simply cannot do anything more powerful to pump up your career than to learn PowerShell.

### Proper Grammar

Cmdlets have a grammar all of their own.  In PowerShell we are encouraged to use a grammar of **Verb-Noun** when creating Cmdlets and functions.  But more than that, there is a list of common verbs, which help new users discover your functions.  For instance, I created a function to update the value of an `AppSetting` in a `web.config` or `app.config` file.  Now, I've not memorized the whole list of verbs, so how did I know which one to use?  Well, I used the Cmdlet called `Get-Verb` like so:

Hmm... I wonder if it should be called Create-AppSetting:
```
> Get-Verb C*

Verb                                                        Group
----                                                        -----
Clear                                                       Common
Close                                                       Common
Copy                                                        Common
Checkpoint                                                  Data
Compare                                                     Data
Compress                                                    Data
Convert                                                     Data
ConvertFrom                                                 Data
ConvertTo                                                   Data
Complete                                                    Lifecycle
Confirm                                                     Lifecycle
Connect                                                     Communications
```

Nope, no listing for Create.  How about Set-AppSetting:
```
> Get-Verb S*

Verb                                                        Group
----                                                        -----
Search                                                      Common
Select                                                      Common
Set                                                         Common
Show                                                        Common
Skip                                                        Common
Split                                                       Common
Step                                                        Common
Switch                                                      Common
Save                                                        Data
Sync                                                        Data
Start                                                       Lifecycle
Stop                                                        Lifecycle
Submit                                                      Lifecycle
Suspend                                                     Lifecycle
Send                                                        Communications
```

Alright, yep, that could work.  But I'm curious, how about Update-AppSetting?

```
> Get-Verb U*

Verb                                                        Group
----                                                        -----
Undo                                                        Common
Unlock                                                      Common
Unpublish                                                   Data
Update                                                      Data
Uninstall                                                   Lifecycle
Unregister                                                  Lifecycle
Unblock                                                     Security
Unprotect                                                   Security
Use                                                         Other
```

Bingo, Update-AppSetting is a good choice, so is Set-AppSetting.  I chose Set-AppSetting, but either would have been an excellent choice.

Likewise, if you were to look-up Delete:
```
> Get-Verb Delete
>
```
Nope, not there.  How about Erase?
```
> Get-Verb Delete
> Get-Verb Erase
>
```
Nope again.  How about Remove?
```
> Get-Verb Delete
> Get-Verb Erase
> Get-Verb Remove

Verb                                                        Group
----                                                        -----
Remove                                                      Common
```
There it is!  So remember, use Get-Verb when deciding how to name things, it will help everyone out in the long run.

### For-Each

So what is the most important Cmdlet in PowerShell?  Well, for sheer utility, I've got to give this award to ForEach-Object.  It allows you to iterate over any array or list of data.  So how do we use it?

```
> 1,2,3,4,5,6 | ForEach-Object { Write-Host $_ ($_ * $_) }
1 1
2 4
3 9
4 16
5 25
6 36
```

Alright, we've got one call to the script block (inside the `{ }`) for every member of the array.  Now, you might be thinking, "man that is really verbose for a scripting language", well good news that is the really long form version of that command.  Shall we terse it up a bit?

First, ForEach-Object has an alias (more on those later) in simply `%`.  So we can shorten it up like so:

```
> 1,2,3,4,5,6 |%{ Write-Host $_ ($_ * $_) }
1 1
2 4
3 9
4 16
5 25
6 36
```

Pretty good, but we can get even better.  We're explicitly calling Write-Host, but whatever is returned at the end of a command is automatically printed to the host.  So we can shorten it further like so:

```
> 1,2,3,4,5,6 |%{"$_ $($_ * $_)"}
1 1
2 4
3 9
4 16
5 25
6 36
```

Alright, I can hear you already, hold up Mr. Smarty Pants, you just did something tricky there.  Yep, I sure did.  How did that work?  Let me explain.  Any string in double-quotes (`" "`) will have any variables (`$foo`) inside of it replaced with the value of that variable.

Moreover, any script block returns the last object it creates by default, so since that script block creates a string, it returns that string.  And ForEach-Object collects those objects and returns them as an Array, here to console, but it could also be piped to yet another Cmdlet or function.  But, the really attentive among you will be saying, **"Wait!  You slipped in another $."** Your right, but lets see it without that extra $.

```
> 1,2,3,4,5,6 |%{"$_ ($_ * $_)"}
1 (1 * 1)
2 (2 * 2)
3 (3 * 3)
4 (4 * 4)
5 (5 * 5)
6 (6 * 6)
```

Ah, you see, this version doesn't actually perform the multiplication.  It replaces the $_ with each value, but the rest is just considered a string.  But PowerShell has a way to evaluate expressions in the middle of strings as well, using `$( expression )`.  So the extra $ in this `1,2,3,4,5,6 |%{"$_ $($_ * $_)"}` version evaluates the multiplication and gives us our "most terse form" of this command.

### Where-Object

So we've now seen how to iterate over an array, but the other thing we usually need to do is to filter them.  In .NET, we are used to using LINQ for this, but LINQ is pretty verbose itself.  How about we cut down our list of numbers to just the even numbers using `Where-Object`:

```
> 1,2,3,4,5,6| Where-Object { ($_ % 2) -eq 0 } |%{"$_ $($_ * $_)"}
2 4
4 16
6 36
```

Outstanding, but verbose.  Well just like with `For-Each` above, there is a much shorter alias for `Where-Object` which is `?`.  That shortens us up to:

```
> 1,2,3,4,5,6|?{ ($_ % 2) -eq 0 } |%{"$_ $($_ * $_)"}
2 4
4 16
6 36
```

#### A little diversion...

Now, we've seen how to limit the array, but here's a little diversion.  At the current time we're returning an array of strings.  Actually, since all arrays in PowerShell are arrays of Objects (in C# `Object[]`), this would be an array of objects consisting entirely of string objects.  Prove it?  Sure.  First the type of the array itself:

```
> (1,2,3,4,5,6|?{ ($_ % 2) -eq 0 } |%{"$_ $($_ * $_)"}).GetType()

IsPublic IsSerial Name                                     BaseType
-------- -------- ----                                     --------
True     True     Object[]                                 System.Array
```

And now the individual members:

```
> 1,2,3,4,5,6|?{ ($_ % 2) -eq 0 } |%{"$_ $($_ * $_)"} | %{ $_.GetType() }

IsPublic IsSerial Name                                     BaseType
-------- -------- ----                                     --------
True     True     String                                   System.Object
True     True     String                                   System.Object
True     True     String                                   System.Object
```

But what if I wanted to have access to each of those numbers (the number itself, and the square) at the end of the command.  One way to do this would be to create a `Hashtable` instead of a `String` like so:

```
> 1,2,3,4,5,6|?{ ($_ % 2) -eq 0 } |%{@{Num=$_;Square=$_ * $_}}

Name                           Value
----                           -----
Num                            2
Square                         4
Num                            4
Square                         16
Num                            6
Square                         36
```

Let's check the types:

```
> 1,2,3,4,5,6|?{ ($_ % 2) -eq 0 } |%{@{Num=$_;Square=$_ * $_}} | %{$_.GetType()}

IsPublic IsSerial Name                                     BaseType
-------- -------- ----                                     --------
True     True     Hashtable                                System.Object
True     True     Hashtable                                System.Object
True     True     Hashtable                                System.Object
```
Yep, Hashtables.

But sometimes have to name variable when you don't intend to use those names is a bit annoying a verbose.  So instead, we can create an array by simply using the `,@( )` array constructor syntax:

```
> $a = 1,2,3,4,5,6|?{ ($_ % 2) -eq 0 } |%{,@($_,($_ * $_))}
> $a
2
4
4
16
6
36
```
Uhm, output looks a little wierd.  Lets take a look at the type of `$a`:

```
> $a.GetType()

IsPublic IsSerial Name                                     BaseType
-------- -------- ----                                     --------
True     True     Object[]                                 System.Array
```

Ok, an array. And it's members?

```
> $a | %{ $_.GetType() }

IsPublic IsSerial Name                                     BaseType
-------- -------- ----                                     --------
True     True     Object[]                                 System.Array
True     True     Object[]                                 System.Array
True     True     Object[]                                 System.Array
```

Alright, more arrays!  And inside the first one of those?

```
> $a[0] | %{$_.GetType()}

IsPublic IsSerial Name                                     BaseType
-------- -------- ----                                     --------
True     True     Int32                                    System.ValueType
True     True     Int32                                    System.ValueType
```
Boom, `Int32`s for the win.  Instant multi-dimensional array.  This is powerful, it is a terse syntax which is similar to Tuples in other languages.  Because they are `Object[]` arrays, the types don't have to match.  Oh yeah, did I mention there is a short form for creating arrays of concurrent integers?  Ohm, my bad. For instance:

```
> $a = 1..6|?{ ($_ % 2) -eq 0 } |%{,@($_,($_ * $_),"Smile")}
> $a.GetType()

IsPublic IsSerial Name                                     BaseType
-------- -------- ----                                     --------
True     True     Object[]                                 System.Array


> $a | %{ $_.GetType() }

IsPublic IsSerial Name                                     BaseType
-------- -------- ----                                     --------
True     True     Object[]                                 System.Array
True     True     Object[]                                 System.Array
True     True     Object[]                                 System.Array


> $a[0] | %{$_.GetType()}

IsPublic IsSerial Name                                     BaseType
-------- -------- ----                                     --------
True     True     Int32                                    System.ValueType
True     True     Int32                                    System.ValueType
True     True     String                                   System.Object
```

### Get-ChildItem

The last Cmdlet I want to introduce in this chapter is the one most people use without even knowing that they're doing so.  If you've every opened a PowerShell command prompt, you've likely done something like:

```
> dir


    Directory: C:\Source\Highway


Mode                LastWriteTime     Length Name
----                -------------     ------ ----
d----          5/2/2013   2:20 PM            Data
d----          5/4/2013  10:44 PM            MVC
d----          5/4/2013   6:37 PM            Onramper
d----          5/4/2013   6:46 PM            Services
-a---          5/4/2013  11:59 AM       1062 dest
-a---          5/4/2013  12:11 PM        385 distribute.ps1
```
Or perhaps if you're from the `bash` or other `sh` descendant family of shell users:

```
> ls


    Directory: C:\Source\Highway


Mode                LastWriteTime     Length Name
----                -------------     ------ ----
d----          5/2/2013   2:20 PM            Data
d----          5/4/2013  10:44 PM            MVC
d----          5/4/2013   6:37 PM            Onramper
d----          5/4/2013   6:46 PM            Services
-a---          5/4/2013  11:59 AM       1062 dest
-a---          5/4/2013  12:11 PM        385 distribute.ps1
```

Now, in reality you're using a Cmdlet called Get-ChildItem.  Prove it?  Sure:

```
> Get-ChildItem


    Directory: C:\Source\Highway


Mode                LastWriteTime     Length Name
----                -------------     ------ ----
d----          5/2/2013   2:20 PM            Data
d----          5/4/2013  10:44 PM            MVC
d----          5/4/2013   6:37 PM            Onramper
d----          5/4/2013   6:46 PM            Services
-a---          5/4/2013  11:59 AM       1062 dest
-a---          5/4/2013  12:11 PM        385 distribute.ps1
```

Now this Cmdlet has so much power it almost deserves a chapter to itself.  Let's review just a few things that can't be skipped over.  First, this Cmdlet returns an array of `FileSystemInfo` objects.  Of course that's easy to prove:

```
> ls |%{$_.GetType()}

IsPublic IsSerial Name                                     BaseType
-------- -------- ----                                     --------
True     True     DirectoryInfo                            System.IO.FileSystemInfo
True     True     DirectoryInfo                            System.IO.FileSystemInfo
True     True     DirectoryInfo                            System.IO.FileSystemInfo
True     True     DirectoryInfo                            System.IO.FileSystemInfo
True     True     FileInfo                                 System.IO.FileSystemInfo
True     True     FileInfo                                 System.IO.FileSystemInfo
```

That means we have access to all sorts of data about those directory items by pipeing that command along.  For instance, what if I wanted the full path and filename?

```
> ls |%{$_.FullName}
C:\Source\Highway\Data
C:\Source\Highway\MVC
C:\Source\Highway\Onramper
C:\Source\Highway\Services
C:\Source\Highway\dest
C:\Source\Highway\distribute.ps1
```

And if I wanted to get just the files?

```
> ls -File |%{$_.FullName}
C:\Source\Highway\dest
C:\Source\Highway\distribute.ps1
```

And if I wanted their sizes instead?

```
> ls -File |%{$_.Length}
1062
385
```

#### Another bonus section? Oh, ok...

We can restrict the types of files to a pattern like so:

```
> ls -File *.ps1 |%{$_.Length}
385
```

What if I wanted that same thing, recursively, through every subdirectory of my current location?

```
> ls -File *.ps1 -Recurse|%{$_.Length}
10275
10424
4001
1332
1546
2987
332
188
2997
344
194
211
62
332
0
0
0
0
247
243
368
247
243
0
0
0
0
880
265
265
217
62
332
385
```

And ... if I wanted all those summed up?

```
> ls -File *.ps1 -Recurse|%{$_.Length}|Measure-Object -Sum


Count    : 34
Average  :
Sum      : 38979
Maximum  :
Minimum  :
Property :
```

### Aliases

> There are a finite number of keystrokes left in your hands before you die. -- [Scott Hanselman](http://www.hanselman.com/blog/DoTheyDeserveTheGiftOfYourKeystrokes.aspx)

So, you've likely picked up by now that I'm a fan of terse commands.  Terse commands allow you to move faster, which to me is a huge part of why I'm investing in PowerShell.  There is an ability in PowerShell to create shorter versions of Cmdlets, as you've seen already in this article, called Aliases.  There are alot of aliases already defined.  How many?  So many I can't just do a screen shot of them, but I can count them:

```
> alias | Measure-Object


Count    : 150
Average  :
Sum      :
Maximum  :
Minimum  :
Property :
```

150 aliases already defined for you.  If you want to see what command is behind something like `dir` you can simply:

```
> alias dir

CommandType     Name                                               ModuleName
-----------     ----                                               ----------
Alias           dir -> Get-ChildItem
```

As you can see, `dir` is `Get-ChildItem`.  What if I wanted to see all aliases for a given Cmdlet?

```
> alias -Definition Get-ChildItem

CommandType     Name                                               ModuleName
-----------     ----                                               ----------
Alias           dir -> Get-ChildItem
Alias           gci -> Get-ChildItem
Alias           ls -> Get-ChildItem
```

Now, aliases are something you can expand on!  You can make it super easy to open text files by aliases `notepad.exe` as so:

```
> New-Alias n C:\Windows\system32\notepad.exe
> n .\distribute.ps1
```

That opens Notepad, with the `distribute.ps1` file already opened for editing.  I keep aliases around for a lot of things.  For my text editor, my text comparison tool, and so much more.
