---
layout: post
title: "Working with Dynamic Schema in Azure Mobile Services"
date: 2012-12-12 11:45
comments: true
categories: azure mobile
---

Lately I've been developing on a side project using the awesome [Azure Mobile Services][ams] offering from Microsoft.  Specifically I've been developing a Windows Phone 8 application, the details of which will be revealed in time.  One of the best features of Azure Mobile Services is the ability to work with a Dynamic Schema, it will automatically insert new columns for fields it has never received before.

There are many great reasons for this during development.  It allows for rapid iteration, which is great.  But, let's take the example of the [Todo Hands On Lab][hol], and look at the DataContract established for it's entity.

``` csharp
    public class TodoItem
    {
        public int Id { get; set; }

        [DataMember(Name = "text")]
        public string Text { get; set; }

        [DataMember(Name = "complete")]
        public bool Complete { get; set; }
    }
```

Now, lets say I wanted to add a property called Description to this, I might update the above code as follows:

``` csharp
    public class TodoItem
    {
        public int Id { get; set; }

        [DataMember(Name = "text")]
        public string Text { get; set; }

        [DataMember(Name = "complete")]
        public bool Complete { get; set; }

        [DataMember(Name = "description")]
        public string Description { get; set; }
    }
```

If I change nothing else other than this, I when I run my program I'd expect that the Description column would be added to the database when I saved a new item.  But, instead, I get the following exception when I save an item:

<pre>
Microsoft.WindowsAzure.MobileServices.MobileServiceInvalidOperationException was unhandled by user code
  HResult=-2146233079
  Message=Error: Unable to insert a null value for new property 'description'
  Source=Microsoft.Azure.Zumo.WindowsPhone8.Managed
  InnerException:
</pre>

I was more than a little baffled by this concept, my first read of this exception got me thinking things like: "*who on earth would design a dynamic data feature to create NON NULLABLE FIELDS?!?!?*" and other less kind statements.  Well, as they say, pride commeth before the fall.  As I've researched this error, I've realized it's entirely reasonable.  Why?  Ah... REST.

Azure Mobile Services data offering is built as a set of RESTful services, using JSON serialization.  That means that initially my request to add an entry named "Foo" would have looked like this:

``` js
{
  id:0,
  text:'Foo',
  complete:false
}
```

When I added the additional field but didn't set a value for it, the serializer added it to the submitted output, resulting in:

``` js
{
  id:0,
  text:'Foo',
  complete:false
  description:null
}
```

Sure, that makes sense ... Unless your the SQL Server who is now being asked to add that new field.  Why?  Because you've got NO IDEA what the data type of description is.  Whoops!  So how do we solve this?  Well, there are a couple of ways we can do that.

1. We could add the field manually in SQL Server, specifying the data type desired.  This works great, but kindof unravels the whole point of Dynamic Schema.
1. We could put in temporary code, so that the first time we send this up, it's populated.  After that, the field is nullable so there is no problem storing nulls from that point onward.  I'm not a big fan of "secret recipes" in code bases, and this model leaves no trace for the next guy of the "proper procedure" so I decided against it.
1. We could add a Setup script, which pushed a single completely populated entity.  This could be run all sorts of ways, from a unit test to a rake task, but would ensure the schema desired.  This solution is better, but still a little buried for me.
1.  We could make the DBAs amongst us cry, and decide that our entities will provide a default value for reference types such as string (note value types don't have this problem, they can't be null) in the constructor of our type.  This technically takes more space, and I'm certain the DBAs will yell at me about other reasons, but on the other hand it leaves a clear pattern to be followed by future developers.

I chose option 4.  That resulted in this code:

``` csharp
    public class TodoItem
    {
        public TodoItem()
        {
            Text = "";
            Description = "";
        }

        public int Id { get; set; }

        [DataMember(Name = "text")]
        public string Text { get; set; }

        [DataMember(Name = "complete")]
        public bool Complete { get; set; }

        [DataMember(Name = "description")]
        public string Description { get; set; }
    }
```

Now, you can feel free to make a different choice, but for me and my project, this pattern is working just fine.

[ams]: http://chriskoenig.net/2012/10/17/new-azure-sdk-and-services-updates/
[hol]: https://github.com/WindowsAzure-TrainingKit/HOL-Windows8AndMobileServices/blob/master/HOL.md
