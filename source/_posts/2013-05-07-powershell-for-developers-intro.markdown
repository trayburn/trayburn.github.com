>  I must go down to the seas again, to the lonely sea and the sky,
>  And all I ask is a tall ship and a star to steer her by, 
>  And the wheel's kick and the wind's song and the white sail's shaking, 
>  And a gray mist on the sea's face, and a gray dawn breaking.
>  -- Sea Fever by John Masefield

Every developer knows that in order to be successful at their chosen profession, they need to keep the best tools at their disposal.  We all have our favorite text editors, and our favorite comparison tools, and the wise among us also have our favorite scripting languages and command line environments.

I am an unabashed fan of GIT, and as such for several years now I've used the `bash` shell as my command line environment of choice.  But I recently started paying more attention to `PowerShell` and I realized that I had not at all given it it's due when I first learned about it several years ago.  I've spoken recently with @DevlinLiles, @AmirRajan, @CoriDrew, and @BForrest about this, and I realized that I wasn't alone at all in this.  Most developers working in .NET languages have mostly ignored PowerShell.  I intend this series of blog posts to correct this issue.

## The Basics

>  Let's start at the very beginning
>  A very good place to start
>  When you read you begin with A-B-C
>  When you sing you begin with do-re-mi
>  -- "Do-Re-Mi" by Rodgers & Hammerstein 

### PowerShell 3.0

So how do I use the `PowerShell` thing, Tim?  Easy.  First, we need to know what version of Windows you're using now, because we might want to upgrade you to the latest version.  If you're using **Windows 8** or **Windows Server 2012** then you're good, you already have PowerShell 3.0.  If you're using **Windows 7** or **Windows Server 2008** or **Windows Server 2008 R2**, then you need to download the [Windows Management Pack 3.0](http://www.microsoft.com/en-us/download/details.aspx?id=34595) which upgrades you to PowerShell 3.0.

Not sure if someone else might have already installed it?  Just open PowerShell (hint: Win+R -> `PowerShell` **enter**) and enter `$host.version` at the prompt.

```
> $host.version

Major  Minor  Build  Revision
-----  -----  -----  --------
3      0      -1     -1
```

The above it what we're looking for, anything else, and you need to install the [Windows Management Pack 3.0](http://www.microsoft.com/en-us/download/details.aspx?id=34595).

### Variables

The first thing you need to know about PowerShell is how to create a variable.  This is very simple, you just assign it to a variable name.  In PowerShell, all variables are preceded by a `$`.  So if you want to create a variable X and assign the integer value 1 to it, you would type:

```
> $X = 1
```

Important to know, especially for C# developers, is that PowerShell is **case-insensitive**.  As such, `$X` is the same as `$x`.

#### Value Types

Now, .NET developers, pay attention to this.  In PowerShell all variables are actual objects, not just string values.  What do I mean?  Type this:

```
> $X.GetType()

IsPublic IsSerial Name                                     BaseType
-------- -------- ----                                     --------
True     True     Int32                                    System.ValueType
```

**Holy smoke!** That variable is an `Int32`, I mean a real `System.Int32`.

Because of this, we can use any type of methods that might exist on those objects.  For instance, we could type:

```
> $X.Equals(4)
False
```

So how do we create non-value types then?  That depends...

#### Reference Types via New-Object

Most of the time, we are used to creating .NET objects by typing something like `var dt = new System.DateTime()` but in PowerShell we have something similar, but different:

```
> $dt = New-Object System.DateTime
```

You can always check the value of a variable, just by typing it's name at the prompt like this:

```
> $dt

Monday, January 1, 0001 12:00:00 AM
```

That makes total sense, that is the default value of a DateTime aka `default(DateTime)` in C#.  But in reality, I tend to use `System.DateTime.Now` to get the system time, more often than I do `new DateTime()`, so how to I do that in PowerShell?

#### Reference Types via Static Properties & Methods

So if we want to access the .NET Framework's static types, we simply need to reference the type, and then the method, as follows:

```
> [System.DateTime]::Now

Monday, May 6, 2013 10:22:26 PM
```

Now, if we wanted to assign that to our variable, we would just do:

```
> $dt = [System.DateTime]::Now
```

Please note, when we assign the value to a variable, we no longer get output to the console.  We'll see how to change that in just a bit.

### Arrays

Arrays are common in all programming languages, they represent a series of values.  In PowerShell, those values are not required to be of the same type, you can think of all Arrays in .NET terms as `System.Object[]`, an array of Objects.

Declaring and using arrays could not possibly be easier in PowerShell, we simply put together a series of values, separated by commas.

```
> 1,2,3
1
2
3
```

As I noted above, they don't have to be of the same type:

```
> 1,"abc",[System.DateTime]::Now
1
abc

Monday, May 6, 2013 10:28:15 PM
```

And that is all there is to arrays.  You can add members to arrays many ways, but the simplest is as follows:

```
> $arr = 1,2,3
> $arr
1
2
3
> $arr = $arr + 4,5,6
> $arr
1
2
3
4
5
6
```

### Hashtable

There is one other type of object which is critical to the world of PowerShell, and that is the Hashtable.  PowerShell is a dynamic language, in fact as of 3.0 it's even built on top of the Dynamic Language Runtime, but as such it needs a flexible structure for storing loosely types objects.  Enter the Hashtable.

The syntax for Hashtable couldn't possibly be easier, to create one you just use `@{ key=value; key2=value2}` So for instance, if you want to create a Hashtable to store a bunch of people, you could do so like this:

```
> $tim = @{ FirstName="Tim";LastName="Rayburn"}
> $cori = @{ FirstName="Cori";LastName="Drew"}
> $barry = @{ FirstName="Barry";LastName="Forrest"}
```

Now, as we learned in the last section, we can create an array just by separating items by commas, so lets do so, and then sort these people by FirstName:

```
> $tim,$cori,$barry | Sort-Object FirstName

Name                           Value
----                           -----
LastName                       Forrest
FirstName                      Barry
LastName                       Drew
FirstName                      Cori
LastName                       Rayburn
FirstName                      Tim
```

As you can see, Barry is now listed first, then Cori, then Tim.  Don't worry about understanding Sort-Object just yet, we'll get into how that line works more in the next post.

Now, lets imagine I want to add a value for Employer to each of these.  How to I change a Hashtable once it has been created?  Easy, just refer to a property that doesn't exist yet, and set its value.

```
> $tim.Employer = "Improving Enterprises"
> $barry.Employer = "Improving Enterprises"
> $cori.Employer = "Improving Enterprises (Contractor until August)"
```

### Constants

In addition to all of the above, there are a couple of constants which you might want to know about when developing.  `$null` is the constant value of a Null Reference.  In addition there are constants for `$true` and `$false` though if a boolean is expected you can also always use `1` or `0` respectively.
