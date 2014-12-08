---
layout: post
title: "Start a process as another User in PowerShell"
date: 2014-06-12 11:41
comments: true
categories: powershell
---

Got asked an interesting question today, and the answer is worth sharing with everyone.  If you have the username and password of another user, and want to run a command using their account, how would you do that?  Like so:


``` powershell
# Test Data
# ---------
$userName = "FooBar"
$password = "FooBar"

# Helper Functions
# ----------------
function New-Credential($u,$p) {
    $secpasswd = ConvertTo-SecureString $p -AsPlainText -Force
    return New-Object System.Management.Automation.PSCredential ($u, $secpasswd)
}

# Do The Work
# -----------
$cred = New-Credential $userName $password
Start-Process cmd.exe -arg "/k whoami.exe" -Credential $cred
```
