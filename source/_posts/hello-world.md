title: Hello World
---
## 0. Blog的由来
作为一个学计算机的，一直想整个自己的Blog~=￣ω￣=~，尤其是最近在搞前端。
先是看到[jekyll](http://jekyllcn.com/)感觉不错，折腾了半天感觉还是不够给力。
最后还是选择了[hexo3](https://hexo.io/)。
<!-- more -->

	主要是这几个优点吧：
	  * 免费╮(╯▽╰)╭             (jekyll也是)
	  * 基于node.js                 (jekyll基于ruby)
	  * 速度快、操作更简单、命令少     (专注于写作本身)
	  * 由于deploy命令，发布到github上也很简单

　　所以整个Blog就是采用[hexo3](https://hexo.io/) + [github pages](https://pages.github.com/),对了，主题是采用[concise](https://github.com/BuptStEve/concise)。(当然以后还要修改的啦╮(╯▽╰)╭)下面就详细说说怎么搭起来吧...

---

## 1. hexo的安装
hexo是用node.js开发的，所以我们先要安装node.js环境，去[node.js](https://nodejs.org/en/)官网，点击INSTALL就可以根据你的系统版本下载相应的安装包。  

安装完成后，在命令行运行：
```bash
	npm install -g hexo
```
** npm安装方式中 -g 的意思是全局安装。**

---

## 2. 初体验~\\(≧▽≦)/~
1. 找到一个合适的位置，创建我们的项目文件夹：
- 一般的用户：自己图形界面新建了一个
- 命令行用户：`mkdir <folder>`
- hexo的用户：`hexo init <folder>`



