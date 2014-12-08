---
title: "Command Line FTW!"
layout: post
---

> TL;DR Summary : BASH command line to extract the most often repeated line of text from a log file: *cat filename.log \| sort \| uniq -c \| sort -nr*	

I was reading some blog posts by my friend [Cori Drew][cd] who is in the process of changing into a command line user, when I realized I've been doing some very cool log analysis recently which I should blog about.  I've have two different situations recently in which I was thrust into analyzing log files.  The first was a web site which was throwing logging large numbers of exceptions in production which were not happening in lower environments.  The second was a performance challenge, attempting to determine which indexes would be best applied to a Mongo database.

In the first challenge, I had a log file composed mostly of .NET stack traces, and I they seemed to be from "all over the place", no one component being the source of the exceptions.  But I suspected that some component was shared in common between these various exceptions, so I realized I wanted to do the following things:

* Sort the lines of the file, so all the duplicates were next to each other.
* Get a count of each distinct lines number of repeats.
* Find the line which repeated the most often.

Now I've been in this programming field for a long time now, and it has taught me some very important lessons, the first and most important is that if you're manipulating long files of text, a DOS prompt is not the place to do it, and neither is a GUI.  So I openned my handy-dandy BASH shell which I use for GIT, and other stuff.  After a little bit of google'ing, I realized that I had everything I needed:

* sort - sorts lines of a file
* uniq -c - counts all the unique lines, and puts the count at the front of each line of the output.
* sort -nr - sorts, backwards, with numeric rules (hence sorting the numbers put in by uniq)

This worked fantastically well, and quickly isolated to a base class on our security attributes of the MVC application as the true source of the exceptions in the application.  When just a week later the second situation occurred, having to analyze the logs of a mongod process for often executed queries, in hopes of finding good candidates for indexing, I returned to my command line friend and after a minor modification had exactly what I was looking for.

What was the minor modification?  The use of some [sed] and [grep] commands to remove everything other than query output, and then remove info from each line about the connection it was performed on, so that  I had a clean list of queries.  The final command for the Mongo analysis looked like this:

	cat mongo.log | grep "runQuery" | sed 's/ \[conn[0-9]*\]//' | sed 's/[A-Za-z]* [A-Za-z]* [0-9]* [0-9]*:[0-9]*:[0-9]* //' | sort | uniq -c | sort -nr

Simple eh?  No?  You might want to follow those links on [grep] and [sed] then.

[cd]: http://truncatedcodr.wordpress.com/
[grep]: http://cheat.errtheblog.com/s/grep
[sed]: http://cheat.errtheblog.com/s/sed/