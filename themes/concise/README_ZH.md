# Concise

[README](/README.md) | 
[Concise主题介绍](http://opiece.me/2015/04/23/Concise-introduce/) | 
[Concise's wiki](https://github.com/huangjunhui/concise/wiki/Concise)<br>
Concise是一款我正在使用的hexo主题。它基于light和pacman修改而来，欢迎访问我的博客来看看Concise的样子。[Concise's Demo](http://opiece.me/).

## 安装

执行以下命令。

```
git clone https://github.com/huangjunhui/concise.git themes/concise
```

## 启用

修改博客根目录下的配置文件 `_config.yml`，把`theme`的值修改为 `concise`。

## 更新

执行以下命令。

```
cd themes/concise
git pull origin master
```
**请先备份您主题目录下的 `_config.yml` 文件后再升级。**

##Configuration

修改`/themes/concise/_config.yml`中的配置。


## 功能

- **menu** - 菜单栏，位于博客的右上方。
- **widget** - 侧边栏的控件。包括搜索，分类，标签，标签云，微博秀，最新评论，友情链接。
- **excerpt_link** - 摘录文章底部的"阅读更多"文本链接。
- **duoshuo_enable** - 是否使用多说
- **duoshuo_shortname** - 多说评论的shortname，在多说官网注册一个自己的站点，生成代码，即可看见自己的shortname。
- **tencent_sid** - 腾讯分析sid，在代码中可以获得。
- **baidu_sid** - 百度统计sid，该sid为百度统计代码中：hm.src = "//hm.baidu.com/hm.js?之后的一串字符
- **Image** - 网站图标，作者头像，网站logo。
- **twitter** - Twitter插件配置。
  - **username** - 用户名
  - **show_replies** - 是否显示回复
  - **tweet_count** - 显示的twitter数目
- **fancybox** - 是否开启fancybox，fancybox是一款查看图片工具。
- **google_analytics** - 谷歌统计工具。
- **rss** - RSS订阅。
- **author** - 作者的相关信息，包括2行介绍，微博，github，fackbook，twitter等。


**PS**：本主题提供的源码自带的站内搜索为light主题自带的google，如果您想修改成跟我博客一样的站内搜索，请看教程[使用swiftype实现站内搜索](http://opiece.me/2015/04/16/site-search-by-swiftype/)

