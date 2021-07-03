

# Git

## 版本控制

版本控制是指对软件开发过程中各种程序代码、配置文件及说明文档等文件变更的管理。

常见的版本控制工具：SVN、GIT

1. 本地版本控制

   <img src="/Users/chenxiayu/Library/Application Support/typora-user-images/image-20200606185219416.png" alt="image-20200606185219416" style="zoom:50%;" />

2. 集中版本控制

   <img src="/Users/chenxiayu/Library/Application Support/typora-user-images/image-20200606185154878.png" alt="image-20200606185154878" style="zoom:50%;" />

3. 分布式版本控制

   <img src="/Users/chenxiayu/Library/Application Support/typora-user-images/image-20200606185400626.png" alt="image-20200606185400626" style="zoom:50%;" />

## SVN和GIT 区别

SVN 是集中式的版本控制系统， 版本库放在中央服务器，工作的时候需要从中央服务器取得最新版本，完成开发后推送到中央服务器，需要联网才能工作。

Git是版本控制系统，没有中央服务器，每个人的电脑都是一个完整的版本库，在自己电脑上提交修改，通过分支来互相合并代码

## Git 配置

```sh
➜  ~ git config --list # 配置列表
➜  ~ git config --system --list # 系统配置
➜  ~ git config --global --list # 用户（全局）配置
➜  ~ git config --global user.name 'xhl' # 用户名
➜  ~ git config --global user.email 'xhl@qq.com' # 邮箱
```

## Git 核心

<img src="/Users/chenxiayu/Library/Application Support/typora-user-images/image-20200606195231221.png" alt="image-20200606195231221" style="zoom:50%;" />

##### 工作目录（Working directory）

工作区：存放代码的目录

##### 暂存区（stage/index）

暂存区：用于存放改动，事实上只是一个文件，保存提交到文件列表信息

##### 仓库区（Repository）

仓库区：用于存放安全数据的地方

##### 远程仓库 （Remote directory）

远程仓库：托管代码的服务器

#### 工作流程

1. 在工作目录添加、修改文件 
2. 将需要进行版本管理的文件放入暂存区域（git add）
3. 将暂存区域提交到 git 仓库 （git commit）

## Git 命令

### 创建 git 仓库 （git init）

```sh
➜  ~ mkdir git-demo
➜  ~ cd git-demo
➜  git-demo ls
➜  git-demo git init
Initialized empty Git repository in /Users/chenxiayu/git-demo/.git/
➜  git-demo git:(master) ls
```

### 克隆 git 仓库（git clone）

```sh
➜  ~ git clone https://github.com/chichoyi/dnmp.git
```

#### Git 文件状态

Untracked：未跟踪，此文件在文件夹中，但是没有加入到git库，不参与版本控制，通过 `git add`  修改状态变成  `Staged`

Unmodify：文件已经入库，但是没有修改，如果被修改状态会变成  `Modify` ，如果使用  `git rm`	移出版本库，则变成  `Untracked`

Modify：文件已修改。通过 `git add` 可加入暂存库变成 `Staged` 状态，使用 `git checkout` 丢弃修改，返回 `Unmodify` 状态，`git checkout` 表示从库中取出文件，覆盖当前修改

Staged：暂存状态。执行 `git commit` 将修改同步到库中，此时文件就变成 `Unmodify` 状态，执行 `git reset HEAD filename` 取消暂存，文件状态变为  `Modify`

```sh
➜  git-demo git:(master) touch index.txt # 创建文件
➜  git-demo git:(master) ✗ git status index.txt # 查看 index.txt 文件状态 Untracked
On branch master

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)

	index.txt

nothing added to commit but untracked files present (use "git add" to track)
➜  git-demo git:(master) ✗ git add . # 添加到暂存区
➜  git-demo git:(master) ✗ git status index.txt # Unmodify
On branch master
...skipping...
GIT-COMMIT(1)                                                     Git Manual                                                     GIT-COMMIT(1)
No commits yet
Changes to be committed:
  (use "git rm --cached <file>..." to unstage)

	new file:   index.txt
➜  git-demo git:(master) ✗ git commit -m 'commit-index.txt' # 提交到本地仓库
[master (root-commit) a272327] commit-index.txt
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 index.txt
➜  git-demo git:(master) git status index.txt # Staged
On branch master
nothing to commit, working tree clean
➜  git-demo git:(master) vi index.txt # 修改
➜  git-demo git:(master) ✗ git status index.txt # modified
On branch master
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

	modified:   index.txt

no changes added to commit (use "git add" and/or "git commit -a")
➜  git-demo git:(master) ✗ git checkout -- index.txt # 使用老版本覆盖
➜  git-demo git:(master) git status index.txt # Staged
On branch master
nothing to commit, working tree clean
```

