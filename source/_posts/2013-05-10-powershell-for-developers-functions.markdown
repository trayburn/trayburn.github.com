---
layout: post
title: "PowerShell for Developers - Functions"
date: 2013-05-10 00:24
comments: true
categories: PowerShell
---
## Pipeline

We've been using it already quite a bit in the past chapters, but lets take a moment and introduce, properly, the pipeline.  Pipeline'ing is powered in PowerShell using the pipe operator `|`.  It passes data from one command, to another command.  That other command had better be able to use that data.  How?  Well there is not magic here, there is conventions instead.

Let's take a look at the help for our friend `Get-Item`, we do that as by typing `help Get-Item` or in our case `help Get-Item -Parameter Path` which is asking for the help for the Path parameter specifically:

```
> help get-item -Parameter Path

-Path <String[]>
    Specifies the path to an item. Get-Item gets the item at the specified location. Wildcards are permitted. This
    parameter is required, but the parameter name ("Path") is optional.

    Use a dot (.) to specify the current location. Use the wildcard character (*) to specify all the items in the
    current location.

    Required?                    true
    Position?                    1
    Default value
    Accept pipeline input?       true (ByValue, ByPropertyName)
    Accept wildcard characters?  true
```

Did you not get this?  You likely need to install the help, run `Update-Help` and it will do so.  If you did get this, you'll see the line that talks about `Accept Pipeline Input?` and that it states `true` but more importantly that we can pass either **ByValue** or **ByPropertyName**.  Let us explore both of those for a moment.

### By Value Pipeline'ing

ByValue pipelines are the easiest to understand, in this case we can see from the help above we, the value for Path is expected to a `String[]` (a string array).

```
> dir | %{ $_.FullName }
C:\source\Highway\MVC\build
C:\source\Highway\MVC\src
C:\source\Highway\MVC\.gitignore
C:\source\Highway\MVC\license.txt
C:\source\Highway\MVC\make.ps1
C:\source\Highway\MVC\NDesk.Options.dll
C:\source\Highway\MVC\OnRamper.exe
C:\source\Highway\MVC\push.ps1
C:\source\Highway\MVC\README.markdown
C:\source\Highway\MVC\setv.ps1
```
So here we have taken a directory listing, which is objects as we have learned previously, and then done a `ForEach-Object` on that to select just the FullName property.  FullName is a string, and so we are sending an array of strings out to the console currently.  How, lets send that same data to Get-Item:

```
> dir | %{ $_.FullName } | Get-Item


    Directory: C:\source\Highway\MVC


Mode                LastWriteTime     Length Name
----                -------------     ------ ----
d----          5/4/2013  10:44 PM            build
d----          5/2/2013   8:37 PM            src
-a---          5/2/2013   2:19 PM        259 .gitignore
-a---          5/2/2013   2:19 PM      16896 license.txt
-a---          5/4/2013  11:11 AM        211 make.ps1
-a---          5/2/2013  11:46 PM      22016 NDesk.Options.dll
-a---          5/4/2013   6:36 PM      15872 OnRamper.exe
-a---          5/4/2013  12:16 PM         62 push.ps1
-a---          5/2/2013   2:19 PM      17183 README.markdown
-a---          5/4/2013  11:26 AM        332 setv.ps1
```
Wait ... uhm ... what?  Sure, we just took a bunch of FileSystemInfo objects and dumped them to the console, you know how that formats them?  As a directory listing of course.  But that means we've been successful in binding that data to Get-Item.  Prove it?  Ok...

```
> dir | %{ $_.FullName } | Get-Item | %{$_.GetType()}

IsPublic IsSerial Name                                     BaseType
-------- -------- ----                                     --------
True     True     DirectoryInfo                            System.IO.FileSystemInfo
True     True     DirectoryInfo                            System.IO.FileSystemInfo
True     True     FileInfo                                 System.IO.FileSystemInfo
True     True     FileInfo                                 System.IO.FileSystemInfo
True     True     FileInfo                                 System.IO.FileSystemInfo
True     True     FileInfo                                 System.IO.FileSystemInfo
True     True     FileInfo                                 System.IO.FileSystemInfo
True     True     FileInfo                                 System.IO.FileSystemInfo
True     True     FileInfo                                 System.IO.FileSystemInfo
True     True     FileInfo                                 System.IO.FileSystemInfo
```

