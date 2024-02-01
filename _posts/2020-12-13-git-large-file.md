---
layout: post
title: "Gti Large File 用法"
date: 2020-12-13T00:20:00Z
tags: [git]
---

Track a perticular file, 
```bash 
git lfs track 'xxxxx'
```

Show which files are tracked, 
```bash
git lfs track
```

Update `.gitattributes` and add files to commit, 
```bash 
git add .gitattributes
git add xxxxx
git commit -m "added file xxxxx"
```

The status of the lfs, 
```bash 
git lfs ls-files
```

Finally, push the changes 
```bash 
git push
```