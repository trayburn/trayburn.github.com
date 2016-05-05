---
layout: post
title: "Write Less Code - Theme Detection on Windows Phone 7"
date: 2012-06-16 21:33
comments: true
categories: mobile
---

I spent alot of time tonight trying to find an elegant solution to the problem of detecting the light or dark theme from Windows Phone 7 and changing images based on those options.  I was people that were doing a ToString in the Foreground Brush, or writing custom methods for every image in their code-behind, and all of that felt  ... dirty.  Finally I [came across this solution on StackOverflow][so] which is not the "accepted" answer, but is the highest voted answer.  It was good enough to get me to post the answer here as well, so I can remember it, and hopefully some of you who might be working to hard can find a more elegant solution.

``` xml
<Image
    Stretch="Fill"
    Visibility="{StaticResource PhoneLightThemeVisibility}"
    Source="/icons/light.tag.png" />
<Image
    Stretch="Fill"
    Visibility="{StaticResource PhoneDarkThemeVisibility}"
    Source="/icons/dark.tag.png" />
```

[so]: http://stackoverflow.com/questions/7198046/how-to-swap-images-based-on-the-current-theme-wp7