So we have just bound **ByValue**, we've passed an array and it went to Path because of the value it was.

### By Property Name Pipeline'ing

So how do we pass **ByPropertyName**?  Let us continue the above example:

```
> dir | %{ @{ Path=$_.FullName} }

Name                           Value
----                           -----
Path                           C:\source\Highway\MVC\build
Path                           C:\source\Highway\MVC\src
Path                           C:\source\Highway\MVC\.gitignore
Path                           C:\source\Highway\MVC\license.txt
Path                           C:\source\Highway\MVC\make.ps1
Path                           C:\source\Highway\MVC\NDesk.Options.dll
Path                           C:\source\Highway\MVC\OnRamper.exe
Path                           C:\source\Highway\MVC\push.ps1
Path                           C:\source\Highway\MVC\README.markdown
Path                           C:\source\Highway\MVC\setv.ps1
```

So here we have created a bunch of Hashtables that contain a property named Path.  Now this is to simple, it doesn't make that point that we could have other data included in these hashtables.  So I'm going to add some of that, but limit the number of files:

```
> dir *.ps1 | %{ @{ Path=$_.FullName; Size=$_.Length; Updated=$_.LastWriteTime} }

Name                           Value
----                           -----
Path                           C:\source\Highway\MVC\make.ps1
Size                           211
Updated                        5/4/2013 11:11:03 AM
Path                           C:\source\Highway\MVC\push.ps1
Size                           62
Updated                        5/4/2013 12:16:29 PM
Path                           C:\source\Highway\MVC\setv.ps1
Size                           332
Updated                        5/4/2013 11:26:16 AM
```

Ok, three entries, each with three properties, and we're good ... Right?  **sigh** No.  So you'll see from the output, these are not properties.  They are entries in a Hashtable, and are outputted vertically under **Name** and **Value** because of this.  We can easily turn this into a real object with properties though, using a cast to `PSCustomObject` which is the PowerShell `dynamic` object.

```
> dir *.ps1 | %{ [PSCustomObject]@{ Path=$_.FullName; Size=$_.Length; Updated=$_.LastWriteTime} }

Path                                                                       Size Updated
----                                                                       ---- -------
C:\source\Highway\MVC\make.ps1                                              211 5/4/2013 11:11:03 AM
C:\source\Highway\MVC\push.ps1                                               62 5/4/2013 12:16:29 PM
C:\source\Highway\MVC\setv.ps1                                              332 5/4/2013 11:26:16 AM
```

Alright, now we have the horizontal labels for our properties, and values below that.  Awesome.  Now lets pipe that to Get-Item:

```
> dir *.ps1 | %{ [PSCustomObject]@{ Path=$_.FullName; Size=$_.Length; Updated=$_.LastWriteTime} } | Get-Item


    Directory: C:\source\Highway\MVC


Mode                LastWriteTime     Length Name
----                -------------     ------ ----
-a---          5/4/2013  11:11 AM        211 make.ps1
-a---          5/4/2013  12:16 PM         62 push.ps1
-a---          5/4/2013  11:26 AM        332 setv.ps1
```

Bingo, we bound Path to Get-Item.  That gives you an example now of both types of Pipeline'ing.

## Functions

Now that we understand pipelines, how do we start to create reusable functionality?  Well, to do that we need to write functions.  And so, lets look at this in practice with everyone's favorite demo ... Hello World!

### Basic Script Blocks

We can create a script block simply by using a set of curly braces `{ }`.  Like so:

```
> { "Hello World!" }
 "Hello World!"	
```

That output is kind of odd, right?  It didn't output the string, because that would not have the quotes.  What type of object did that return?

```
> { "Hello World!" }.GetType()

IsPublic IsSerial Name                                     BaseType
-------- -------- ----                                     --------
True     True     ScriptBlock                              System.Object
```

Oh, so it's a script block!  Ok, is that the string representation of the block then?

```
> { "Hello World!" }.ToString()
 "Hello World!"
```

Ah!  Yep, that's what happened.  So how do I run a script block?  Just stick a `.` or `&` in front of it.

```
> .{ "Hello World!" }
Hello World!
> &{ "Hello World!" }
Hello World!
```