#### .gitingore

忽略不想提交到文件，比如数据库文件，临时文件等

```sh
*.txt # 忽略所有的 .txt 文件
!lib.txt # lib.txt 除外
/temp # /temp/目录中的文件
build/ # 忽略 build/目录中的文件
doc/*.txt # 忽略 doc/目录下的txt 但是不忽略doc下二级目录的文件
```

### Git 分支

<img src="/Users/chenxiayu/Library/Application Support/typora-user-images/image-20200607001032374.png" alt="image-20200607001032374" style="zoom:50%;" />

```sh
➜  js-demo git:(master) git branch # 查看本地分支
  dev1
  dev2
* master
➜  js-demo git:(master) git branch -r # 查看远程分支
  origin/HEAD -> origin/master
  origin/dev1
  origin/dev2
  origin/dev3
  origin/master
➜  js-demo git:(master) git branch dev4 # 新建一个分支
➜  js-demo git:(master) git checkout dev4 # git checkout -b [branch] 新建并切换到分支             
Switched to branch 'dev4'
➜  js-demo git:(dev4) git add .    # 提交到暂存区
➜  js-demo git:(dev4) ✗ git commit -m 'dev4-commit' # 提交到本地仓库
[dev4 22e093f] dev4-commit
 1 file changed, 3 insertions(+), 2 deletions(-)
➜  js-demo git:(dev4) git push origin dev4    # 推送到远程分支
Counting objects: 3, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (2/2), done.
Writing objects: 100% (3/3), 284 bytes | 284.00 KiB/s, done.
Total 3 (delta 1), reused 0 (delta 0)
remote: Resolving deltas: 100% (1/1), completed with 1 local object.
remote: 
remote: Create a pull request for 'dev4' on GitHub by visiting:
remote:      https://github.com/Luoyuda/js-demo/pull/new/dev4
remote: 
To https://github.com/Luoyuda/js-demo.git
 * [new branch]      dev4 -> dev4
➜  js-demo git:(dev4) git checkout master  # 切换到主分支  
Switched to branch 'master'
Your branch is up to date with 'origin/master'.
➜  js-demo git:(master) git merge dev4 # 合并dev4到主分支
Updating 803fc15..22e093f
Fast-forward
 README.md | 5 +++--
 1 file changed, 3 insertions(+), 2 deletions(-)
➜  js-demo git:(master) git push origin master # 推送到主分支
Total 0 (delta 0), reused 0 (delta 0)
To https://github.com/Luoyuda/js-demo.git
   803fc15..22e093f  master -> master 
```

#### 解决冲突

1. 当 dev2 和 dev4 两个分支都在进行开发，且文件部分冲突时
2. 先由 dev4，合并 dev2 的分支内容，然后解决冲突后，再提交到远程到dev4
3. 切换到主分支 合并 dev4 到 主分支

