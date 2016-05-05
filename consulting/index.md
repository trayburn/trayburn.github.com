---
layout: post
title: Consulting
display_category: consulting
date: 2014/12/15
image: ie-logo.jpg
---

## It's what we do...

I work for an amazing company, [Improving Enterprises](http://improving.com), that is an international IT consultancy, headquartered in Dallas.  I've had the pleasure of working with this amazing group of people since 2009, and you would be hard pressed to find a more professional group anywhere.  Core to our company are three guiding values : Excellence, Dedication, and Involvement.

### Always looking for more Improvers

We are constantly on the lookout for more people to join our ranks, in all of our locations.  If you are interested in working for a phenomenal company, dedicated to its core to the pursuit of excellence, then reach out.  Be it Dallas, Houston, College Station, Columbus, Calgary, or anywhere else we have an office let me know and I'll get you in touch with the right people.

### Related Blog Posts

{% for rel_post in site.categories[page.display_category] limit:5 %}
* [{{ rel_post.title }}]({{ rel_post.url | prepend: site.baseurl }})
{% endfor %}