Yep, both of those do indeed execute, we lose the quotes, and all is well.  So we now have a code block.

### Named Functions

But what if I want to name that script block?  Easy, we define a function:

```
> function HW { "Hello World!" }
>
```

Done, we've defined that block now as HW.  How do I run it?  I type `HW` of course!

```
> HW
Hello World!
```

Now I can assign a script block simply to a variable if I want, but if I do so, then I still need to use `&` or `.` to execute it, where-as functions are called by name. See:

```
> $hw = { "Hello World!" }
> $hw
 "Hello World!"
> &$hw
Hello World!
> .$hw
Hello World!
```

But functions also have an important other aspect, which is that they can have parameters.  So let's create a function which takes a parameter, but lets say we want to pass it a location:

```
> function HW {
>> param($location)
>> "Hello $location!"
>> }
>>
> HW Dallas
Hello Dallas!
```

Now, we can specify types for parameters, so that we can't pass bad data:

```
> function HW {
>>  param([int]$location)
>> "Hello $location!"
>> }
>>
> HW Dallas
HW : Cannot process argument transformation on parameter 'location'. Cannot convert value "Dallas" to type
"System.Int32". Error: "Input string was not in a correct format."
At line:1 char:4
+ HW Dallas
+    ~~~~~~
    + CategoryInfo          : InvalidData: (:) [HW], ParameterBindingArgumentTransformationException
    + FullyQualifiedErrorId : ParameterArgumentTransformationError,HW

> hw 123
Hello 123!
```

See that we got an error now when we passed the Dallas string, but when we passed 123, we succeeded.  Now we can change this pipe in an array, passing **ByValue**:

```
> 1..5 | HW
Hello 0!
```

Huh... that didn't do what we expected.  I guess we'll have to give a hint that we want that Parameter to be pipelined.

```
> function HW { param( [Parameter(ValueFromPipeline=$true)][int]$location )
>> "Hello $location" }
>>
> 1..5 | HW
Hello 5
```

Ok, but still not "correct".  Why?  Because as it happens, we're using the simple form of a script blocks.  A script block is **actually** defined by three sections: Begin, Process, and End.  By default, if we don't specify a section, we get **End**.  What are the differences?  Begin runs once, before pipleline values are bound.  Process is run once for each member of the pipeline.  End runs after all members have been process.  How do we know that we get **End** by default?  Look at the value we got, it was the last value of the pipeline.

```
> function HW { param( [Parameter(ValueFromPipeline=$true)][int]$location )
>>  BEGIN { "Beginning : $location" }
>>  PROCESS {"Processing : $location"}
>>  END {"Ending: $location"}}
>>
> 1..5 | HW
Beginning : 0
Processing : 1
Processing : 2
Processing : 3
Processing : 4
Processing : 5
Ending: 5
```

So here we have redefined our function, and given it a **Begin**, **Process** and **End** block.  And we can see that $location, **because it is marked from pipeline**, is not set until we are in Process, and then we run process 5 times, and finally we run ending once.

### Branching

So... it is not programming without if blocks, right?  Well we've got those:

```
> function HW { param( [Parameter(ValueFromPipeline=$true)][int]$location )
>>  BEGIN { "Beginning : $location" }
>>  PROCESS { if(($location % 2) -eq 0) { "Processing : $location" } else { "Else" } }
>>  END {"Ending: $location"}}
>>
> 1..5 | HW
Beginning : 0
Else
Processing : 2
Else
Processing : 4
Else
Ending: 5
```

### Looping

First ... don't loop, pipeline.  But when you must loop, do so these ways:

```
> function DoWhile { $i = 1; do { Write-Host $i; $i++ } while ($i -le 5) }
> DoWhile
1
2
3
4
5
```

```
> function WhileLoop { $i = 1; while ($i -le 5) { Write-Host $i;$i++} }
> WhileLoop
1
2
3
4
5
```
```
> function ForLoop { for ($i=1;$i -le 5;$i++) {Write-Host $i} }
> ForLoop
1
2
3
4
5
```
```
> function ForEachLoop { $ints=@(1..5); foreach ($i in $ints) {Write-Host $i} }
> ForEachLoop
1
2
3
4
5
```

Those cover all of the major types of looping, and do so in a clean way, very similar to the C# syntax in all cases.
