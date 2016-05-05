---
layout: post
title: "ASP.NET MVC Reserved Words"
date: 2014-07-03 15:41
comments: true
---

A project I'm on recently encountered a little known bug that I had to share, mostly so I can google my own brain later on this.  MVC has a set of reserved words that cannot appear in your URLs.  This includes `CON`, `COM1`-`COM9`, `LPT1`-`LPT9`, `AUX`, `PRT`, `NUL`, etc.

So how do I disable this lovely feature?

``` xml
<configuration>
  <system.web>
    <httpRuntime relaxedUrlToFileSystemMapping="true"/>
  </system.web>
</configuration>
```

More details can be found at [Phil Haack's post about this same topic](http://haacked.com/archive/2010/04/29/allowing-reserved-filenames-in-URLs.aspx/).