```sh
➜  js-demo git:(master) git checkout dev4 # 切换到 dev4
Switched to branch 'dev4'
➜  js-demo git:(dev4) git add .                                
➜  js-demo git:(dev4) ✗ git commit -m 'dev4-commit-01'
[dev4 3a63bee] dev4-commit-01
 1 file changed, 3 insertions(+), 2 deletions(-)
➜  js-demo git:(dev4) git push origin dev4 # 提交修改到远程   
Counting objects: 3, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (2/2), done.
Writing objects: 100% (3/3), 288 bytes | 288.00 KiB/s, done.
Total 3 (delta 1), reused 0 (delta 0)
remote: Resolving deltas: 100% (1/1), completed with 1 local object.
To https://github.com/Luoyuda/js-demo.git
   22e093f..3a63bee  dev4 -> dev4
➜  js-demo git:(dev4) git checkout dev2 #切换到 dev2   
Switched to branch 'dev2'
Your branch is up to date with 'origin/dev2'.
➜  js-demo git:(dev2) git merge master 
Updating 09513dc..22e093f
Fast-forward
 README.md | 13 ++++++++++++-
 1 file changed, 12 insertions(+), 1 deletion(-)
➜  js-demo git:(dev2) git add .       
➜  js-demo git:(dev2) ✗ git commit -m 'dev2-commit-01'
[dev2 7c38498] dev2-commit-01
 1 file changed, 3 insertions(+), 2 deletions(-)
➜  js-demo git:(dev2) git push origin dev2 # 推送到远程 dev2
Counting objects: 3, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (2/2), done.
Writing objects: 100% (3/3), 289 bytes | 289.00 KiB/s, done.
Total 3 (delta 1), reused 0 (delta 0)
remote: Resolving deltas: 100% (1/1), completed with 1 local object.
To https://github.com/Luoyuda/js-demo.git
   09513dc..7c38498  dev2 -> dev2
➜  js-demo git:(dev2) git checkout dev4 # 切换 dev4        
Switched to branch 'dev4'
➜  js-demo git:(dev4) git merge dev2 # 合并 dev2 到 dev4
Auto-merging README.md
CONFLICT (content): Merge conflict in README.md
Automatic merge failed; fix conflicts and then commit the result. # 出现冲突 解决冲突后 提交修改
➜  js-demo git:(dev4) ✗ git add .     
➜  js-demo git:(dev4) ✗ git commit -m 'dev4-merge-commit-01'
[dev4 89c31f4] dev4-merge-commit-01
➜  js-demo git:(dev4) git push origin dev4                
Counting objects: 3, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (2/2), done.
Writing objects: 100% (3/3), 315 bytes | 315.00 KiB/s, done.
Total 3 (delta 1), reused 0 (delta 0)
remote: Resolving deltas: 100% (1/1), completed with 1 local object.
To https://github.com/Luoyuda/js-demo.git
   3a63bee..89c31f4  dev4 -> dev4
➜  js-demo git:(dev4) git checkout master # 切换主分支
Switched to branch 'master'
Your branch is up to date with 'origin/master'.
➜  js-demo git:(master) git merge dev4 # 合并到主分支
Updating 22e093f..89c31f4
Fast-forward
 README.md | 6 ++++--
 1 file changed, 4 insertions(+), 2 deletions(-)
```

#### git stash

当忽然需要切换分支，且当前开发并不想提交的时候，通过 git stash 来储藏起来

```sh
➜  js-demo git:(master) ✗ git stash push -m 'stash-001' # 储藏起来                         
Saved working directory and index state WIP on master: 89c31f4 dev4-merge-commit-01
➜  js-demo git:(master) git stash list # 查看 stash 列表
stash@{0}: On dev4: stash-001
stash@{1}: On master: test
stash@{2}: On master: commit
stash@{3}: On master: vs-code
➜  js-demo git:(master) git checkout dev4                      
Switched to branch 'dev4'
# ➜  js-demo git:(dev4) git stash apply 0 # 应用第几个储藏，用完不删
# ➜  js-demo git:(dev4) ✗ git stash drop 0 # 删除储藏
# Dropped refs/stash@{0} (9dac3b9c7564e205420eaa55c606210c78343607)
➜  js-demo git:(dev4) git stash pop # 用完并删除
On branch dev4
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

        modified:   README.md

no changes added to commit (use "git add" and/or "git commit -a")
Dropped refs/stash@{0} (ccf1ac4b8f136bf1c4ebb5f2f5c54f1e54e1cf97)
```

#### Git Rebase

Rebase 实际上就是取出一系列的提交记录，“复制”它们，然后在另外一个地方逐个的放下去。

Rebase 的优势就是可以创造更线性的提交历史

<img src="/Users/chenxiayu/Library/Application Support/typora-user-images/image-20201204143731672.png" alt="image-20201204143731672" style="zoom:80%;" />

<img src="/Users/chenxiayu/Library/Application Support/typora-user-images/image-20201204144212521.png" alt="image-20201204144212521" style="zoom:80%;" />

