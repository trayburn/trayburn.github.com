---
layout: post
title: "Introducing SWTOR.Parser"
date: 2012-03-19 10:50
comments: true
categories:
---
![SWTOR]({{ site.url }}/images/swtor.jpg)

I'm pleased today to introduce to all of you a new project, [hosted on GitHub][sp], called [SWTOR.Parser][sp].  SWTOR.Parser is a C# library to parse the combat logs of Star Wars : The Old Republic that are now available on their Test Server, and will be introduced into the main game in Patch 1.2.  This library at the current time is very simple, it will read from any System.IO.TextReader, and return an IList<LogEntry>.  LogEntry and it's related classes are a simple C# domain object.  The domain classes are simple POCO classes, and can be easily serialized into JSON or anything else you might want.

This library does not yet contain any analysis code for analyzing logs, it is just a DLL which handles the parsing.  Over the coming weeks I intend to introduce analysis systems for these log files, and welcome any pull requests to that end, but now that the logs are available publicly on the Test Server I thought it time to make this much public so others do not need to replicate the effort.

If you're interested in contributing, [fork the project and send me a pull request][sp].

[sp]: https://github.com/trayburn/SWTOR.Parser
